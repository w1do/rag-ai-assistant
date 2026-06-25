<?php

namespace App\Domain\Article\Jobs;

use App\Domain\Article\Models\Article;
use App\Domain\Assistant\Models\Assistant;
use App\Domain\Shared\AI\Services\RAGService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use LLPhant\Chat\OpenAIChat;
use LLPhant\OpenAIConfig;
use LLPhant\Tool\WebPageTextGetter;

class GenerateArticlesJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Assistant $assistant,
        public string $url
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $article = $this->assistant->articles()->create([
            'url' => $this->url,
            'status' => 'processing',
        ]);

        $webGetter = new WebPageTextGetter();
        $text = $webGetter->getWebPageText($this->url);

        if (str_contains($text, "We couldn't retrieve the web page content")) {
            $article->update(['status' => 'error']);
            return;
        }

        $config = new OpenAIConfig();
        $config->apiKey = config('llphant.openai.api_key');
        $config->url = config('llphant.openai.base_url');

        $chat = new OpenAIChat($config);
        $chat->model = 'gpt-4o-mini';

        $prompt = "На основе следующего текста с сайта конкурента, напиши уникальную и полезную статью на аналогичную тему на русском языке. Статья должна быть структурированной, с заголовками и выводами. Текст:\n\n" . mb_substr($text, 0, 10000);

        $generatedContent = $chat->generateText($prompt);

        // Try to extract title from the first line
        $lines = explode("\n", ltrim($generatedContent));
        $title = str_replace(['#', '*', 'Заголовок:', 'Title:'], '', $lines[0]);

        $article->update([
            'title' => trim($title),
            'content' => $generatedContent,
            'status' => 'ready',
        ]);
    }
}
