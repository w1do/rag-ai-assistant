<?php

namespace App\Domain\Chat\Handlers;

use App\Domain\Chat\Commands\AskPublicAssistantCommand;
use App\Domain\Chat\Models\ChatHistory;
use App\Domain\Chat\Queries\AskAssistantQuery;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

readonly class AskPublicAssistantHandler
{
    public function __construct(private AskAssistantQuery $askAssistantQuery) {}

    public function handle(AskPublicAssistantCommand $command): array
    {
        $historyKey = $this->getHistoryKey($command->assistant, $command->sessionId);
        $cachedHistory = Cache::get($historyKey, []);

        /** @var Collection<int, ChatHistory> $historyCollection */
        $historyCollection = $this->buildHistory($cachedHistory);

        $result = $this->askAssistantQuery->execute($command->assistant, $command->question, $historyCollection);

        // Сохраняем историю в кэш
        $cachedHistory[] = [
            'question' => $command->question,
            'answer' => $result['answer'],
        ];

        // Ограничиваем историю последними 20 сообщениями
        $cachedHistory = array_slice($cachedHistory, -20);

        Cache::put($historyKey, $cachedHistory, now()->addDay());

        $command->assistant->chatHistories()->create([
            'user_id' => null,
            'session_id' => $command->sessionId,
            'question' => $command->question,
            'answer' => $result['answer'],
        ]);

        return [
            'answer' => $result['answer'],
        ];
    }

    private function getHistoryKey($assistant, $sessionId): string
    {
        return "guest_chat_history:{$assistant->id}:{$sessionId}";
    }

    private function buildHistory(array $messages): Collection
    {
        return collect($messages)
            ->take(-10)
            ->map(fn (array $message): ChatHistory => new ChatHistory([
                'question' => $message['question'],
                'answer' => $message['answer'],
            ]));
    }
}
