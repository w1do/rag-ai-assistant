<?php

use App\Domain\Assistant\Enums\AssistantStyle;
use App\Domain\Assistant\Models\Assistant;
use App\Domain\Chat\Queries\AskAssistantQuery;
use App\Infrastructure\AI\AIClientFactory;
use App\Infrastructure\AI\VectorStoreManager;
use LLPhant\Chat\Enums\ChatRole;
use LLPhant\Chat\Message;
use LLPhant\Chat\OpenAIChat;
use LLPhant\Embeddings\EmbeddingGenerator\EmbeddingGeneratorInterface;
use LLPhant\Embeddings\VectorStores\Qdrant\QdrantVectorStore;

test('it builds the system message template correctly', function () {
    $assistant = new Assistant([
        'brand_name' => 'BrandX',
        'description' => 'Company description.',
        'phone' => '123456',
        'social' => ['ig' => '@brandx'],
        'style' => AssistantStyle::Rude,
        'fallback' => 'Custom fallback.',
    ]);

    $query = new AskAssistantQuery(
        Mockery::mock(AIClientFactory::class),
        Mockery::mock(VectorStoreManager::class)
    );

    $reflection = new ReflectionClass($query);
    $method = $reflection->getMethod('buildSystemMessageTemplate');
    $method->setAccessible(true);

    $template = $method->invoke($query, $assistant);

    expect($template)->toContain('Твое имя бренда: BrandX');
    expect($template)->toContain('Информация о компании: Company description.');
    expect($template)->toContain('Контактный телефон: 123456');
    expect($template)->toContain('Социальные сети: ig: @brandx');
    expect($template)->toContain('Твой стиль общения: грубый');
    expect($template)->toContain('Custom fallback.');
});

test('the system template enforces the knowledge base constraint', function () {
    $assistant = new Assistant([
        'style' => AssistantStyle::Business,
        'system' => 'Ты дружелюбный консультант магазина.',
    ]);

    $query = new AskAssistantQuery(
        Mockery::mock(AIClientFactory::class),
        Mockery::mock(VectorStoreManager::class)
    );

    $reflection = new ReflectionClass($query);
    $method = $reflection->getMethod('buildSystemMessageTemplate');
    $method->setAccessible(true);

    $template = $method->invoke($query, $assistant);

    expect($template)->toContain('ИСКЛЮЧИТЕЛЬНО на основе предоставленной базы знаний');
    expect($template)->toContain('{context}');
});

test('the custom system prompt is injected into the dialogue messages', function () {
    $assistant = new Assistant([
        'style' => AssistantStyle::Business,
        'system' => 'Ты дружелюбный консультант магазина.',
    ]);

    $embeddingGenerator = Mockery::mock(EmbeddingGeneratorInterface::class);
    $embeddingGenerator->shouldReceive('embedText')->andReturn([0.1, 0.2, 0.3]);

    $vectorStore = Mockery::mock(QdrantVectorStore::class);
    $vectorStore->shouldReceive('similaritySearch')->andReturn([]);

    $capturedMessages = [];
    $chat = Mockery::mock(OpenAIChat::class);
    $chat->shouldReceive('setSystemMessage')->andReturnNull();
    $chat->shouldReceive('generateChat')->andReturnUsing(function (array $messages) use (&$capturedMessages) {
        $capturedMessages = $messages;

        return 'Ответ из базы знаний.';
    });

    $factory = Mockery::mock(AIClientFactory::class);
    $factory->shouldReceive('createEmbeddingGenerator')->andReturn($embeddingGenerator);
    $factory->shouldReceive('createChatClient')->andReturn($chat);

    $vectorStoreManager = Mockery::mock(VectorStoreManager::class);
    $vectorStoreManager->shouldReceive('getStoreForAssistant')->andReturn($vectorStore);
    $vectorStoreManager->shouldReceive('searchByText')->andReturn([]);
    $vectorStoreManager->shouldReceive('mergeDocuments')->andReturn([]);

    $query = new AskAssistantQuery($factory, $vectorStoreManager);

    $query->execute($assistant, 'Какой у вас график работы?');

    $systemMessages = array_filter(
        $capturedMessages,
        fn (Message $message) => $message->role === ChatRole::System
    );

    expect($systemMessages)->not->toBeEmpty();
    expect(collect($systemMessages)->pluck('content')->all())
        ->toContain('Ты дружелюбный консультант магазина.');
});

test('it uses default fallback if not provided', function () {
    $assistant = new Assistant([
        'style' => AssistantStyle::Business,
    ]);

    $query = new AskAssistantQuery(
        Mockery::mock(AIClientFactory::class),
        Mockery::mock(VectorStoreManager::class)
    );

    $reflection = new ReflectionClass($query);
    $method = $reflection->getMethod('buildSystemMessageTemplate');
    $method->setAccessible(true);

    $template = $method->invoke($query, $assistant);

    expect($template)->toContain('Если ты не знаешь ответа, просто скажи, что не знаешь');
});
