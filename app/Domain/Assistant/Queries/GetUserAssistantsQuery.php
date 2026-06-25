<?php

namespace App\Domain\Assistant\Queries;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class GetUserAssistantsQuery
{
    public function execute(User $user): Collection
    {
        return $user->assistants()->latest()->get();
    }
}
