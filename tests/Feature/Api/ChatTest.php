<?php

use App\Domain\Assistant\Models\Assistant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('it returns all assistants for the landing page', function () {
    $user = User::factory()->create();
    Assistant::factory()->count(3)->create(['user_id' => $user->id]);

    $response = $this->getJson('/api/chats');

    $response->assertStatus(200)
        ->assertJsonCount(3, 'data')
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'description',
                    'brand_name',
                    'phone',
                    'social',
                    'welcome_message',
                    'actions',
                    'knowledge_count',
                ],
            ],
        ]);
});

test('it returns empty list if no assistants exist', function () {
    $response = $this->getJson('/api/chats');

    $response->assertStatus(200)
        ->assertJsonCount(0, 'data');
});
