# Exception Handling for Share-Chat Routes

## Overview

Public share-chat routes (`/share-chat/*`) are embedded as widgets in iframes on third-party sites. Browsers do not send an `Accept: application/json` header in these contexts, so Laravel's default exception handler would return an HTML error page instead of a JSON response. This document describes how the application forces JSON error responses for these routes.

## Architecture

### 1. Forcing JSON Rendering (`bootstrap/app.php`)

```php
$exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
    return $request->is('api/*')
        || $request->is('share-chat/*')
        || $request->expectsJson();
});
```

Any request to `share-chat/*` always receives a JSON error response, regardless of the `Accept` header sent by the client.

### 2. ModelNotFoundException Mapping (`bootstrap/app.php`)

Laravel's Eloquent throws a generic `ModelNotFoundException` when a model is not found via `findOrFail()` or route model binding. The application maps this to domain-specific exceptions:

```php
$exceptions->map(ModelNotFoundException::class, function (ModelNotFoundException $e) {
    return match ($e->getModel()) {
        Assistant::class    => new AssistantNotFoundException(),
        ChatHistory::class  => new ChatNotFoundException(),
        Knowledge::class    => new KnowledgeNotFoundException(),
        Chunk::class        => new ChunkNotFoundException(),
        User::class         => new UserNotFoundException(),
        default             => $e,
    };
});
```

This pattern keeps error messages domain-specific and prevents leaking internal model class names to API consumers.

### 3. Domain Exception with `render()` (`app/Exceptions/AssistantNotFoundException.php`)

Each domain exception co-locates its HTTP response logic in a `render()` method:

```php
class AssistantNotFoundException extends Exception
{
    public function render(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Assistant not found.'], 404);
    }
}
```

This approach keeps the response format close to the exception definition, making it easy to find and update.

## Request Flow

```
GET /share-chat/{id}
        │
        ▼
Route model binding → Assistant::findOrFail($id)
        │
        ▼  (not found)
ModelNotFoundException
        │
        ▼  (bootstrap/app.php map)
AssistantNotFoundException
        │
        ▼  (shouldRenderJsonWhen → true for share-chat/*)
AssistantNotFoundException::render()
        │
        ▼
HTTP 404  {"message": "Assistant not found."}
```

## Test Coverage

`tests/Feature/ExceptionHandlingTest.php` covers two scenarios:

| Route | Method | Expected Status | Expected Body |
|---|---|---|---|
| `/share-chat/999999` | GET | 404 | `{"message": "Assistant not found."}` |
| `/share-chat/999999/message` | POST | 404 | `{"message": "Assistant not found."}` |

Run tests:

```bash
php artisan test --compact --filter=ExceptionHandling
```

## Related Files

| File | Role |
|---|---|
| `app/Exceptions/AssistantNotFoundException.php` | Domain exception with `render()` |
| `app/Exceptions/ChatNotFoundException.php` | Same pattern for ChatHistory |
| `app/Exceptions/KnowledgeNotFoundException.php` | Same pattern for Knowledge |
| `app/Exceptions/ChunkNotFoundException.php` | Same pattern for Chunk |
| `app/Exceptions/UserNotFoundException.php` | Same pattern for User |
| `bootstrap/app.php` | Exception mapping and JSON rendering config |
| `tests/Feature/ExceptionHandlingTest.php` | Feature tests for share-chat 404 responses |
