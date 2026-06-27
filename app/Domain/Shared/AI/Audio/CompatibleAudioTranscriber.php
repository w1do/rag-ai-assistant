<?php

namespace App\Domain\Shared\AI\Audio;

use LLPhant\Audio\Transcription;
use LLPhant\OpenAIConfig;
use LLPhant\Utility;
use OpenAI;
use OpenAI\Contracts\ClientContract;

class CompatibleAudioTranscriber
{
    private readonly ClientContract $client;

    public string $model;

    /** @var array<string, mixed> */
    private array $modelOptions = [];

    public function __construct(OpenAIConfig $config)
    {
        $apiKey = $config->apiKey ?? Utility::readEnvironment('OPENAI_API_KEY');

        $factory = OpenAI::factory()
            ->withApiKey($apiKey)
            ->withBaseUri($config->url ?? (string) Utility::readEnvironment('OPENAI_BASE_URL', 'https://api.openai.com/v1'));

        $this->client = $factory->make();
        $this->model = $config->model ?? 'whisper-1';
        $this->modelOptions = $config->modelOptions ?? [];
    }

    public function transcribe(string $fileName): Transcription
    {
        $response = $this->client->audio()->transcribe([
            ...$this->modelOptions,
            'model' => $this->model,
            'file' => fopen($fileName, 'r'),
            'response_format' => 'json',
        ]);

        return new Transcription(
            $response->text,
            $response->language ?? null,
            $response->duration ?? null
        );
    }
}
