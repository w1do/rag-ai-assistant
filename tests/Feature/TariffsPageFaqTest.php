<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Moffhub\Billing\Models\Plan;

beforeEach(function () {
    DB::table('billing_plans')->truncate();

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
