<?php

use App\Domain\Assistant\Enums\AssistantStyle;
use App\Domain\Assistant\Models\Assistant;
use App\Models\User;

test('assistant can have style, brand name, phone, social and fallback', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create([
        'user_id' => $user->id,
        'style' => AssistantStyle::Positive,
        'brand_name' => 'SuperBrand',
        'phone' => '+79991234567',
        'social' => ['telegram' => '@superbrand'],
        'fallback' => 'I do not know, sorry.',
    ]);

    $assistant->refresh();

    expect($assistant->style)->toBe(AssistantStyle::Positive);
    expect($assistant->brand_name)->toBe('SuperBrand');
    expect($assistant->phone)->toBe('+79991234567');
    expect($assistant->social)->toBe(['telegram' => '@superbrand']);
    expect($assistant->fallback)->toBe('I do not know, sorry.');
});

test('assistant style defaults to business', function () {
    $user = User::factory()->create();
    $assistant = Assistant::create([
        'user_id' => $user->id,
        'name' => 'Test Assistant',
    ]);

    expect($assistant->style)->toBe(AssistantStyle::Business);
});
