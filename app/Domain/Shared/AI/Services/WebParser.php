<?php

namespace App\Domain\Shared\AI\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WebParser
{
    /**
     * Парсинг URL с использованием Firecrawl API.
     * Реализована поддержка прокси (выбирается случайно из proxy.txt)
     * и система повторных попыток (минимум 3 попытки).
     *
     * @param  string  $url  URL для парсинга
     * @return string|null Содержимое страницы в формате Markdown или null при ошибке
     */
    public function parseUrl(string $url): ?string
    {
        $apiKey = config('services.firecrawl.key');
        $maxAttempts = 3;

        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            $proxy = $this->getRandomProxy();

            try {
                $request = Http::withToken($apiKey)
                    ->timeout(60)
                    ->connectTimeout(15);

                if ($proxy) {
                    $request->withOptions(['proxy' => $proxy]);
                }

                $response = $request->post('https://api.firecrawl.dev/v1/scrape', [
                    'url' => $url,
                    'formats' => ['markdown'],
                    'onlyMainContent' => true,
                ]);

                if ($response->successful()) {
                    $data = $response->json();

                    if ($data['success'] ?? false) {
                        return $data['data']['markdown'] ?? null;
                    }

                    $logMethod = $attempt === $maxAttempts ? 'error' : 'warning';
                    Log::$logMethod("Firecrawl returned success=false on attempt {$attempt} for URL: {$url}", [
                        'data' => $data,
                        'proxy' => $proxy,
                    ]);
                } else {
                    $logMethod = $attempt === $maxAttempts ? 'error' : 'warning';
                    Log::$logMethod("Firecrawl attempt {$attempt} failed for URL: {$url}", [
                        'status' => $response->status(),
                        'error' => $response->json(),
                        'proxy' => $proxy,
                    ]);
                }
            } catch (\Exception $e) {
                $logMethod = $attempt === $maxAttempts ? 'error' : 'warning';
                Log::$logMethod("Error calling Firecrawl on attempt {$attempt} for URL: {$url}", [
                    'exception' => $e->getMessage(),
                    'proxy' => $proxy,
                ]);
            }

            if ($attempt < $maxAttempts) {
                usleep(500000);
            }
        }

        return null;
    }

    /**
     * Получение случайного прокси из файла proxy.txt.
     * Файл должен располагаться в корне проекта и содержать прокси по одному на строку.
     *
     * @return string|null Строка прокси (например, http://user:pass@host:port) или null
     */
    private function getRandomProxy(): ?string
    {
        $path = base_path('proxy.txt');

        if (! file_exists($path)) {
            return null;
        }

        $proxies = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        $proxies = array_filter(array_map('trim', $proxies), function ($line) {
            return $line !== '' && ! str_starts_with($line, '#');
        });

        if (empty($proxies)) {
            return null;
        }

        return $proxies[array_rand($proxies)];
    }
}
