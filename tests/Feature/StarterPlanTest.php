<?php

use App\Domain\Assistant\Models\Assistant;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;
use Moffhub\Billing\Models\Plan;

beforeEach(function () {
    Queue::fake();
    // Очистка и создание планов для тестов
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

test('new user is automatically subscribed to start plan with 0 balance', function () {
    $response = $this->post(route('register'), [
        'name' => 'New User',
        'email' => 'newuser@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect(route('dashboard'));

    $user = User::where('email', 'newuser@example.com')->first();
    expect($user->balance)->toBe(0.0);
    expect($user->subscribed('main'))->toBeTrue();
    expect($user->subscription('main')->plan->slug)->toBe('start');
});

test('starter plan user cannot create more than 1 assistant', function () {
    $user = User::factory()->create(['balance' => 100]);
    $user->subscribe('start')->create();

    // Создаем первого ассистента
    Assistant::factory()->create(['user_id' => $user->id]);

    // Пытаемся создать второго
    $response = $this->actingAs($user)->post(route('assistants.store'), [
        'name' => 'Second Assistant',
    ]);

    $response->assertForbidden();
});

test('starter plan user cannot create assistant with 0 balance', function () {
    $user = User::factory()->create(['balance' => 0]);
    $user->subscribe('start')->create();

    $response = $this->actingAs($user)->post(route('assistants.store'), [
        'name' => 'Assistant',
    ]);

    $response->assertForbidden();
});

test('starter plan user can add up to 3 links', function () {
    $user = User::factory()->create(['balance' => 100]);
    $user->subscribe('start')->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    // Добавляем 3 ссылки
    for ($i = 1; $i <= 3; $i++) {
        $response = $this->actingAs($user)->post(route('assistants.add-url', $assistant), [
            'url' => "https://example{$i}.com",
        ]);
        $response->assertRedirect();
    }

    // Пытаемся добавить 4-ю
    $response = $this->actingAs($user)->post(route('assistants.add-url', $assistant), [
        'url' => 'https://example4.com',
    ]);

    $response->assertForbidden();
});

test('starter plan user can add only 1 voice message', function () {
    $user = User::factory()->create(['balance' => 100]);
    $user->subscribe('start')->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    // Создаем фейковый файл
    $file = UploadedFile::fake()->create('voice.mp3', 100);

    // Добавляем 1 аудио
    $response = $this->actingAs($user)->post(route('assistants.upload-audio', $assistant), [
        'audio' => $file,
    ]);
    $response->assertRedirect();

    // Пытаемся добавить 2-е
    $response = $this->actingAs($user)->post(route('assistants.upload-audio', $assistant), [
        'audio' => $file,
    ]);

    $response->assertForbidden();
});

test('starter plan user cannot upload documents', function () {
    $user = User::factory()->create(['balance' => 100]);
    $user->subscribe('start')->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $file = UploadedFile::fake()->create('doc.pdf', 100);

    $response = $this->actingAs($user)->post(route('assistants.upload-document', $assistant), [
        'document' => $file,
    ]);

    $response->assertForbidden();
});
