<?php

use App\Domain\Assistant\Jobs\ProcessDocumentJob;
use App\Domain\Assistant\Jobs\TranscribeVoiceJob;
use App\Domain\Assistant\Models\Assistant;
use App\Domain\Knowledge\Jobs\GenerateKnowledgeJob;
use App\Domain\Knowledge\Models\Knowledge;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

test('user can upload document and it creates knowledge', function () {
    Storage::fake('local');
    Queue::fake();
    $this->withoutVite();

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

    Queue::assertPushed(ProcessDocumentJob::class);
});

test('user can upload audio and it creates knowledge', function () {
    Storage::fake('local');
    Queue::fake();
    $this->withoutVite();

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
    Queue::fake();
    $this->withoutVite();

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
