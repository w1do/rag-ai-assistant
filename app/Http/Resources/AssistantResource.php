<?php

namespace App\Http\Resources;

use App\Domain\Assistant\Models\Assistant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'AssistantResource',
    title: 'Assistant Resource',
    description: 'Краткая информация об ассистенте для лендинга',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'name', type: 'string'),
        new OA\Property(property: 'description', type: 'string', nullable: true),
        new OA\Property(property: 'brand_name', type: 'string', nullable: true),
        new OA\Property(property: 'phone', type: 'string', nullable: true),
        new OA\Property(property: 'social', type: 'object', nullable: true),
        new OA\Property(property: 'welcome_message', type: 'string', nullable: true),
        new OA\Property(property: 'actions', type: 'array', items: new OA\Items(type: 'string'), nullable: true),
        new OA\Property(property: 'knowledge_count', type: 'integer'),
    ]
)]
/**
 * @mixin Assistant
 */
class AssistantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'brand_name' => $this->brand_name,
            'phone' => $this->phone,
            'social' => $this->social,
            'welcome_message' => $this->welcome_message,
            'actions' => $this->actions,
            'knowledge_count' => $this->knowledge_count,
        ];
    }
}
