<?php

namespace App\Http\Requests\Assistant;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAssistantRequest extends FormRequest
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
