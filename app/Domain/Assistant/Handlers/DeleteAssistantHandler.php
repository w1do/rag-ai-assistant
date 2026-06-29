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

        // Delete avatar and background image files
        if ($assistant->getRawOriginal('avatar')) {
            Storage::disk('uploads')->delete($assistant->getRawOriginal('avatar'));
        }

        if ($assistant->getRawOriginal('background_image')) {
            Storage::disk('uploads')->delete($assistant->getRawOriginal('background_image'));
        }

        // Delete knowledge files
        $assistant->knowledge->each(function (Knowledge $knowledge) {
            if ($knowledge->path) {
                Storage::disk('uploads')->delete($knowledge->path);
            }
        });

        $this->deleteAssistantDataAction->execute($assistant);

        return $assistant->delete();
    }
}
