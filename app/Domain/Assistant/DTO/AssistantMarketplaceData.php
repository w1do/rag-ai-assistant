<?php

namespace App\Domain\Assistant\DTO;

use App\Domain\Assistant\Models\Assistant;

readonly class AssistantMarketplaceData
{
    public function __construct(
        public int $id,
        public string $name,
        public ?string $description,
        public string $category,
        public string $status,
        public ?array $social = null,
        public ?string $welcome_message = null,
    ) {}

    public static function fromModel(Assistant $assistant, string $category): self
    {
        return new self(
            id: $assistant->id,
            name: $assistant->name,
            description: $assistant->description,
            category: $category,
            status: $assistant->status,
            social: $assistant->social,
            welcome_message: $assistant->welcome_message,
        );
    }
}
