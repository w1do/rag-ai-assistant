<?php

namespace App\Domain\Assistant\DTO;

use App\Domain\Assistant\Models\Assistant;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'AssistantMarketplaceData',
    title: 'Assistant Marketplace Data',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'name', type: 'string'),
        new OA\Property(property: 'slug', type: 'string'),
        new OA\Property(property: 'description', type: 'string', nullable: true),
        new OA\Property(property: 'category', type: 'string'),
        new OA\Property(property: 'status', type: 'string'),
        new OA\Property(property: 'social', type: 'object', nullable: true),
        new OA\Property(property: 'welcome_message', type: 'string', nullable: true),
    ]
)]
readonly class AssistantMarketplaceData
{
    public function __construct(
        public int $id,
        public string $name,
        public string $slug,
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
            slug: $assistant->slug,
            description: $assistant->description,
            category: $category,
            status: $assistant->status,
            social: $assistant->social,
            welcome_message: $assistant->welcome_message,
        );
    }
}
