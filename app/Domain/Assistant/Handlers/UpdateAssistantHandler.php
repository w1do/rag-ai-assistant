<?php

namespace App\Domain\Assistant\Handlers;

use App\Domain\Assistant\Commands\UpdateAssistantCommand;
use Illuminate\Support\Facades\Storage;

class UpdateAssistantHandler
{
    public function handle(UpdateAssistantCommand $command): bool
    {
        $data = $command->dto->toArray();

        if ($command->dto->avatar) {
            if ($command->assistant->avatar) {
                Storage::disk('public')->delete($command->assistant->avatar);
            }
            $data['avatar'] = $command->dto->avatar->store('assistants/avatars', 'public');
        }

        if ($command->dto->backgroundImage) {
            if ($command->assistant->background_image) {
                Storage::disk('public')->delete($command->assistant->background_image);
            }
            $data['background_image'] = $command->dto->backgroundImage->store('assistants/backgrounds', 'public');
        }

        return $command->assistant->update($data);
    }
}
