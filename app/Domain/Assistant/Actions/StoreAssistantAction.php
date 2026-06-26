<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Models\Assistant;
use App\Models\User;

class StoreAssistantAction
{
    /**
     * @param  array{name: string, description: ?string}  $data
     */
    public function execute(User $user, array $data): Assistant
    {
        return $user->assistants()->create($data);
    }
}
