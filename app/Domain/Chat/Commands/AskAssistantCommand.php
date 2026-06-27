<?php

namespace App\Domain\Chat\Commands;

use App\Domain\Assistant\Models\Assistant;
use App\Models\User;

readonly class AskAssistantCommand
{
    public function __construct(
        public Assistant $assistant,
        public User $user,
        public string $question
    ) {}
}
