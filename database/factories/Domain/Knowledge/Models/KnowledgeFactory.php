<?php

namespace Database\Factories\Domain\Knowledge\Models;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Knowledge\Models\Knowledge;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Knowledge>
 */
class KnowledgeFactory extends Factory
{
    protected $model = Knowledge::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'assistant_id' => Assistant::factory(),
            'type' => $this->faker->randomElement(['document', 'voice', 'website']),
            'name' => $this->faker->sentence(3),
            'status' => 'pending',
            'metadata' => [],
        ];
    }
}
