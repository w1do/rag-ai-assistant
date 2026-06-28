<?php

use App\Http\Controllers\Assistant\Api\V1\AssistantCallbackController;
use App\Http\Controllers\Assistant\Api\V1\SearchAssistantController;
use App\Http\Controllers\Chat\Api\ChatController;
use App\Http\Controllers\Chat\PublicChatController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {

    Route::get('/chats', [ChatController::class, 'index']);

    Route::prefix('v1')->group(function () {
        Route::post('/callback', [AssistantCallbackController::class, 'handle']);
        Route::get('/assistants/search', SearchAssistantController::class);
    });
});

// Сохраняем поддержку /api для внутренних нужд или существующих интеграций
Route::get('/chats', [ChatController::class, 'index']);
Route::prefix('v1')->group(function () {
    Route::post('/callback', [AssistantCallbackController::class, 'handle']);
    Route::get('/assistants/search', SearchAssistantController::class);
});
