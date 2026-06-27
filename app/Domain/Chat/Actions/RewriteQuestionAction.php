<?php

namespace App\Domain\Chat\Actions;

use App\Infrastructure\AI\AIClientFactory;
use Illuminate\Support\Collection;

class RewriteQuestionAction
{
    public function __construct(private AIClientFactory $aiClientFactory) {}

    /**
     * Переписывает уточняющий вопрос пользователя в самостоятельный запрос с учетом истории.
     */
    public function execute(string $question, Collection $history): string
    {
        if ($history->isEmpty()) {
            return $question;
        }

        $chatClient = $this->aiClientFactory->createChatClient();

        $historyString = $history->map(fn ($h) => "User: {$h->question}\nAssistant: {$h->answer}")->implode("\n");

        $prompt = "Ниже приведена история чата и новый уточняющий вопрос от пользователя.
Твоя задача — переписать этот уточняющий вопрос так, чтобы он стал самостоятельным и понятным БЕЗ истории чата, при этом сохраняя первоначальный смысл и учитывая контекст текущего бизнеса.
Если вопрос уже является самостоятельным, верни его без изменений.
Верни ТОЛЬКО текст переписанного вопроса. Не добавляй никаких пояснений.

История чата:
{$historyString}

Уточняющий вопрос: {$question}

Переписанный самостоятельный вопрос:";

        $rewrittenQuestion = $chatClient->generateText($prompt);

        $result = trim($rewrittenQuestion);

        // Если LLM вернула пустую строку или ошибку, возвращаем оригинал
        return empty($result) ? $question : $result;
    }
}
