<?php

namespace App\Domain\Chat\Queries;

use App\Domain\Assistant\Enums\AssistantStyle;
use App\Domain\Assistant\Models\Assistant;
use App\Domain\Chat\Models\ChatHistory;
use App\Infrastructure\AI\AIClientFactory;
use App\Infrastructure\AI\VectorStoreManager;
use Illuminate\Support\Collection;
use LLPhant\Chat\Message;
use LLPhant\Embeddings\Document;
use LLPhant\Query\SemanticSearch\QuestionAnswering;

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
        $qa = new QuestionAnswering(
            $this->vectorStoreManager->getStoreForAssistant($assistant),
            $this->aiClientFactory->createEmbeddingGenerator(),
            $this->aiClientFactory->createChatClient()
        );

        $qa->systemMessageTemplate = $this->buildSystemMessageTemplate($assistant);

        $messages = [];

        if ($assistant->system && trim($assistant->system) !== '') {
            $messages[] = Message::system(trim($assistant->system));
        }

        foreach ($history as $record) {
            $messages[] = Message::user($record->question);
            $messages[] = Message::assistant($record->answer);
        }
        $messages[] = Message::user($question);

        $answer = $qa->answerQuestionFromChat($messages, stream: false);

        return [
            'answer' => $answer,
            'sources' => $qa->getRetrievedDocuments(),
        ];
    }

    /**
     * Формирует шаблон системного сообщения на основе настроек ассистента.
     */
    private function buildSystemMessageTemplate(Assistant $assistant): string
    {
        $knowledgeBasePart = 'Ты отвечаешь на вопросы пользователя ИСКЛЮЧИТЕЛЬНО на основе предоставленной базы знаний (контекста). '
            .'Используй ТОЛЬКО приведенные ниже фрагменты контекста. '
            .'Не используй свои внешние знания и не выдумывай факты, которых нет в контексте. '
            ."Отвечай строго по базе знаний, без лишней информации.\n\n";

        $contextPart = "Фрагменты контекста из базы знаний:\n\n{context}\n\n";

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

        $stylePart = match ($assistant->style) {
            AssistantStyle::Commercial => 'Твой стиль общения: коммерческий. Будь убедительным, подчеркивай выгоды и призывай к действию.',
            AssistantStyle::Business => 'Твой стиль общения: деловой. Будь профессиональным, сдержанным и конкретным.',
            AssistantStyle::Rude => 'Твой стиль общения: грубый. Отвечай кратко, дерзко, без лишних любезностей.',
            AssistantStyle::Positive => 'Твой стиль общения: позитивный. Будь очень дружелюбным, используй смайлики и заряжай энергией.',
            default => 'Твой стиль общения: деловой.',
        }."\n";

        $fallbackPart = $assistant->fallback
            ? "Если ты не знаешь ответа на вопрос на основе предоставленного контекста, ответь именно так: {$assistant->fallback}. Не пытайся придумать ответ."
            : 'Если ты не знаешь ответа, просто скажи, что не знаешь, не пытайся придумать ответ.';

        return $knowledgeBasePart.$contextPart.$brandPart.$companyPart.$phonePart.$socialPart.$stylePart.$fallbackPart;
    }
}
