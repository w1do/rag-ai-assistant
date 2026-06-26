<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Models\Assistant;

class DeleteAssistantAction
{
    public function __construct(private DeleteAssistantDataAction $deleteAssistantDataAction) {}

    public function execute(Assistant $assistant): bool
    {
        $this->deleteAssistantDataAction->execute($assistant);

        return $assistant->delete();
    }
}
