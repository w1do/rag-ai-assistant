<?php

namespace App\Domain\Assistant\Handlers;

use App\Domain\Assistant\Commands\UpdateAssistantCommand;

class UpdateAssistantHandler
{
    public function handle(UpdateAssistantCommand $command): bool
    {
        return $command->assistant->update($command->dto->toArray());
    }
}
