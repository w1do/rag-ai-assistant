<?php

namespace App\Domain\Shared\AI\Embeddings;

use Illuminate\Support\Facades\Cache;
use LLPhant\Embeddings\Document;
use LLPhant\Embeddings\EmbeddingGenerator\OpenAI\AbstractOpenAIEmbeddingGenerator;
use LLPhant\OpenAIConfig;

class PolzaAIEmbeddingGenerator extends AbstractOpenAIEmbeddingGenerator
{
    private string $modelName;

    /**
     * @throws \Exception
     */
    public function __construct(OpenAIConfig $config)
    {
        parent::__construct($config);
        $this->modelName = $config->model ?? 'text-embedding-3-small';
    }

    public function getEmbeddingLength(): int
    {
        return str_contains($this->modelName, 'large') ? 3072 : 1536;
    }

    public function getModelName(): string
    {
        return $this->modelName;
    }

    /**
     * @return float[]
     */
    public function embedText(string $text): array
    {
        $cacheKey = $this->getCacheKey($text);

        return Cache::rememberForever($cacheKey, function () use ($text) {
            return parent::embedText($text);
        });
    }

    /**
     * @param  Document[]  $documents
     * @return Document[]
     *
     * @throws \Exception
     */
    public function embedDocuments(array $documents): array
    {
        $uncachedDocuments = [];
        $uncachedIndices = [];

        foreach ($documents as $index => $document) {
            $text = $document->formattedContent ?? $document->content;
            $cacheKey = $this->getCacheKey($text);
            $cachedEmbedding = Cache::get($cacheKey);

            if ($cachedEmbedding !== null) {
                $document->embedding = $cachedEmbedding;
            } else {
                $uncachedDocuments[] = $document;
                $uncachedIndices[] = $index;
            }
        }

        if (! empty($uncachedDocuments)) {
            $embeddedDocuments = parent::embedDocuments($uncachedDocuments);
            foreach ($embeddedDocuments as $i => $document) {
                $text = $document->formattedContent ?? $document->content;
                $cacheKey = $this->getCacheKey($text);
                Cache::forever($cacheKey, $document->embedding);

                // Update the original documents array
                $originalIndex = $uncachedIndices[$i];
                $documents[$originalIndex]->embedding = $document->embedding;
            }
        }

        return $documents;
    }

    private function getCacheKey(string $text): string
    {
        return 'embedding:'.$this->modelName.':'.md5($text);
    }
}
