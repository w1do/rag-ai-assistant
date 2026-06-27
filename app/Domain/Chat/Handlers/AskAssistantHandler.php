<?php

namespace App\Domain\Chat\Handlers;

use App\Domain\Chat\Commands\AskAssistantCommand;
use App\Domain\Chat\Models\ChatHistory;
use App\Domain\Chat\Queries\AskAssistantQuery;
use Illuminate\Support\Collection;

class AskAssistantHandler
{
    public function __construct(private AskAssistantQuery $askAssistantQuery) {}

    public function handle(AskAssistantCommand $command): ChatHistory
    {
        /** @var Collection<int, ChatHistory> $history */
        $history = $command->assistant->chatHistories()
            ->where('user_id', $command->user->id)
            ->latest()
            ->limit(5)
            ->get()
            ->reverse();

        $result = $this->askAssistantQuery->execute($command->assistant, $command->question, $history);

        /** @var ChatHistory $chatHistory */
        $chatHistory = $command->assistant->chatHistories()->create([
            'user_id' => $command->user->id,
            'question' => $command->question,
            'answer' => $result['answer'],
        ]);

        return $chatHistory;
    }
}
