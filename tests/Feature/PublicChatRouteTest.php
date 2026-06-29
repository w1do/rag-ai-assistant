<?php

use App\Domain\Assistant\Models\Assistant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('public chat init route returns 200', function () {
    $user = \App\Models\User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $response = $this->get("/share-chat/{$assistant->id}/init");

    $response->assertStatus(200);
});

test('public chat show route returns 200', function () {
    $user = \App\Models\User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $response = $this->get("/share-chat/{$assistant->id}");

    $response->assertStatus(200);
});
