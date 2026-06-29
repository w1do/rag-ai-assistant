<?php

use App\Domain\Assistant\Actions\IndexAssistantDocumentsAction;
use App\Domain\Assistant\Models\Assistant;
use App\Domain\Knowledge\Actions\ProcessKnowledgeAction;
use App\Domain\Knowledge\Models\Knowledge;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('it extracts text from file and saves to content', function () {
    Storage::fake('uploads');

    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);
    $knowledge = Knowledge::factory()->create([
        'assistant_id' => $assistant->id,
        'path' => 'documents/test.txt',
        'type' => 'document',
        'status' => 'pending',
    ]);

    Storage::disk('uploads')->put('documents/test.txt', 'Hello world, this is a test document.');

    $indexAction = mock(IndexAssistantDocumentsAction::class);
    $indexAction->shouldReceive('execute')->once();

    $action = new ProcessKnowledgeAction($indexAction);
    $action->execute($knowledge);

    $knowledge->refresh();

    expect($knowledge->content)->toBe('Hello world, this is a test document.');
    expect($knowledge->status)->toBe('ready');
});

test('it handles non-utf8 text files', function () {
    Storage::fake('uploads');

    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);
    $knowledge = Knowledge::factory()->create([
        'assistant_id' => $assistant->id,
        'path' => 'documents/windows-1251.txt',
        'type' => 'document',
        'status' => 'pending',
    ]);

    // Текст "Привет мир" в кодировке Windows-1251
    $content = mb_convert_encoding('Привет мир', 'Windows-1251', 'UTF-8');
    Storage::disk('uploads')->put('documents/windows-1251.txt', $content);

    $indexAction = mock(IndexAssistantDocumentsAction::class);
    $indexAction->shouldReceive('execute')->once();

    $action = new ProcessKnowledgeAction($indexAction);
    $action->execute($knowledge);

    $knowledge->refresh();

    expect($knowledge->content)->toBe('Привет мир');
    expect($knowledge->status)->toBe('ready');
});

test('it handles corrupted pdf file', function () {
    Storage::fake('uploads');

    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);
    $knowledge = Knowledge::factory()->create([
        'assistant_id' => $assistant->id,
        'path' => 'documents/corrupted.pdf',
        'type' => 'document',
        'status' => 'pending',
    ]);

    // Пишем строку, которая не является валидным PDF
    Storage::disk('uploads')->put('documents/corrupted.pdf', 'This is not a PDF file but has .pdf extension');

    $indexAction = mock(IndexAssistantDocumentsAction::class);
    // Индексация НЕ должна быть вызвана
    $indexAction->shouldNotReceive('execute');

    $action = new ProcessKnowledgeAction($indexAction);
    $action->execute($knowledge);

    $knowledge->refresh();

    expect($knowledge->status)->toBe('error');
    expect($knowledge->metadata['error'])->not->toBeEmpty();
});

test('it handles file with only whitespace content', function () {
    Storage::fake('uploads');

    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);
    $knowledge = Knowledge::factory()->create([
        'assistant_id' => $assistant->id,
        'path' => 'documents/whitespace.txt',
        'type' => 'document',
        'status' => 'pending',
    ]);

    Storage::disk('uploads')->put('documents/whitespace.txt', "   \n\t  \n ");

    $indexAction = mock(IndexAssistantDocumentsAction::class);
    $indexAction->shouldNotReceive('execute');

    $action = new ProcessKnowledgeAction($indexAction);
    $action->execute($knowledge);

    $knowledge->refresh();

    expect($knowledge->status)->toBe('error');
    expect($knowledge->metadata['error'])->toContain('Не удалось извлечь текст');
});
