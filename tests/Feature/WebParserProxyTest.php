<?php

use App\Domain\Shared\AI\Services\WebParser;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

beforeEach(function () {
    // Создаем временный файл proxy.txt для тестов, если его нет
    // Или используем существующий, но в тестах лучше контролировать содержимое
    $this->proxyFile = base_path('proxy.txt');
    $this->originalProxies = file_exists($this->proxyFile) ? file_get_contents($this->proxyFile) : null;

    file_put_contents($this->proxyFile, "http://proxy1:8080\nhttp://proxy2:8080");
});

afterEach(function () {
    if ($this->originalProxies !== null) {
        file_put_contents($this->proxyFile, $this->originalProxies);
    } else {
        @unlink($this->proxyFile);
    }
});

test('it retries on failure and uses proxies', function () {
    Http::fake([
        'https://api.firecrawl.dev/v1/scrape' => Http::sequence()
            ->push(['error' => 'Server Error'], 500) // 1-я попытка провал
            ->push(['success' => false], 200)       // 2-я попытка провал (success=false)
            ->push([                                // 3-я попытка успех
                'success' => true,
                'data' => ['markdown' => 'Success content'],
            ], 200),
    ]);

    // Log::shouldReceive('error')->atLeast()->once();
    // Log::shouldReceive('warning')->atLeast()->once();
    // Log::shouldReceive('debug')->zeroOrMoreTimes();

    $parser = new WebParser;
    $result = $parser->parseUrl('https://example.com');

    expect($result)->toBe('Success content');

    Http::assertSentCount(3);

    Http::assertSent(function ($request) {
        return $request->url() === 'https://api.firecrawl.dev/v1/scrape' &&
               $request['url'] === 'https://example.com';
    });
})->group('slow');

test('it logs warnings for intermediate failures and error for the final one', function () {
    Log::shouldReceive('warning')->twice();
    Log::shouldReceive('error')->once();

    Http::fake([
        'https://api.firecrawl.dev/v1/scrape' => Http::response(['error' => 'Failure'], 500),
    ]);

    $parser = new WebParser;
    $parser->parseUrl('https://example.com');
})->group('slow');

test('it returns null after 3 failed attempts', function () {
    Http::fake([
        'https://api.firecrawl.dev/v1/scrape' => Http::response(['error' => 'Permanent Error'], 500),
    ]);

    // Log::shouldReceive('error')->times(3);
    // Log::shouldReceive('debug')->zeroOrMoreTimes();

    $parser = new WebParser;
    $result = $parser->parseUrl('https://example.com');

    expect($result)->toBeNull();
    Http::assertSentCount(3);
})->group('slow');

test('it supports SOCKS5 proxy strings in proxy.txt', function () {
    $socksProxy = 'socks5://user:pass@1.2.3.4:1080';
    file_put_contents($this->proxyFile, $socksProxy);

    Http::fake([
        'https://api.firecrawl.dev/v1/scrape' => Http::response([
            'success' => true,
            'data' => ['markdown' => 'SOCKS success'],
        ], 200),
    ]);

    $parser = new WebParser;
    $result = $parser->parseUrl('https://example.com');

    expect($result)->toBe('SOCKS success');
    Http::assertSent(function ($request) {
        return $request->url() === 'https://api.firecrawl.dev/v1/scrape';
    });
})->group('slow');

test('it ignores comments and trims spaces in proxy.txt', function () {
    $content = "# Comment\n  http://real-proxy:8080  \n# Another";
    file_put_contents($this->proxyFile, $content);

    $parser = new WebParser;
    $reflection = new ReflectionClass($parser);
    $method = $reflection->getMethod('getRandomProxy');
    $method->setAccessible(true);

    $proxy = $method->invoke($parser);

    expect($proxy)->toBe('http://real-proxy:8080');
})->group('slow');
