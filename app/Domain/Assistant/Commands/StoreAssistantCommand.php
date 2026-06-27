<?php

namespace App\Domain\Assistant\Commands;

use App\Domain\Assistant\DTO\AssistantDTO;
use App\Models\User;

readonly class StoreAssistantCommand
{
    public function __construct(
        public User $user,
        public AssistantDTO $dto,
    ) {}
}
