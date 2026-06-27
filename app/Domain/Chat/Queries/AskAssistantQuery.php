<?php

namespace App\Domain\Chat\Queries;

use App\Domain\Assistant\Enums\AssistantStyle;
use App\Domain\Assistant\Models\Assistant;
use App\Domain\Chat\Actions\RewriteQuestionAction;
use App\Domain\Chat\Models\ChatHistory;
use App\Infrastructure\AI\AIClientFactory;
use App\Infrastructure\AI\VectorStoreManager;
use Illuminate\Support\Collection;
use LLPhant\Chat\Message;
use LLPhant\Embeddings\Document;

class AskAssistantQuery
{
    public function __construct(
        private AIClientFactory $aiClientFactory,
        private VectorStoreManager $vectorStoreManager
    ) {}

    /**
     * Ask a question and get an answer with sources.
     *
     * @param  Collection<int, ChatHistory>  $history
     * @return array{answer: string, sources: Document[]}
     */
    public function execute(Assistant $assistant, string $question, Collection $history = new Collection): array
    {
        // 1. Переписываем вопрос с учетом истории чата для точного поиска
        /** @var RewriteQuestionAction $rewriteAction */
        $rewriteAction = app(RewriteQuestionAction::class);
        $standaloneQuestion = $rewriteAction->execute($question, $history);

        $vectorStore = $this->vectorStoreManager->getStoreForAssistant($assistant);
        $embeddingGenerator = $this->aiClientFactory->createEmbeddingGenerator();

        // 2a. Семантический поиск
        $embedding = $embeddingGenerator->embedText($standaloneQuestion);
        $semanticDocuments = $vectorStore->similaritySearch($embedding, 10);

        // 2b. Полнотекстовый поиск (should-условие в Qdrant отсекает семантику, поэтому делаем отдельно)
        $textDocuments = $this->vectorStoreManager->searchByText($assistant, $standaloneQuestion, 10);

        // 2c. Объединяем результаты
        $documents = $this->vectorStoreManager->mergeDocuments($semanticDocuments, $textDocuments, 10);

        // 3. Формируем контекст для LLM
        $context = '';
        foreach ($documents as $document) {
            $context .= $document->content."\n\n";
        }

        // 4. Формируем сообщения для чата
        $chatClient = $this->aiClientFactory->createChatClient();

        $systemTemplate = $this->buildSystemMessageTemplate($assistant);
        $systemMessageText = str_replace('{context}', $context, $systemTemplate);

        $messages = [
            Message::system($systemMessageText),
        ];

        // Добавляем системную инструкцию ассистента, если она есть
        if ($assistant->system && trim($assistant->system) !== '') {
            $messages[] = Message::system(trim($assistant->system));
        }

        // Добавляем историю сообщений
        foreach ($history as $record) {
            $messages[] = Message::user($record->question);
            $messages[] = Message::assistant($record->answer);
        }

        // Добавляем текущий ОРИГИНАЛЬНЫЙ вопрос пользователя
        $messages[] = Message::user($question);

        // 5. Генерируем ответ
        $answer = $chatClient->generateChat($messages);

        return [
            'answer' => $answer,
            'sources' => $documents,
        ];
    }

    /**
     * Формирует шаблон системного сообщения на основе настроек ассистента.
     */
    private function buildSystemMessageTemplate(Assistant $assistant): string
    {
        $knowledgeBasePart = "Ты — эксперт-ассистент, который отвечает ИСКЛЮЧИТЕЛЬНО на основе предоставленной базы знаний.\n"
            ."Твоя задача — отвечать на вопросы пользователей, используя предоставленный контекст.\n\n"
            ."Инструкции по оформлению ответа:\n"
            ."1. Используй Markdown для структурирования ответа.\n"
            ."2. Важные термины и ключевые мысли выделяй **жирным шрифтом**.\n"
            ."3. Если в ответе есть перечисление, обязательно используй маркированные или нумерованные списки.\n"
            ."4. Разделяй ответ на короткие, легко читаемые абзацы.\n"
            ."5. Если ответ объемный, используй подзаголовки (###) для разделения логических блоков.\n"
            ."6. Тщательно анализируй контекст. Даже если информация представлена кратко, используй её для подтверждения фактов.\n"
            ."7. Отвечай дружелюбно и профессионально.\n\n";

        $contextPart = "Контекст из базы знаний:\n\n{context}\n\n";

        $brandPart = $assistant->brand_name ? "Твое имя бренда: {$assistant->brand_name}.\n" : '';
        $companyPart = $assistant->description ? "Информация о компании: {$assistant->description}.\n" : '';
        $phonePart = $assistant->phone ? "Контактный телефон: {$assistant->phone}.\n" : '';

        $socialPart = '';
        if ($assistant->social && is_array($assistant->social)) {
            $socialStrings = [];
            foreach ($assistant->social as $key => $value) {
                $socialStrings[] = "{$key}: {$value}";
            }
            $socialPart = 'Социальные сети: '.implode(', ', $socialStrings).".\n";
        }

        $stylePart = 'Твой стиль общения: '.match ($assistant->style) {
            AssistantStyle::Commercial => 'коммерческий. Подчеркивай выгоды, будь убедительным.',
            AssistantStyle::Business => 'деловой. Профессионально, кратко и по делу.',
            AssistantStyle::Rude => 'грубый. Отвечай максимально лаконично.',
            AssistantStyle::Positive => 'позитивный. Будь очень приветливым и энергичным.',
            default => 'деловой.',
        }."\n";

        $fallbackPart = $assistant->fallback
            ? "Фраза-заглушка (если нет информации): {$assistant->fallback}"
            : 'Если ты не знаешь ответа, просто скажи, что не знаешь.';

        return $knowledgeBasePart.$contextPart.$brandPart.$companyPart.$phonePart.$socialPart.$stylePart.$fallbackPart;
    }
}
