<?php

namespace App\Domain\Assistant\Commands;

use App\Domain\Assistant\Models\Assistant;

readonly class DeleteAssistantCommand
{
    public function __construct(
        public Assistant $assistant
    ) {}
}
