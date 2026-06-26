<?php

use App\Domain\Assistant\Enums\AssistantStyle;
use App\Domain\Assistant\Models\Assistant;
use App\Models\User;

test('assistant can be updated with new fields', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->patch(route('assistants.update', $assistant->id), [
            'name' => 'Updated Name',
            'description' => 'Updated Description',
            'style' => 'positive',
            'brand_name' => 'New Brand',
            'phone' => '123456789',
            'social' => ['telegram' => '@newtg', 'vk' => ''],
            'fallback' => 'New fallback message',
            'system' => 'Custom system prompt.',
        ])
        ->assertRedirect(route('assistants.show', $assistant->id));

    $assistant->refresh();

    expect($assistant->name)->toBe('Updated Name');
    expect($assistant->description)->toBe('Updated Description');
    expect($assistant->style)->toBe(AssistantStyle::Positive);
    expect($assistant->brand_name)->toBe('New Brand');
    expect($assistant->phone)->toBe('123456789');
    expect($assistant->social)->toBe(['telegram' => '@newtg', 'vk' => null]);
    expect($assistant->fallback)->toBe('New fallback message');
    expect($assistant->system)->toBe('Custom system prompt.');
});

test('assistant creation includes new fields', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('assistants.store'), [
            'name' => 'New Assistant',
            'description' => 'Company Info',
            'style' => 'commercial',
            'brand_name' => 'Brand X',
            'phone' => '987654321',
            'social' => ['telegram' => '@brandx', 'vk' => 'vk.com/brandx'],
            'fallback' => 'I dont know.',
            'system' => 'Answer only from knowledge base.',
        ])
        ->assertRedirect(route('assistants.index'));

    $assistant = Assistant::where('name', 'New Assistant')->first();

    expect($assistant->style)->toBe(AssistantStyle::Commercial);
    expect($assistant->brand_name)->toBe('Brand X');
    expect($assistant->phone)->toBe('987654321');
    expect($assistant->social)->toBe(['telegram' => '@brandx', 'vk' => 'vk.com/brandx']);
    expect($assistant->fallback)->toBe('I dont know.');
    expect($assistant->system)->toBe('Answer only from knowledge base.');
});
