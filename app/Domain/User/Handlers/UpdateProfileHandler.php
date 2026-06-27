<?php

namespace App\Domain\User\Handlers;

use App\Domain\User\Commands\UpdateProfileCommand;
use App\Models\User;

class UpdateProfileHandler
{
    public function handle(UpdateProfileCommand $command): User
    {
        /** @var User $user */
        $user = $command->user;
        $user->fill($command->dto->toArray());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return $user;
    }
}
