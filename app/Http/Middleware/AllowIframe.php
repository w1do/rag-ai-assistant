<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AllowIframe
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Удаляем заголовок X-Frame-Options, который Laravel добавляет по умолчанию через FrameGuard,
        // так как он обычно имеет значение SAMEORIGIN и блокирует встраивание на сторонние сайты.
        $response->headers->remove('X-Frame-Options');

        // Добавляем Content-Security-Policy с директивой frame-ancestors.
        // Это современный стандарт, который заменяет X-Frame-Options.
        // Используем '*', чтобы позволить встраивание виджета на любые сторонние ресурсы.
        $response->headers->set('Content-Security-Policy', "frame-ancestors 'self' *", false);

        return $response;
    }
}
