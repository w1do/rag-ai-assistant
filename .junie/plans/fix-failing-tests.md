---
sessionId: session-260630-004711-x8zn
---

# Requirements

### Overview & Goals
Fix all 44 failing tests so the full test suite passes. There are 4 distinct root causes.

### Root Causes

#### 1. CSRF 419 errors (most tests)
All POST/PATCH/DELETE tests fail with HTTP 419 because `VerifyCsrfToken` middleware is active during tests. The fix is to add `$this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)` globally in `tests/Pest.php` (or use `withCsrf()` / `withoutMiddleware()` per test).

#### 2. Auth routes 404 (`/register`, `/login`, etc.)
Auth routes are registered under the `/dashboard` prefix (`/dashboard/register`, `/dashboard/login`), but the Breeze-generated test files use bare paths like `/register`, `/login`, `/logout`, `/forgot-password`, etc. Tests must use `route('register')`, `route('login')`, etc. (named routes) instead of hardcoded paths.

#### 3. ExampleTest `/` returns 302
`GET /` requires auth and redirects unauthenticated users. The test expects 200. Fix: update `ExampleTest` to either authenticate the user or assert 302, or test a public route like `/chats`.

#### 4. UUID validation error in chunk tests
`chunks.qdrant_id` is a PostgreSQL `uuid` column. Tests in `KnowledgeDeletionTest` and `IndexAssistantDocumentsActionTest` insert fake values like `'uuid-1'` and `'old-uuid-1'` which are not valid UUIDs. Fix: replace with `Str::uuid()` generated values.

# Technical Design

### Affected Files

 File | Issue | Fix |
------|-------|-----|
 `tests/Pest.php` | No CSRF bypass | Add `->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)` to global `pest()->extend()` chain |
 `tests/Feature/Auth/RegistrationTest.php` | Hardcoded `/register` | Use `route('register')` |
 `tests/Feature/Auth/AuthenticationTest.php` | Hardcoded `/login`, `/logout` | Use `route('login')`, `route('logout')` |
 `tests/Feature/Auth/PasswordResetTest.php` | Hardcoded `/forgot-password`, `/reset-password` | Use named routes |
 `tests/Feature/Auth/PasswordConfirmationTest.php` | Hardcoded `/confirm-password` | Use `route('password.confirm')` |
 `tests/Feature/Auth/PasswordUpdateTest.php` | Hardcoded `/password` | Use `route('password.update')` |
 `tests/Feature/Auth/EmailVerificationTest.php` | Hardcoded `/verify-email` | Use `route('verification.notice')` |
 `tests/Feature/ExampleTest.php` | `/` requires auth | Assert 302 or use authenticated user |
 `tests/Feature/KnowledgeDeletionTest.php` | Invalid UUID strings | Replace `'uuid-1'`, `'uuid-2'` with `(string) Str::uuid()` |
 `tests/Feature/Domain/Assistant/Actions/IndexAssistantDocumentsActionTest.php` | Invalid UUID string | Replace `'old-uuid-1'` with `(string) Str::uuid()` |

### CSRF Fix Detail
```php
// tests/Pest.php
pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->beforeEach(fn () => $this->withoutVite())
    ->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)
    ->in('Feature');
```

### UUID Fix Detail
```php
// Before
'qdrant_id' => 'uuid-1',
// After
'qdrant_id' => (string) Str::uuid(),
```
Note: since the exact UUID value is used in mock assertions, the UUID must be captured in a variable before use.

# Testing

### Validation Approach
After each fix, run the affected test group, then run the full suite at the end.

### Key Scenarios
- All auth tests pass (registration, login, logout, password reset, email verification)
- All CSRF-protected route tests pass (KnowledgeTest, StarterPlanTest, AssistantTest, etc.)
- UUID chunk tests pass without DB errors
- Full suite: `php artisan test --compact` shows 0 failed

# Delivery Steps

### ✓ Step 1: Fix CSRF 419 errors globally in Pest.php
Add CSRF middleware bypass to the global Pest configuration so all Feature tests can make POST/PATCH/DELETE requests without 419 errors.

- Edit `tests/Pest.php`: add `->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)` to the `pest()->extend()` chain
- Run `php artisan test --compact --filter=KnowledgeTest` to verify the 419 errors are resolved for that group
- This single change fixes the majority of the 44 failing tests

### ✓ Step 2: Fix Auth route paths in Breeze test files
Replace hardcoded URL paths with named route helpers in all Auth test files, since auth routes are prefixed with `/dashboard`.

- `RegistrationTest.php`: `/register` → `route('register')`, `/login` redirect → `route('dashboard')`
- `AuthenticationTest.php`: `/login` → `route('login')`, `/logout` → `route('logout')`
- `PasswordResetTest.php`: `/forgot-password` → `route('password.request')`, `/reset-password` → `route('password.store')`, `/reset-password/{token}` → `route('password.reset', ...)`
- `PasswordConfirmationTest.php`: `/confirm-password` → `route('password.confirm')`
- `PasswordUpdateTest.php`: `/password` → `route('password.update')`
- `EmailVerificationTest.php`: `/verify-email` → `route('verification.notice')`
- Run `php artisan test --compact --filter=Auth` to verify all auth tests pass

### ✓ Step 3: Fix ExampleTest and UUID validation errors
Fix the two remaining root causes: ExampleTest expecting 200 on an auth-protected route, and invalid UUID strings in chunk factory calls.

- `ExampleTest.php`: update to assert 302 (redirect to login) for unauthenticated `/` access, or authenticate a user and assert 200
- `KnowledgeDeletionTest.php`: replace `'uuid-1'` and `'uuid-2'` with `(string) Str::uuid()` captured in variables, update mock assertions to use those variables
- `IndexAssistantDocumentsActionTest.php`: replace `'old-uuid-1'` with `(string) Str::uuid()` captured in a variable, update `deletePoints` mock assertion to use that variable
- Run full suite `php artisan test --compact` and verify 0 failures