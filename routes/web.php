<?php

use App\Http\Controllers\AssistantController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('assistants', AssistantController::class);
    Route::post('assistants/{assistant}/upload-document', [AssistantController::class, 'uploadDocument'])->name('assistants.upload-document');
    Route::post('assistants/{assistant}/upload-audio', [AssistantController::class, 'uploadAudio'])->name('assistants.upload-audio');
    Route::post('assistants/{assistant}/add-url', [AssistantController::class, 'addUrl'])->name('assistants.add-url');

    Route::get('assistants/{assistant}/chat', [\App\Http\Controllers\ChatController::class, 'index'])->name('assistants.chat');
    Route::post('assistants/{assistant}/chat', [\App\Http\Controllers\ChatController::class, 'store'])->name('assistants.chat.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
