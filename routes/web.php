<?php

use App\Domain\Assistant\Actions\IndexAssistantDocumentsAction;
use App\Domain\Assistant\Models\Assistant;
use App\Http\Controllers\Assistant\AssistantController;
use App\Http\Controllers\Assistant\DashboardController;
use App\Http\Controllers\Assistant\MarketplaceController;
use App\Http\Controllers\Chat\ChatController;
use App\Http\Controllers\Chat\PublicChatController;
use App\Http\Controllers\User\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use LLPhant\Embeddings\Document;

Route::get('/', function () {
    $demoAssistant = Assistant::find(2);

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'demoWelcomeMessage' => $demoAssistant?->welcome_message,
        'demoActions' => $demoAssistant?->actions,
    ]);
});

Route::get('/chats', [MarketplaceController::class, 'index'])->name('chats.index');

Route::get('/docs', function () {
    return file_get_contents(public_path('docs/index.html'));
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('assistants', AssistantController::class);
    Route::post('assistants/{assistant}/upload-document', [AssistantController::class, 'uploadDocument'])->name('assistants.upload-document');
    Route::post('assistants/{assistant}/upload-audio', [AssistantController::class, 'uploadAudio'])->name('assistants.upload-audio');
    Route::post('assistants/{assistant}/add-url', [AssistantController::class, 'addUrl'])->name('assistants.add-url');
    Route::delete('assistants/{assistant}/knowledge/{knowledge}', [AssistantController::class, 'destroyKnowledge'])->name('assistants.knowledge.destroy');

    Route::get('assistants/{assistant}/chat', [ChatController::class, 'index'])->name('assistants.chat');

    Route::get('/monitoring', fn () => Inertia::render('Monitoring'))->name('monitoring');
    Route::get('/competitors', fn () => Inertia::render('Competitors'))->name('competitors');
    Route::get('/bots', fn () => Inertia::render('Bots'))->name('bots');
    Route::get('/tariffs', fn () => Inertia::render('Tariffs'))->name('tariffs');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
 * Общедоступный чат-виджет.
 *
 * Маршруты не требуют авторизации и используются встраиваемым на сторонние
 * сайты виджетом (`public/widget.js`). Страница чата загружается внутри iframe.
 */
Route::middleware('allow.iframe')->group(function () {
    Route::get('/share-chat/{assistant}', [PublicChatController::class, 'show'])->name('share-chat.show');
    Route::post('/share-chat/{assistant}/message', [PublicChatController::class, 'message'])->name('share-chat.message');
});

require __DIR__.'/auth.php';

Route::get('/test', function () {
    $assistant = Assistant::first();
    if (! $assistant) {
        return 'Ассистент не найден. Пожалуйста, создайте хотя бы одного ассистента в базе данных.';
    }

    $content = <<<'MARKDOWN'
# Установка ГБО в Тюмени (Тест)

Это тестовый документ в формате Markdown, созданный для проверки индексации данных в Qdrant и локальную базу данных (таблица chunks).

## Преимущества ГБО
* Экономия на топливе до 50%
* Экологичность
* Увеличение ресурса двигателя

### Наши услуги
1. Установка оборудования 4 поколения
2. Настройка и калибровка
3. Обслуживание систем BRC и Digitronic

[Подробнее на сайте](https://example.com)
MARKDOWN;

    $document = new Document;
    $document->content = $content;
    $document->sourceName = 'manual_browser_test';
    $document->sourceType = 'manual';
    $document->hash = hash('sha256', $content);

    /** @var IndexAssistantDocumentsAction $action */
    $action = app(IndexAssistantDocumentsAction::class);

    try {
        // Используем позиционные аргументы, чтобы избежать ошибок с именованными параметрами
        $action->execute($assistant, [$document]);
        $chunksCount = $assistant->chunks()->count();

        return response()->json([
            'status' => 'success',
            'message' => 'Индексация успешно завершена!',
            'assistant_id' => $assistant->id,
            'chunks_in_db' => $chunksCount,
            'content_preview' => mb_substr($content, 0, 100).'...',
        ]);
    } catch (Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Ошибка при индексации: '.$e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ], 500);
    }
});
