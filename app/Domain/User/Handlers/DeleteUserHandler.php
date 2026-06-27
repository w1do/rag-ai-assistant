<?php

namespace App\Domain\User\Handlers;

use App\Domain\Assistant\Commands\DeleteAssistantCommand;
use App\Domain\Assistant\Handlers\DeleteAssistantHandler;
use App\Domain\User\Commands\DeleteUserCommand;

class DeleteUserHandler
{
    public function __construct(
        private DeleteAssistantHandler $deleteAssistantHandler
    ) {}

    public function handle(DeleteUserCommand $command): void
    {
        $user = $command->user;

        // Delete all assistants and their data
        $user->assistants->each(function ($assistant) {
            $this->deleteAssistantHandler->handle(new DeleteAssistantCommand($assistant));
        });

        $user->delete();
    }
}
