<?php

namespace App\Domain\Assistant\Handlers;

use App\Domain\Assistant\Actions\DeleteAssistantDataAction;
use App\Domain\Assistant\Commands\DeleteAssistantCommand;
use App\Domain\Knowledge\Models\Knowledge;
use Illuminate\Support\Facades\Storage;

class DeleteAssistantHandler
{
    public function __construct(
        private DeleteAssistantDataAction $deleteAssistantDataAction
    ) {}

    public function handle(DeleteAssistantCommand $command): bool
    {
        $assistant = $command->assistant;

        // Delete knowledge files
        $assistant->knowledge->each(function (Knowledge $knowledge) {
            if ($knowledge->path) {
                Storage::delete($knowledge->path);
            }
        });

        $this->deleteAssistantDataAction->execute($assistant);

        return $assistant->delete();
    }
}
