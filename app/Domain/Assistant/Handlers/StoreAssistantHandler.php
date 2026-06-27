<?php

namespace App\Domain\Assistant\Handlers;

use App\Domain\Assistant\Commands\StoreAssistantCommand;
use App\Domain\Assistant\Models\Assistant;

class StoreAssistantHandler
{
    public function handle(StoreAssistantCommand $command): Assistant
    {
        /** @var Assistant $assistant */
        $assistant = $command->user->assistants()->create($command->dto->toArray());

        return $assistant;
    }
}
