<?php

it('returns a clean error message when assistant is not found', function () {
    $response = $this->getJson('/share-chat/999999');

    $response->assertStatus(404);
    $response->assertJson([
        'message' => 'Assistant not found.',
    ]);
});

it('returns a clean error message when assistant is not found for message', function () {
    $response = $this->postJson('/share-chat/999999/message');

    $response->assertStatus(404);
    $response->assertJson([
        'message' => 'Assistant not found.',
    ]);
});
