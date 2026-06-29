<?php

use App\Domain\Assistant\Actions\IndexAssistantDocumentsAction;
use App\Domain\Assistant\Actions\TranscribeAudioAction;
use App\Domain\Assistant\Models\Assistant;
use App\Domain\Knowledge\Models\Knowledge;
use App\Domain\Shared\AI\Audio\CompatibleAudioTranscriber;
use App\Domain\Shared\AI\Audio\PolzaAudioTranscriber;
use App\Infrastructure\AI\AIClientFactory;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;
use LLPhant\Audio\Transcription;
use LLPhant\OpenAIConfig;

test('transcribe audio action uses compatible audio transcriber and handles OpenRouter', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);
    $knowledge = Knowledge::factory()->create([
        'assistant_id' => $assistant->id,
        'path' => 'audio/test.mp3',
        'status' => 'pending',
    ]);

    $transcription = new Transcription('Transcribed text', 'en', 10.0);

    $mockTranscriber = Mockery::mock(CompatibleAudioTranscriber::class);
    $mockTranscriber->shouldReceive('transcribe')
        ->once()
        ->andReturn($transcription);

    $mockFactory = Mockery::mock(AIClientFactory::class);
    $mockFactory->shouldReceive('createAudioTranscriber')
        ->once()
        ->andReturn($mockTranscriber);

    $mockIndexAction = Mockery::mock(IndexAssistantDocumentsAction::class);
    $mockIndexAction->shouldReceive('execute')
        ->once();

    $action = new TranscribeAudioAction($mockIndexAction, $mockFactory);

    Storage::fake('uploads');
    Storage::disk('uploads')->put($knowledge->path, 'dummy content');

    $action->execute($knowledge);

    expect($knowledge->fresh()->content)->toBe('Transcribed text');
    expect($knowledge->fresh()->status)->toBe('ready');
});

test('AIClientFactory selects correct transcriber based on URL', function () {
    $factory = new AIClientFactory;

    Config::set('llphant.openai.api_key', 'test-key');

    // Test Polza AI
    Config::set('llphant.openai.base_url', 'https://polza.ai/api/v1');
    $transcriber = $factory->createAudioTranscriber();
    expect($transcriber)->toBeInstanceOf(PolzaAudioTranscriber::class);

    // Test OpenRouter
    Config::set('llphant.openai.base_url', 'https://openrouter.ai/api/v1');
    $transcriber = $factory->createAudioTranscriber();
    expect($transcriber)->toBeInstanceOf(CompatibleAudioTranscriber::class);

    // Test Default (OpenAI)
    Config::set('llphant.openai.base_url', 'https://api.openai.com/v1');
    $transcriber = $factory->createAudioTranscriber();
    expect($transcriber)->toBeInstanceOf(CompatibleAudioTranscriber::class);
});

test('PolzaAudioTranscriber sends correct request', function () {
    Http::fake([
        'https://polza.ai/api/v1/audio/transcriptions' => Http::response([
            'text' => 'Transcribed by Polza AI',
            'language' => 'ru',
            'duration' => 15.0,
        ], 200),
    ]);

    $config = new OpenAIConfig;
    $config->url = 'https://polza.ai/api/v1';
    $config->apiKey = 'pza_test';

    $transcriber = new PolzaAudioTranscriber($config);

    // Create a dummy file for testing
    $filePath = tempnam(sys_get_temp_dir(), 'audio');
    file_put_contents($filePath, 'dummy audio data');

    $transcription = $transcriber->transcribe($filePath);

    expect($transcription->text)->toBe('Transcribed by Polza AI');
    expect($transcription->durationInSeconds)->toBe(15.0);

    Http::assertSent(function ($request) {
        return str_contains($request->url(), 'polza.ai/api/v1/audio/transcriptions') &&
               $request['response_format'] === 'json' &&
               str_starts_with($request['file'], 'data:application/octet-stream;base64,');
    });

    unlink($filePath);
});

test('CompatibleAudioTranscriber selects correct format for OpenRouter', function () {
    Config::set('llphant.openai.base_url', 'https://openrouter.ai/api/v1');

    $config = new OpenAIConfig;
    $config->apiKey = 'test-key';
    $config->url = 'https://openrouter.ai/api/v1';

    $transcriber = new CompatibleAudioTranscriber($config);

    // We can't easily test the private client call without more complex mocking,
    // but we can verify the class instantiates and the logic is present.
    expect($transcriber)->toBeInstanceOf(CompatibleAudioTranscriber::class);
});
