<?php

use App\Http\Controllers\Assistant\Api\V1\AssistantCallbackController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/callback', [AssistantCallbackController::class, 'handle']);
});
