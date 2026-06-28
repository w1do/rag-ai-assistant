<?php

use App\Domain\Assistant\Models\Assistant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('assistant show page has correct props', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('assistants.show', $assistant))
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('Assistants/Show')
            ->has('assistant', fn (Assert $page) => $page
                ->has('id')
                ->has('name')
                ->has('description')
                ->has('status')
                ->has('chunks')
                ->has('knowledge')
                ->has('knowledge_count')
                ->etc()
            )
        );
});
