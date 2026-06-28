<?php

use App\Domain\Assistant\Models\Assistant;
use App\Models\User;

it('returns initialization data for public chat', function () {
    $assistant = Assistant::factory()->create([
        'user_id' => User::factory(),
        'welcome_message' => 'Hello!',
        'actions' => ['Action 1', 'Action 2'],
        'brand_name' => 'Company Name',
        'phone' => '+123456789',
        'description' => 'Company Description',
        'social' => ['facebook' => 'fb.com', 'instagram' => 'inst.com'],
    ]);

    $this->get(route('share-chat.init', $assistant))
        ->assertOk()
        ->assertExactJson([
            'welcome_message' => 'Hello!',
            'actions' => ['Action 1', 'Action 2'],
            'company_name' => 'Company Name',
            'phone' => '+123456789',
            'description' => 'Company Description',
            'social_networks' => ['facebook' => 'fb.com', 'instagram' => 'inst.com'],
        ]);
});
