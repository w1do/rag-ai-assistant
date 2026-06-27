<?php

namespace App\Domain\Assistant\Commands;

use App\Domain\Assistant\DTO\AssistantDTO;
use App\Domain\Assistant\Models\Assistant;

readonly class UpdateAssistantCommand
{
    public function __construct(
        public Assistant $assistant,
        public AssistantDTO $dto,
    ) {}
}
