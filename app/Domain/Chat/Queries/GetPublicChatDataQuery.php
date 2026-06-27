<?php

namespace App\Domain\Chat\Queries;

use App\Domain\Assistant\Models\Assistant;
use Illuminate\Support\Facades\Cache;

class GetPublicChatDataQuery
{
    /**
     * @return array{
     *     assistant: array{
     *         id: int,
     *         name: string,
     *         brand_name: string|null,
     *         description: string|null,
     *         welcome_message: string|null,
     *         actions: array|null
     *     },
     *     initialMessages: array,
     *     csrfToken: string|null
     * }
     */
    public function execute(Assistant $assistant, string $sessionId): array
    {
        $historyKey = "guest_chat_history:{$assistant->id}:{$sessionId}";
        $history = Cache::get($historyKey, []);

        return [
            'assistant' => [
                'id' => (int) $assistant->id,
                'name' => (string) $assistant->name,
                'brand_name' => $assistant->brand_name,
                'description' => $assistant->description,
                'welcome_message' => $assistant->welcome_message,
                'actions' => $assistant->actions,
            ],
            'initialMessages' => $history,
            'csrfToken' => csrf_token(),
        ];
    }
}
