<?php

use App\Domain\Assistant\Models\Assistant;
use App\Models\User;

test('assistant generates slug from name', function () {
    $user = User::factory()->create();

    $assistant = Assistant::create([
        'user_id' => $user->id,
        'name' => 'My New Assistant',
        'status' => 'ready',
    ]);

    expect($assistant->slug)->toBe('my-new-assistant');
});

test('assistant generates unique slug', function () {
    $user = User::factory()->create();

    $assistant1 = Assistant::create([
        'user_id' => $user->id,
        'name' => 'Duplicate Name',
        'status' => 'ready',
    ]);

    $assistant2 = Assistant::create([
        'user_id' => $user->id,
        'name' => 'Duplicate Name',
        'status' => 'ready',
    ]);

    expect($assistant1->slug)->toBe('duplicate-name');
    expect($assistant2->slug)->toBe('duplicate-name-1');
});
