<?php

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Assistant\Models\Chunk;
use App\Domain\Chat\Models\ChatHistory;
use App\Domain\Knowledge\Models\Knowledge;
use App\Exceptions\AssistantNotFoundException;
use App\Exceptions\ChatNotFoundException;
use App\Exceptions\ChunkNotFoundException;
use App\Exceptions\KnowledgeNotFoundException;
use App\Exceptions\UserNotFoundException;
use App\Http\Middleware\AllowIframe;
use App\Http\Middleware\HandleInertiaRequests;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: '',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'allow.iframe' => AllowIframe::class,
        ]);

        $middleware->trustProxies(at: '*');

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Публичный чат-виджет встраивается на сторонние сайты через iframe,
        // поэтому его эндпоинт сообщений не может полагаться на CSRF-токен сессии.
        $middleware->validateCsrfTokens(except: [
            'share-chat/*/message',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->is('share-chat/*') || $request->expectsJson(),
        );

        $exceptions->map(ModelNotFoundException::class, function (ModelNotFoundException $e) {
            $model = $e->getModel();

            return match ($model) {
                Assistant::class => new AssistantNotFoundException($e->getMessage(), 404, $e),
                ChatHistory::class => new ChatNotFoundException($e->getMessage(), 404, $e),
                Knowledge::class => new KnowledgeNotFoundException($e->getMessage(), 404, $e),
                Chunk::class => new ChunkNotFoundException($e->getMessage(), 404, $e),
                User::class => new UserNotFoundException($e->getMessage(), 404, $e),
                default => $e,
            };
        });
    })->create();
