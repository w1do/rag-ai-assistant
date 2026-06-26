<?php

use App\Domain\Assistant\Models\Assistant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('public chat page allows iframing', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $response = $this->get(route('share-chat.show', $assistant));

    $response->assertStatus(200);

    // Проверяем, что заголовок X-Frame-Options удален
    $response->assertHeaderMissing('X-Frame-Options');

    // Проверяем, что заголовок CSP установлен правильно
    $response->assertHeader('Content-Security-Policy', "frame-ancestors 'self' *");
});

test('public chat message endpoint has iframe headers', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    // Отправляем некорректный запрос, чтобы получить быструю ошибку валидации,
    // но проверить заголовки от middleware
    $response = $this->postJson(route('share-chat.message', $assistant), []);

    $response->assertHeaderMissing('X-Frame-Options');
    $response->assertHeader('Content-Security-Policy', "frame-ancestors 'self' *");
});
