<?php

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Connector\Models\Connector;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('connector page is accessible', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('connectors.index'));

    $response->assertStatus(200);
});

test('can attach assistant to connector', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);
    $connector = Connector::create([
        'name' => 'Test Connector',
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)->post(route('connectors.attach-assistant'), [
        'connector_id' => $connector->id,
        'assistant_id' => $assistant->id,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('connector_assistants', [
        'connector_id' => $connector->id,
        'assistant_id' => $assistant->id,
    ]);
});
