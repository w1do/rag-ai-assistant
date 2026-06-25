<?php

namespace App\Domain\Chat\Actions;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Chat\Models\ChatHistory;
use App\Domain\Shared\AI\Services\RAGService;
use App\Models\User;

class AskAssistantAction
{
    public function __construct(private RAGService $ragService)
    {
    }

    public function execute(Assistant $assistant, User $user, string $question): ChatHistory
    {
        $result = $this->ragService->ask($assistant, $question);

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
