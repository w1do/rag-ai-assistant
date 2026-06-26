<?php

namespace App\Domain\Knowledge\Actions;

use App\Domain\Assistant\Actions\IndexAssistantDocumentsAction;
use App\Domain\Knowledge\Models\Knowledge;
use App\Domain\Shared\AI\Services\WebParser;
use App\Infrastructure\AI\AIClientFactory;
use Illuminate\Support\Facades\Log;
use LLPhant\Embeddings\Document;

/**
 * Действие по генерации знаний из URL-адреса.
 */
class GenerateKnowledgeAction
{
    /**
     * @param  IndexAssistantDocumentsAction  $indexAssistantDocumentsAction  Действие для индексации документов
     * @param  WebParser  $webParser  Парсер веб-страниц
     * @param  AIClientFactory  $aiClientFactory  Фабрика для клиентов ИИ
     */
    public function __construct(
        private IndexAssistantDocumentsAction $indexAssistantDocumentsAction,
        private WebParser $webParser,
        private AIClientFactory $aiClientFactory
    ) {}

    /**
     * Выполняет генерацию знаний для указанного объекта Knowledge.
     * Парсит URL, очищает контент, генерирует заголовок и индексирует результат.
     *
     * @param  Knowledge  $knowledge  Объект знаний для обработки
     *
     * @throws \Exception
     */
    public function execute(Knowledge $knowledge): void
    {
        $url = $knowledge->url;
        $assistant = $knowledge->assistant;

        Log::info("Generating knowledge for Knowledge ID: {$knowledge->id}, URL: {$url}");
        $assistant->update(['status' => 'processing']);
        $knowledge->update(['status' => 'processing']);

        try {
            $generatedContent = $this->webParser->parseUrl($url);

            if (! $generatedContent) {
                Log::warning("No content generated for URL: {$url}");
                $knowledge->update(['status' => 'error']);
                $assistant->update(['status' => 'ready']);

                return;
            }

            Log::info("Content received for URL: {$url}, length: ".mb_strlen($generatedContent));

            // Cleanup content from code blocks if present
            $generatedContent = $this->cleanupMarkdown($generatedContent);

            // Generate Title using AI
            $title = $this->generateTitle($generatedContent);

            $knowledge->update([
                'name' => $title,
                'content' => $generatedContent,
            ]);

            $document = new Document;
            $document->content = $generatedContent;
            $document->sourceName = $url;
            $document->sourceType = 'website';
            $document->hash = hash('sha256', $generatedContent);

            $this->indexAssistantDocumentsAction->execute($assistant, [$document], $knowledge->id);

            $knowledge->update(['status' => 'ready']);
        } catch (\Exception $e) {
            Log::error('Error generating knowledge: '.$e->getMessage(), [
                'exception' => $e,
                'url' => $url,
                'assistant_id' => $assistant->id,
            ]);
            $knowledge->update(['status' => 'error']);
            $assistant->update(['status' => 'error']);
            throw $e;
        }
    }

    private function cleanupMarkdown(string $content): string
    {
        $content = trim($content);

        // Remove ```markdown or ``` if it wraps the entire content
        if (str_starts_with($content, '```markdown')) {
            $content = preg_replace('/^```markdown\n?/', '', $content);
            $content = preg_replace('/\n?```$/', '', $content);
        } elseif (str_starts_with($content, '```')) {
            $content = preg_replace('/^```\n?/', '', $content);
            $content = preg_replace('/\n?```$/', '', $content);
        }

        return trim($content);
    }

    private function generateTitle(string $content): string
    {
        try {
            $chat = $this->aiClientFactory->createChatClient();
            $prompt = "На основе следующего контента придумай один краткий и емкий заголовок. 
            Верни ТОЛЬКО текст заголовка, без кавычек, без слова 'Заголовок:' и без markdown разметки.
            
            Контент:
            ".mb_substr($content, 0, 2000);

            return trim($chat->generateText($prompt));
        } catch (\Exception $e) {
            Log::error('Failed to generate title: '.$e->getMessage());
            // Fallback to extraction from first line
            $lines = explode("\n", ltrim($content));
            $title = str_replace(['#', '*', 'Заголовок:', 'Title:'], '', $lines[0]);

            return trim($title) ?: 'Без названия';
        }
    }
}
