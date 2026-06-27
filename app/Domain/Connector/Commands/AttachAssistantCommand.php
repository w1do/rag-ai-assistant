<?php

namespace App\Domain\Connector\Commands;

readonly class AttachAssistantCommand
{
    public function __construct(
        public int $connectorId,
        public int $assistantId,
    ) {}
}
