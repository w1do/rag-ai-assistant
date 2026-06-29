<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Moffhub\Billing\Models\Plan;

beforeEach(function () {
    DB::table('billing_plans')->truncate();

    Plan::create([
        'ulid' => (string) Str::ulid(),
        'name' => 'Старт',
        'slug' => 'start',
        'base_price' => 0,
        'currency' => 'RUB',
        'billing_cycle' => 'monthly',
        'is_active' => true,
        'limits' => [
            'assistants_count' => 1,
            'links_count' => 3,
            'voice_count' => 1,
        ],
    ]);
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post(route('register'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});
