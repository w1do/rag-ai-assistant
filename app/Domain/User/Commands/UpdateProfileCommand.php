<?php

namespace App\Domain\User\Commands;

use App\Domain\User\DTO\ProfileUpdateDTO;
use App\Models\User;

readonly class UpdateProfileCommand
{
    public function __construct(
        public User $user,
        public ProfileUpdateDTO $dto
    ) {}
}
