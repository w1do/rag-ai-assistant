<?php

namespace App\Domain\Knowledge\DTO;

use Illuminate\Http\UploadedFile;

readonly class UploadKnowledgeDTO
{
    public function __construct(
        public UploadedFile $file,
        public string $type = 'document',
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            file: $data['document'],
            type: $data['type'] ?? 'document',
        );
    }
}
