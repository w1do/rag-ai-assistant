<?php

namespace App\Domain\Shared\AI\Services;

use LLPhant\Embeddings\Document;
use LLPhant\Embeddings\DocumentSplitter\DocumentSplitter;

class DocumentProcessor
{
    /**
     * Normalize text and split document into chunks.
     *
     * @return Document[]
     */
    public function process(Document $document, int $maxLength = 800): array
    {
        $document->content = $this->normalize($document->content);

        return DocumentSplitter::splitDocument($document, $maxLength);
    }

    public function normalize(string $text): string
    {
        // Keep newlines but remove multiple spaces and tabs
        $text = preg_replace('/[ \t]+/', ' ', $text);

        // Limit multiple newlines to max two (to keep paragraphs but remove excessive whitespace)
        $text = preg_replace('/\n{3,}/', "\n\n", $text);

        return trim($text);
    }
}
