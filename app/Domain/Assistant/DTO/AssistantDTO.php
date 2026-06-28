<?php

namespace App\Domain\Assistant\DTO;

readonly class AssistantDTO
{
    public function __construct(
        public string $name,
        public ?string $slug = null,
        public ?string $description = null,
        public ?string $style = null,
        public ?string $brandName = null,
        public ?string $phone = null,
        public ?array $social = null,
        public ?string $fallback = null,
        public ?string $welcomeMessage = null,
        public ?array $actions = null,
        public ?string $system = null,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            slug: $data['slug'] ?? null,
            description: $data['description'] ?? null,
            style: $data['style'] ?? null,
            brandName: $data['brand_name'] ?? null,
            phone: $data['phone'] ?? null,
            social: $data['social'] ?? null,
            fallback: $data['fallback'] ?? null,
            welcomeMessage: $data['welcome_message'] ?? null,
            actions: $data['actions'] ?? null,
            system: $data['system'] ?? null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return array_filter([
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'style' => $this->style,
            'brand_name' => $this->brandName,
            'phone' => $this->phone,
            'social' => $this->social,
            'fallback' => $this->fallback,
            'welcome_message' => $this->welcomeMessage,
            'actions' => $this->actions,
            'system' => $this->system,
        ], fn ($value) => $value !== null);
    }
}
