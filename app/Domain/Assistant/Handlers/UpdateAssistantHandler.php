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
            if ($command->assistant->getRawOriginal('avatar')) {
                Storage::disk('uploads')->delete($command->assistant->getRawOriginal('avatar'));
            }
            $data['avatar'] = $command->dto->avatar->store('assistants/avatars', 'uploads');
        }

        if ($command->dto->backgroundImage) {
            if ($command->assistant->getRawOriginal('background_image')) {
                Storage::disk('uploads')->delete($command->assistant->getRawOriginal('background_image'));
            }
            $data['background_image'] = $command->dto->backgroundImage->store('assistants/backgrounds', 'uploads');
        }

        return $command->assistant->update($data);
    }
}
