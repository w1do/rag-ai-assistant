<?php

namespace App\Domain\Chat\DTO;

readonly class PublicMessageDTO
{
    public function __construct(
        public string $question
    ) {}

    /**
     * @param  array{question: string}  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            question: $data['question']
        );
    }
}
