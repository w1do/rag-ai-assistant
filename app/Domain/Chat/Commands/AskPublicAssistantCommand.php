<?php

namespace App\Domain\Chat\Commands;

use App\Domain\Assistant\Models\Assistant;

readonly class AskPublicAssistantCommand
{
    public function __construct(
        public Assistant $assistant,
        public string $question,
        public string $sessionId
    ) {}
}
