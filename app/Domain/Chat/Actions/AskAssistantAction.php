<?php

namespace App\Domain\Chat\Actions;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Chat\Models\ChatHistory;
use App\Domain\Chat\Queries\AskAssistantQuery;
use App\Models\User;

class AskAssistantAction
{
    public function __construct(private AskAssistantQuery $askAssistantQuery) {}

    public function execute(Assistant $assistant, User $user, string $question): ChatHistory
    {
        $history = $assistant->chatHistories()
            ->where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get()
            ->reverse();

        $result = $this->askAssistantQuery->execute($assistant, $question, $history);

        return $assistant->chatHistories()->create([
            'user_id' => $user->id,
            'question' => $question,
            'answer' => $result['answer'],
            'sources' => collect($result['sources'])->map(fn ($doc) => [
                'content' => $doc->content,
                'sourceName' => $doc->sourceName,
                'sourceType' => $doc->sourceType,
            ])->toArray(),
        ]);
    }
}
