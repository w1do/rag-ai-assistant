<?php

namespace App\Domain\Chat\Queries;

use App\Domain\Assistant\Models\Assistant;
use App\Infrastructure\AI\AIClientFactory;

class GetAssistantChatSummaryQuery
{
    public function __construct(
        private readonly AIClientFactory $aiClientFactory
    ) {}

    /**
     * Генерирует саммари последних 10 вопросов пользователей.
     */
    public function execute(Assistant $assistant): string
    {
        $questions = $assistant->chatHistories()
            ->latest()
            ->limit(10)
            ->pluck('question')
            ->filter()
            ->toArray();

        if (empty($questions)) {
            return 'У этого ассистента пока нет диалогов для анализа.';
        }

        $questionsText = implode("\n- ", array_reverse($questions));

        $prompt = "Проанализируй следующие вопросы пользователей к ассистенту и напиши краткое саммари на русском языке (2-3 предложения), чем чаще всего интересуются пользователи. Пиши только сам текст саммари:\n\n- ".$questionsText;

        try {
            return $this->aiClientFactory->createChatClient()->generateText($prompt);
        } catch (\Exception $e) {
            return 'Не удалось сгенерировать саммари: '.$e->getMessage();
        }
    }
}
