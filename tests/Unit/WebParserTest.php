<?php

namespace Tests\Unit;

use App\Domain\Shared\AI\Services\WebParser;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WebParserTest extends TestCase
{
    public function test_it_can_parse_url_using_firecrawl()
    {
        Http::fake([
            'https://api.firecrawl.dev/v1/scrape' => Http::response([
                'success' => true,
                'data' => [
                    'markdown' => "# Hello World\n\nThis is a test content from Firecrawl.",
                    'metadata' => [
                        'title' => 'Hello World',
                    ],
                ],
            ], 200),
        ]);

        $parser = new WebParser;
        $result = $parser->parseUrl('https://example.com/test');

        $this->assertEquals("# Hello World\n\nThis is a test content from Firecrawl.", $result);

        Http::assertSent(function ($request) {
            return $request->url() === 'https://api.firecrawl.dev/v1/scrape' &&
                   $request->method() === 'POST' &&
                   $request['url'] === 'https://example.com/test' &&
                   in_array('markdown', $request['formats']);
        });
    }
}
