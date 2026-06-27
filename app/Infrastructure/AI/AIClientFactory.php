<?php

namespace App\Infrastructure\AI;

use App\Domain\Shared\AI\Audio\CompatibleAudioTranscriber;
use App\Domain\Shared\AI\Audio\PolzaAudioTranscriber;
use App\Domain\Shared\AI\Embeddings\PolzaAIEmbeddingGenerator;
use LLPhant\Chat\OpenAIChat;
use LLPhant\Embeddings\EmbeddingGenerator\EmbeddingGeneratorInterface;
use LLPhant\OpenAIConfig;

class AIClientFactory
{
    public function createEmbeddingGenerator(): EmbeddingGeneratorInterface
    {
        $config = new OpenAIConfig;
        $config->apiKey = config('llphant.openai.api_key');
        $config->url = config('llphant.openai.base_url');
        $config->model = config('llphant.openai.embedding_model', 'text-embedding-3-small');

        return new PolzaAIEmbeddingGenerator($config);
    }

    public function createChatClient(): OpenAIChat
    {
        $config = new OpenAIConfig;
        $config->apiKey = config('llphant.openai.api_key');
        $config->url = config('llphant.openai.base_url');
        $config->model = config('llphant.openai.chat_model', 'gpt-4o-mini');

        return new OpenAIChat($config);
    }

    public function createAudioTranscriber(): PolzaAudioTranscriber|CompatibleAudioTranscriber
    {
        $config = new OpenAIConfig;
        $config->apiKey = config('llphant.openai.api_key');
        $config->url = config('llphant.openai.base_url');
        $config->model = config('llphant.openai.audio_model', 'whisper-1');

        if (str_contains($config->url ?? '', 'polza.ai')) {
            // Polza AI uses 'openai/whisper-1' as the model ID for whisper-1
            if ($config->model === 'whisper-1') {
                $config->model = 'openai/whisper-1';
            }

            return new PolzaAudioTranscriber($config);
        }

        return new CompatibleAudioTranscriber($config);
    }
}
