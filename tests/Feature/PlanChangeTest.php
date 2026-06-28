<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Moffhub\Billing\Models\Plan;

beforeEach(function () {
    // Очистка и создание планов для тестов
    DB::table('billing_plans')->truncate();
    DB::table('billing_subscriptions')->truncate();

    Plan::create([
        'ulid' => (string) Str::ulid(),
        'name' => 'Старт',
        'slug' => 'start',
        'base_price' => 10000, // 100.00 RUB
        'currency' => 'RUB',
        'billing_cycle' => 'monthly',
        'is_active' => true,
        'limits' => ['assistants_count' => 1],
    ]);

    Plan::create([
        'ulid' => (string) Str::ulid(),
        'name' => 'Бизнес',
        'slug' => 'business',
        'base_price' => 50000, // 500.00 RUB
        'currency' => 'RUB',
        'billing_cycle' => 'monthly',
        'is_active' => true,
        'limits' => ['assistants_count' => 5],
    ]);
});

test('user can change plan from start to business', function () {
    $user = User::factory()->create(['balance' => 1000]); // 1000 RUB

    // Сначала подписываем на старт (имитируем автоматическую подписку при регистрации)
    $user->subscribe('start')->create();

    expect($user->subscriptions()->active()->count())->toBe(1);
    expect($user->subscription()->plan->slug)->toBe('start');

    // Пытаемся сменить на бизнес
    $response = $this->actingAs($user)->post(route('billing.subscribe', 'business'));

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $user->refresh();

    // Проверяем баланс (было 1000, должно стать 1000 - 500 = 500)
    expect($user->balance)->toBe(500.0);

    // Проверяем подписку
    $activeSubscriptions = $user->subscriptions()->active()->get();
    expect($activeSubscriptions->count())->toBe(1);
    expect($activeSubscriptions->first()->plan->slug)->toBe('business');
});

test('all active subscriptions are cancelled when changing plan', function () {
    $user = User::factory()->create(['balance' => 1000]);

    // Создаем 3 активных подписки на старт (имитируем баг с дублями)
    $user->subscribe('start')->create();
    $user->subscribe('start')->create();
    $user->subscribe('start')->create();

    expect($user->subscriptions()->active()->count())->toBe(3);

    // Смена тарифа должна отменить ВСЕ 3 и создать 1 новую
    $this->actingAs($user)->post(route('billing.subscribe', 'business'));

    $user->refresh();
    expect($user->subscriptions()->active()->count())->toBe(1);
    expect($user->subscription()->plan->slug)->toBe('business');
});

test('user cannot change plan if balance is insufficient', function () {
    $user = User::factory()->create(['balance' => 100]); // 100 RUB
    $user->subscribe('start')->create();

    // Бизнес стоит 500
    $response = $this->actingAs($user)->post(route('billing.subscribe', 'business'));

    $response->assertRedirect();
    $response->assertSessionHas('error', 'Недостаточно средств на балансе');

    $user->refresh();
    expect($user->balance)->toBe(100.0);
    expect($user->subscription()->plan->slug)->toBe('start');
});
