<?php

namespace Database\Factories\Domain\Assistant\Models;

use App\Domain\Assistant\Enums\AssistantStyle;
use App\Domain\Assistant\Models\Assistant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Assistant>
 */
class AssistantFactory extends Factory
{
    protected $model = Assistant::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'description' => $this->faker->sentence(),
            'status' => 'ready',
            'style' => AssistantStyle::Business,
            'brand_name' => $this->faker->company(),
            'phone' => $this->faker->phoneNumber(),
            'social' => [
                'telegram' => 'https://t.me/'.$this->faker->userName(),
                'vk' => 'https://vk.com/'.$this->faker->userName(),
            ],
            'fallback' => 'Извините, я не знаю ответа на этот вопрос.',
            'welcome_message' => 'Здравствуйте! Я ваш AI-ассистент. Чем я могу вам помочь?',
            'system' => null,
        ];
    }
}
