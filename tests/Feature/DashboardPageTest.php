<?php

use App\Domain\Assistant\Models\Assistant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('dashboard page is displayed', function () {
    $user = User::factory()->create();

    Assistant::factory()->count(3)->create([
        'user_id' => $user->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->get('/');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Dashboard')
        ->has('stats')
        ->has('recent_assistants', 3)
    );
});
