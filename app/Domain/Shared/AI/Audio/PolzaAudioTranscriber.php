<?php

namespace App\Domain\Shared\AI\Audio;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use LLPhant\Audio\Transcription;
use LLPhant\OpenAIConfig;

class PolzaAudioTranscriber
{
    private string $apiKey;

    private string $baseUrl;

    private string $model;

    public function __construct(OpenAIConfig $config)
    {
        $this->apiKey = $config->apiKey ?? config('llphant.openai.api_key');
        $this->baseUrl = $config->url ?? config('llphant.openai.base_url', 'https://polza.ai/api/v1');
        $this->model = $config->model ?? config('llphant.openai.audio_model', 'openai/whisper-1');
    }

    public function transcribe(string $filePath): Transcription
    {
        if (! file_exists($filePath)) {
            throw new \Exception("Audio file not found: {$filePath}");
        }

        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        $mimeType = $this->getMimeType($extension);
        $base64Data = base64_encode(file_get_contents($filePath));
        $fileDataUrl = "data:{$mimeType};base64,{$base64Data}";

        $response = Http::withToken($this->apiKey)
            ->timeout(120)
            ->post("{$this->baseUrl}/audio/transcriptions", [
                'file' => $fileDataUrl,
                'model' => $this->model,
                'response_format' => 'json',
            ]);

        if ($response->failed()) {
            Log::error('Polza AI Transcription failed', [
                'status' => $response->status(),
                'body' => $response->body(),
                'model' => $this->model,
                'url' => "{$this->baseUrl}/audio/transcriptions",
            ]);
            throw new \Exception('Polza AI Transcription failed: '.$response->body());
        }

        $data = $response->json();

        return new Transcription(
            $data['text'] ?? '',
            $data['language'] ?? null,
            (float) ($data['duration'] ?? 0)
        );
    }

    private function getMimeType(string $extension): string
    {
        return match (strtolower($extension)) {
            'mp3' => 'audio/mpeg',
            'wav' => 'audio/wav',
            'm4a' => 'audio/mp4',
            'flac' => 'audio/flac',
            'ogg' => 'audio/ogg',
            'webm' => 'audio/webm',
            default => 'application/octet-stream',
        };
    }
}
