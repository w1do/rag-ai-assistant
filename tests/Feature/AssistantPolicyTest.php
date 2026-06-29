<?php

use App\Domain\Assistant\Models\Assistant;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Moffhub\Billing\Models\Plan;
use Moffhub\Billing\Models\Subscription;

test('user with zero balance but active subscription can upload audio', function () {
    $user = User::factory()->create(['balance' => 0]);
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $plan = Plan::create([
        'ulid' => (string) Str::ulid(),
        'name' => 'Start',
        'slug' => 'start',
        'base_price' => 1000,
        'billing_cycle' => 'monthly',
        'limits' => [
            'voice_count' => 5,
        ],
    ]);

    Subscription::create([
        'ulid' => (string) Str::ulid(),
        'billable_id' => $user->id,
        'billable_type' => User::class,
        'plan_id' => $plan->id,
        'status' => 'active',
        'starts_at' => now(),
    ]);

    // Проверяем политику напрямую
    $canUpload = Gate::forUser($user)->allows('uploadAudio', $assistant);

    // Теперь должно быть true
    expect($canUpload)->toBeTrue();
});

test('user with active subscription but missing voice_count limit can upload audio by default', function () {
    $user = User::factory()->create(['balance' => 0]);
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $plan = Plan::create([
        'ulid' => (string) Str::ulid(),
        'name' => 'No Limits',
        'slug' => 'no-limits',
        'base_price' => 1000,
        'billing_cycle' => 'monthly',
        'limits' => [], // Пустые лимиты
    ]);

    Subscription::create([
        'ulid' => (string) Str::ulid(),
        'billable_id' => $user->id,
        'billable_type' => User::class,
        'plan_id' => $plan->id,
        'status' => 'active',
        'starts_at' => now(),
    ]);

    $canUpload = Gate::forUser($user)->allows('uploadAudio', $assistant);

    // Теперь должно быть true (дефолт -1)
    expect($canUpload)->toBeTrue();
});

test('user with positive balance and NO subscription can upload audio', function () {
    $user = User::factory()->create(['balance' => 100]);
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    // Нет подписки

    $canUpload = Gate::forUser($user)->allows('uploadAudio', $assistant);

    expect($canUpload)->toBeTrue();
});

test('user with zero balance and NO subscription CANNOT upload audio', function () {
    $user = User::factory()->create(['balance' => 0]);
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $canUpload = Gate::forUser($user)->allows('uploadAudio', $assistant);

    expect($canUpload)->toBeFalse();
});
