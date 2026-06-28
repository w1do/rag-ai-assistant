<?php

use App\Http\Controllers\Assistant\Api\V1\AssistantCallbackController;
use App\Http\Controllers\Chat\Api\ChatController;
use Illuminate\Support\Facades\Route;

Route::get('/chats', [ChatController::class, 'index']);

Route::prefix('v1')->group(function () {
    Route::post('/callback', [AssistantCallbackController::class, 'handle']);
});
