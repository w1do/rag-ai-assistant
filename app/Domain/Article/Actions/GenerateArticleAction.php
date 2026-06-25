<?php

namespace App\Domain\Article\Actions;

use App\Domain\Article\Models\Article;
use App\Domain\Assistant\Models\Assistant;
use App\Domain\Shared\AI\Services\RAGService;
use Illuminate\Support\Facades\Log;
use LLPhant\Chat\OpenAIChat;
use LLPhant\Embeddings\Document;
use LLPhant\OpenAIConfig;
use LLPhant\Tool\WebPageTextGetter;

class GenerateArticleAction
{
    public function __construct(private RAGService $ragService) {}

    public function execute(Assistant $assistant, string $url): Article
    {
        Log::info("Generating article for URL: {$url}");
        $assistant->update(['status' => 'processing']);

        $article = $assistant->articles()->where('url', $url)->where('status', 'pending')->first();

        if ($article) {
            Log::info("Found pending article ID: {$article->id}");
            $article->update(['status' => 'processing']);
        } else {
            Log::info("No pending article found for URL: {$url}, creating new one.");
            $article = $assistant->articles()->create([
                'url' => $url,
                'status' => 'processing',
            ]);
        }

        try {
            $webGetter = new WebPageTextGetter;
            $text = $webGetter->getWebPageText($url);

            if (str_contains($text, "We couldn't retrieve the web page content")) {
                $article->update(['status' => 'error']);

                return $article;
            }

            $config = new OpenAIConfig;
            $config->apiKey = config('llphant.openai.api_key');
            $config->url = config('llphant.openai.base_url');

            $chat = new OpenAIChat($config);
            $chat->model = 'gpt-4o-mini';

            $prompt = "На основе следующего текста с сайта конкурента, напиши уникальную и полезную статью на аналогичную тему на русском языке. Статья должна быть структурированной, с заголовками и выводами. Текст:\n\n".mb_substr($text, 0, 10000);

            $generatedContent = $chat->generateText($prompt);

            // Try to extract title from the first line
            $lines = explode("\n", ltrim($generatedContent));
            $title = str_replace(['#', '*', 'Заголовок:', 'Title:'], '', $lines[0]);

            $article->update([
                'title' => trim($title),
                'content' => $generatedContent,
                'status' => 'ready',
            ]);

            $document = new Document;
            $document->content = $generatedContent;
            $document->sourceName = $url;

            $this->ragService->indexDocuments($assistant, [$document]);
        } catch (\Exception $e) {
            Log::error('Error generating article: '.$e->getMessage(), [
                'exception' => $e,
                'url' => $url,
                'assistant_id' => $assistant->id,
            ]);
            $article->update(['status' => 'error']);
            $assistant->update(['status' => 'error']);
            throw $e;
        }

        return $article;
    }
}
