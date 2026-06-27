<?php

use App\Domain\Assistant\Models\Assistant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('can view marketplace index', function () {
    $user = User::factory()->create();

    Assistant::factory()->create([
        'user_id' => $user->id,
        'name' => 'Бизнес ассистент',
        'status' => 'active',
    ]);

    Assistant::factory()->create([
        'user_id' => $user->id,
        'name' => 'RAG ассистент',
        'status' => 'ready',
    ]);

    Assistant::factory()->create([
        'user_id' => $user->id,
        'name' => 'Обычный чат (Общение)',
        'status' => 'active',
    ]);

    $response = $this->get(route('chats.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Chats/Index')
        ->has('assistants', 3)
        ->where('assistants.0.category', 'Бизнес')
        ->where('assistants.1.category', 'RAG')
        ->where('assistants.2.category', 'Общение')
    );
});

it('filters non-active assistants', function () {
    $user = User::factory()->create();

    Assistant::factory()->create([
        'user_id' => $user->id,
        'name' => 'Active',
        'status' => 'active',
    ]);

    Assistant::factory()->create([
        'user_id' => $user->id,
        'name' => 'Draft',
        'status' => 'draft',
    ]);

    $response = $this->get(route('chats.index'));

    $response->assertInertia(fn (Assert $page) => $page
        ->has('assistants', 1)
        ->where('assistants.0.name', 'Active')
    );
});
