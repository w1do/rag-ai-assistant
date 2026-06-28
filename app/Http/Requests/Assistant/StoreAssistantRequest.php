<?php

namespace App\Http\Requests\Assistant;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'StoreAssistantRequest',
    title: 'Store Assistant Request',
    required: ['name'],
    properties: [
        new OA\Property(property: 'name', type: 'string', maxLength: 255),
        new OA\Property(property: 'description', type: 'string', nullable: true),
        new OA\Property(property: 'style', type: 'string', enum: ['commercial', 'business', 'rude', 'positive'], nullable: true),
        new OA\Property(property: 'brand_name', type: 'string', maxLength: 255, nullable: true),
        new OA\Property(property: 'phone', type: 'string', maxLength: 20, nullable: true),
        new OA\Property(property: 'social', type: 'object', nullable: true),
        new OA\Property(property: 'fallback', type: 'string', nullable: true),
        new OA\Property(property: 'welcome_message', type: 'string', nullable: true),
        new OA\Property(property: 'actions', type: 'array', items: new OA\Items(type: 'string'), nullable: true),
        new OA\Property(property: 'system', type: 'string', nullable: true),
    ]
)]
class StoreAssistantRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'style' => 'nullable|string|in:commercial,business,rude,positive',
            'brand_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'social' => 'nullable|array',
            'fallback' => 'nullable|string',
            'welcome_message' => 'nullable|string',
            'actions' => 'nullable|array',
            'system' => 'nullable|string',
        ];
    }
}
