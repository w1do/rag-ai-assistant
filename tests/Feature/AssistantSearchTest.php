<?php

use App\Domain\Assistant\Models\Assistant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('can search assistant by id', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id, 'name' => 'Search Me']);
    Assistant::factory()->create(['user_id' => $user->id, 'name' => 'Other']);

    $response = $this->getJson("/api/v1/assistants/search?filter[id]={$assistant->id}");

    $response->assertStatus(200)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $assistant->id);
});

test('can search assistant by name', function () {
    $user = User::factory()->create();
    Assistant::factory()->create(['user_id' => $user->id, 'name' => 'Assistant One']);
    Assistant::factory()->create(['user_id' => $user->id, 'name' => 'Assistant Two']);
    Assistant::factory()->create(['user_id' => $user->id, 'name' => 'Other']);

    $response = $this->getJson('/api/v1/assistants/search?filter[name]=Assistant');

    $response->assertStatus(200)
        ->assertJsonCount(2, 'data');
});

test('can search assistant by slug', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id, 'name' => 'Unique Name']);

    $response = $this->getJson("/api/v1/assistants/search?filter[slug]={$assistant->slug}");

    $response->assertStatus(200)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.slug', $assistant->slug);
});

test('can search assistant by status', function () {
    $user = User::factory()->create();
    Assistant::factory()->create(['user_id' => $user->id, 'status' => 'ready']);
    Assistant::factory()->create(['user_id' => $user->id, 'status' => 'processing']);

    $response = $this->getJson('/api/v1/assistants/search?filter[status]=ready');

    $response->assertStatus(200)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.status', 'ready');
});

test('can sort assistants by name', function () {
    $user = User::factory()->create();
    Assistant::factory()->create(['user_id' => $user->id, 'name' => 'B Assistant']);
    Assistant::factory()->create(['user_id' => $user->id, 'name' => 'A Assistant']);

    $response = $this->getJson('/api/v1/assistants/search?sort=name');

    $response->assertStatus(200)
        ->assertJsonPath('data.0.name', 'A Assistant')
        ->assertJsonPath('data.1.name', 'B Assistant');
});
