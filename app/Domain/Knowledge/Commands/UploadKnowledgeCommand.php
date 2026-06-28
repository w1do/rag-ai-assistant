<?php

namespace App\Domain\Knowledge\Commands;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Knowledge\DTO\UploadKnowledgeDTO;

readonly class UploadKnowledgeCommand
{
    public function __construct(
        public Assistant $assistant,
        public UploadKnowledgeDTO $dto
    ) {}
}
