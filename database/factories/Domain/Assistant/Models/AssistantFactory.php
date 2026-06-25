<?php

namespace Database\Factories\Domain\Assistant\Models;

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
        ];
    }
}
