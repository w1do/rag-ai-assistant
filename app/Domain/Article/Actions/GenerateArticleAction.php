<?php

namespace App\Domain\Article\Actions;

use App\Domain\Article\Models\Article;
use App\Domain\Assistant\Models\Assistant;
use LLPhant\Chat\OpenAIChat;
use LLPhant\OpenAIConfig;
use LLPhant\Tool\WebPageTextGetter;

class GenerateArticleAction
{
    public function execute(Assistant $assistant, string $url): Article
    {
        $article = $assistant->articles()->create([
            'url' => $url,
            'status' => 'processing',
        ]);

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
        } catch (\Exception $e) {
            $article->update(['status' => 'error']);
            throw $e;
        }

        return $article;
    }
}
