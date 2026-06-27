<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AssistantCallbackRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'assistant_id' => 'required|exists:assistants,id',
            'name' => 'required|string|max:255',
            'chunks' => 'required|array|min:1',
            'chunks.*' => 'required|array|min:1',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'assistant_id.exists' => 'Указанный ассистент не найден.',
            'chunks.*.min' => 'Каждый блок данных (chunk) должен содержать хотя бы одно поле.',
        ];
    }
}
