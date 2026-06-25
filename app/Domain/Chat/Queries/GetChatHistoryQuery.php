<?php

namespace App\Domain\Chat\Queries;

use App\Domain\Assistant\Models\Assistant;
use Illuminate\Database\Eloquent\Collection;

class GetChatHistoryQuery
{
    public function execute(Assistant $assistant): Collection
    {
        return $assistant->chatHistories()->with('user')->oldest()->get();
    }
}
