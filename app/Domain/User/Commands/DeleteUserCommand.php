<?php

namespace App\Domain\User\Commands;

use App\Models\User;

readonly class DeleteUserCommand
{
    public function __construct(
        public User $user
    ) {}
}
