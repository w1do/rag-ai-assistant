<?php

namespace App\Domain\Connector\Handlers;

use App\Domain\Connector\Commands\AttachAssistantCommand;
use App\Domain\Connector\Models\Connector;

class AttachAssistantHandler
{
    public function handle(AttachAssistantCommand $command): void
    {
        $connector = Connector::findOrFail($command->connectorId);
        $connector->assistants()->syncWithoutDetaching([$command->assistantId]);
    }
}
