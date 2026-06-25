<?php

namespace App\Domain\Assistant\Queries;

use App\Models\User;

class GetDashboardStatsQuery
{
    public function execute(User $user): array
    {
        return [
            'stats' => [
                'assistants_count' => $user->assistants()->count(),
                'chats_count' => $user->assistants()->withCount('chatHistories')->get()->sum('chat_histories_count'),
                'articles_count' => $user->assistants()->withCount('articles')->get()->sum('articles_count'),
            ],
            'recent_assistants' => $user->assistants()->latest()->take(5)->get(),
        ];
    }
}
