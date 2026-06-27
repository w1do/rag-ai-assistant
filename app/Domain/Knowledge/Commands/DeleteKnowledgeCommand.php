<?php

namespace App\Domain\Knowledge\Commands;

use App\Domain\Knowledge\Models\Knowledge;

readonly class DeleteKnowledgeCommand
{
    public function __construct(
        public Knowledge $knowledge
    ) {}
}
