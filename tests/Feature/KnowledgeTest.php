<?php

use App\Domain\Assistant\Jobs\TranscribeVoiceJob;
use App\Domain\Assistant\Models\Assistant;
use App\Domain\Knowledge\Jobs\GenerateKnowledgeJob;
use App\Domain\Knowledge\Jobs\ProcessKnowledgeJob;
use App\Domain\Knowledge\Models\Knowledge;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('uploads');
    Queue::fake();
    $this->withoutVite();

    // Bypass policies for tests
    Gate::before(fn () => true);
});

test('user can upload document and it creates knowledge', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $file = UploadedFile::fake()->create('test.pdf', 100);

    $response = $this
        ->actingAs($user)
        ->post(route('assistants.upload-document', $assistant), [
            'document' => $file,
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('knowledge', [
        'assistant_id' => $assistant->id,
        'type' => 'document',
        'name' => 'test.pdf',
        'status' => 'pending',
    ]);

    Queue::assertPushed(ProcessKnowledgeJob::class);
});

test('user can upload txt document', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $file = UploadedFile::fake()->create('test.txt', 100, 'text/plain');

    $response = $this
        ->actingAs($user)
        ->post(route('assistants.upload-document', $assistant), [
            'document' => $file,
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('knowledge', [
        'assistant_id' => $assistant->id,
        'name' => 'test.txt',
    ]);
});

test('user can upload text document', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $file = UploadedFile::fake()->create('test.text', 100, 'text/plain');

    $response = $this
        ->actingAs($user)
        ->post(route('assistants.upload-document', $assistant), [
            'document' => $file,
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('knowledge', [
        'assistant_id' => $assistant->id,
        'name' => 'test.text',
    ]);
});

test('it accepts txt extension even with unusual mime types', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    // Файл с расширением .txt, но MIME-типом image/png (имитация неправильного определения типа)
    $file = UploadedFile::fake()->create('test.txt', 100, 'image/png');

    $response = $this
        ->actingAs($user)
        ->post(route('assistants.upload-document', $assistant), [
            'document' => $file,
        ]);

    $response->assertRedirect();
    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('knowledge', [
        'assistant_id' => $assistant->id,
        'name' => 'test.txt',
    ]);
});

test('it accepts uppercase extensions for documents', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $file = UploadedFile::fake()->create('test.PDF', 100);

    $response = $this
        ->actingAs($user)
        ->post(route('assistants.upload-document', $assistant), [
            'document' => $file,
        ]);

    $response->assertRedirect();
    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('knowledge', [
        'assistant_id' => $assistant->id,
        'name' => 'test.PDF',
    ]);
});

test('user can upload audio and it creates knowledge', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $file = UploadedFile::fake()->create('test.mp3', 100, 'audio/mpeg');

    $response = $this
        ->actingAs($user)
        ->post(route('assistants.upload-audio', $assistant), [
            'audio' => $file,
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('knowledge', [
        'assistant_id' => $assistant->id,
        'type' => 'voice',
        'name' => 'test.mp3',
        'status' => 'pending',
    ]);

    Queue::assertPushed(TranscribeVoiceJob::class);
});

test('user can add url and it creates knowledge', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $url = 'https://example.com';

    $response = $this
        ->actingAs($user)
        ->post(route('assistants.add-url', $assistant), [
            'url' => $url,
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('knowledge', [
        'assistant_id' => $assistant->id,
        'type' => 'website',
        'url' => $url,
        'status' => 'pending',
    ]);

    Queue::assertPushed(GenerateKnowledgeJob::class);
});

test('user can delete knowledge', function () {
    $this->withoutVite();

    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);
    $knowledge = Knowledge::factory()->create([
        'assistant_id' => $assistant->id,
        'type' => 'document',
    ]);

    $response = $this
        ->actingAs($user)
        ->delete(route('assistants.knowledge.destroy', [$assistant, $knowledge]));

    $response->assertRedirect();
    $this->assertDatabaseMissing('knowledge', ['id' => $knowledge->id]);
});
