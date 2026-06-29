<?php

namespace App\Domain\Assistant\Handlers;

use App\Domain\Assistant\Commands\StoreAssistantCommand;
use App\Domain\Assistant\Models\Assistant;

class StoreAssistantHandler
{
    public function handle(StoreAssistantCommand $command): Assistant
    {
        $data = $command->dto->toArray();

        if ($command->dto->avatar) {
            $data['avatar'] = $command->dto->avatar->store('assistants/avatars', 'uploads');
        }

        if ($command->dto->backgroundImage) {
            $data['background_image'] = $command->dto->backgroundImage->store('assistants/backgrounds', 'uploads');
        }

        /** @var Assistant $assistant */
        $assistant = $command->user->assistants()->create($data);

        return $assistant;
    }
}
