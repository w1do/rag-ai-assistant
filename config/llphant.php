<?php

return [
    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'base_url' => env('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
    ],
    'qdrant' => [
        'host' => env('QDRANT_HOST', 'localhost'),
        'port' => env('QDRANT_PORT', 6333),
    ],
];
