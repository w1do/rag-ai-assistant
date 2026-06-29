<?php

use App\Domain\Assistant\Models\Assistant;
use App\Models\User;

test('authenticated user can view assistants index', function () {
    $this->withoutVite();
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('assistants.index'));

    $response->assertOk();
});

test('authenticated user can create assistant', function () {
    $this->withoutVite();
    $user = User::factory()->create(['balance' => 100]);

    $response = $this
        ->actingAs($user)
        ->post(route('assistants.store'), [
            'name' => 'Test Assistant',
            'description' => 'Test Description',
        ]);

    $response->assertRedirect(route('assistants.index'));
    $this->assertDatabaseHas('assistants', [
        'name' => 'Test Assistant',
        'user_id' => $user->id,
    ]);
});

test('authenticated user can view their assistant', function () {
    $this->withoutVite();
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($user)
        ->get(route('assistants.show', $assistant));

    $response->assertOk();
});

test('user cannot view others assistant', function () {
    $this->withoutVite();
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $otherUser->id]);

    $response = $this
        ->actingAs($user)
        ->get(route('assistants.show', $assistant));

    $response->assertForbidden();
});
