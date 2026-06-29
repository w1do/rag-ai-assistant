---
sessionId: session-260630-013306-k8fo
---

# Requirements

### Overview & Goals

Document the exception handling feature for public share-chat routes, which ensures clean JSON error responses when an `Assistant` model is not found (404). The tests in `ExceptionHandlingTest` already pass — this plan covers writing the documentation.

### Scope

**In Scope:**
- Add a `docs/exception_handling.md` file describing the exception handling architecture for share-chat routes
- Update `DOCUMENTATION.md` to reference the new doc

**Out of Scope:**
- Code changes (implementation is complete and tests pass)
- Adding new exception types

# Technical Design

### Current Implementation

The feature spans three files:

1. **`app/Exceptions/AssistantNotFoundException.php`** — custom exception with a `render()` method returning `{"message": "Assistant not found."}` with HTTP 404.

2. **`bootstrap/app.php`** — maps `ModelNotFoundException` → `AssistantNotFoundException` (and other domain exceptions) via `$exceptions->map()`. Also configures `shouldRenderJsonWhen()` to force JSON for `share-chat/*` routes.

3. **`tests/Feature/ExceptionHandlingTest.php`** — two Pest tests verifying that `GET /share-chat/999999` and `POST /share-chat/999999/message` both return 404 with `{"message": "Assistant not found."}`.

### Proposed Changes

Create `docs/exception_handling.md` covering:
- Why JSON rendering is forced for `share-chat/*` (widget embedded in iframes, no browser Accept header)
- The `ModelNotFoundException` → domain exception mapping pattern in `bootstrap/app.php`
- The `AssistantNotFoundException::render()` co-location pattern
- Test coverage summary

Update `DOCUMENTATION.md` to add a reference to the new doc under a relevant section.

# Testing

### Validation Approach

No new tests needed — `ExceptionHandlingTest` already covers the feature with two passing scenarios:

- `GET /share-chat/999999` → 404 `{"message": "Assistant not found."}`
- `POST /share-chat/999999/message` → 404 `{"message": "Assistant not found."}`

After documentation is written, run `php artisan test --compact --filter=ExceptionHandling` to confirm tests still pass.

# Delivery Steps

### ✓ Step 1: Create docs/exception_handling.md
A new documentation file `docs/exception_handling.md` exists describing the exception handling architecture for share-chat routes.

- Document why `shouldRenderJsonWhen()` includes `share-chat/*` (widget iframe context, no Accept header)
- Document the `ModelNotFoundException` → domain exception mapping pattern in `bootstrap/app.php`
- Document the `AssistantNotFoundException::render()` co-location approach
- Include the two test scenarios from `ExceptionHandlingTest` as acceptance criteria
- Follow the style and structure of existing docs (e.g., `docs/share_chat_redesign.md`)

### ✓ Step 2: Update DOCUMENTATION.md to reference the new doc
DOCUMENTATION.md links to `docs/exception_handling.md` so it is discoverable.

- Add a reference entry under an appropriate section (e.g., near the API/error handling area)
- Keep the entry concise — one line description + link, matching the style of existing entries like `[Система биллинга](docs/billing_system.md)`
- Run `php artisan test --compact --filter=ExceptionHandling` to confirm tests still pass after any incidental changes