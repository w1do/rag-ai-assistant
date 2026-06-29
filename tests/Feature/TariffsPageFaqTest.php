<?php

use App\Models\User;
use Illuminate\Support\Str;
use Moffhub\Billing\Models\Plan;

beforeEach(function () {
    Plan::create([
        'ulid' => (string) Str::ulid(),
        'name' => 'Start',
        'slug' => 'start',
        'base_price' => 0,
        'currency' => 'RUB',
        'billing_cycle' => 'monthly',
        'is_active' => true,
        'trial_days' => 0,
        'limits' => [],
    ]);
});

test('tariffs page renders successfully', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('tariffs'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('Tariffs'));
});

test('tariffs page passes plans and features props', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('tariffs'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Tariffs')
        ->has('plans')
        ->has('features')
    );
});

test('current plan slug is passed to the page props', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('tariffs'));

    $response->assertInertia(fn ($page) => $page
        ->component('Tariffs')
        ->has('currentPlanSlug')
    );
});
