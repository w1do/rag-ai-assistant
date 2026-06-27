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
        $knowledgeBasePart = "Ты — эксперт-ассистент компании «ГазТочка», специализирующейся на установке и обслуживании ГБО (газобаллонного оборудования) в Тюмени.\n"
            ."Твоя задача — отвечать на вопросы пользователей, используя предоставленный контекст из базы знаний.\n\n"
            ."Инструкции:\n"
            ."1. Тщательно анализируй контекст. Даже если информация представлена в виде списка услуг или тегов (например, «РЕГИСТРАЦИЯ ГИБДД»), используй это как подтверждение того, что компания предоставляет данную услугу.\n"
            ."2. Отвечай дружелюбно и профессионально. Если контекст содержит ответ, сформулируй его понятно для клиента.\n"
            ."3. Если вопрос касается ГБО, регистрации изменений или работы автосервиса, но в контексте нет прямого детального ответа, подтверди возможность услуги (если она упомянута) и предложи уточнить детали у менеджера.\n"
            ."4. Только если вопрос совершенно не по теме или в контексте абсолютно нет зацепок для ответа, используй установленную фразу-заглушку.\n\n";

        $contextPart = "Контекст из базы знаний:\n\n{context}\n\n";

        $brandPart = $assistant->brand_name ? "Название компании: {$assistant->brand_name}.\n" : '';
        $companyPart = $assistant->description ? "О компании: {$assistant->description}.\n" : '';
        $phonePart = $assistant->phone ? "Контактный телефон: {$assistant->phone}.\n" : '';

        $socialPart = '';
        if ($assistant->social && is_array($assistant->social)) {
            $socialStrings = [];
            foreach ($assistant->social as $key => $value) {
                $socialStrings[] = "{$key}: {$value}";
            }
            $socialPart = 'Социальные сети: '.implode(', ', $socialStrings).".\n";
        }

        $stylePart = match ($assistant->style) {
            AssistantStyle::Commercial => 'Стиль общения: коммерческий. Подчеркивай выгоды, будь убедительным.',
            AssistantStyle::Business => 'Стиль общения: деловой. Профессионально, кратко и по делу.',
            AssistantStyle::Rude => 'Стиль общения: дерзкий. Отвечай максимально лаконично.',
            AssistantStyle::Positive => 'Стиль общения: позитивный. Будь очень приветливым и энергичным.',
            default => 'Стиль общения: деловой.',
        }."\n";

        $fallbackPart = $assistant->fallback
            ? "Фраза-заглушка (если нет информации): {$assistant->fallback}"
            : 'Если не знаешь ответа, просто вежливо скажи об этом.';

        return $knowledgeBasePart.$contextPart.$brandPart.$companyPart.$phonePart.$socialPart.$stylePart.$fallbackPart;
    }
}
