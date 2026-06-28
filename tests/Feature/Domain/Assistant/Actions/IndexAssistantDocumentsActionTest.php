<?php

use App\Domain\Assistant\Actions\IndexAssistantDocumentsAction;
use App\Domain\Assistant\Models\Assistant;
use App\Domain\Knowledge\Models\Knowledge;
use App\Domain\Shared\AI\Services\DocumentProcessor;
use App\Infrastructure\AI\AIClientFactory;
use App\Infrastructure\AI\VectorStoreManager;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use LLPhant\Embeddings\Document;
use LLPhant\Embeddings\EmbeddingGenerator\EmbeddingGeneratorInterface;
use LLPhant\Embeddings\VectorStores\Qdrant\QdrantVectorStore;

uses(RefreshDatabase::class);

test('it deletes old points before indexing new ones', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);
    $knowledge = Knowledge::factory()->create([
        'assistant_id' => $assistant->id,
    ]);
    $knowledgeId = $knowledge->id;

    // Создаем старый чанк с qdrant_id
    $assistant->chunks()->create([
        'knowledge_id' => $knowledgeId,
        'content' => 'old content',
        'qdrant_id' => 'old-uuid-1',
    ]);

    $doc = new Document;
    $doc->content = 'new content';
    $doc->sourceName = 'test.pdf';
    $doc->sourceType = 'files';

    // Мокаем зависимости
    $embeddingGenerator = mock(EmbeddingGeneratorInterface::class);
    $embeddingGenerator->shouldReceive('embedDocuments')->andReturn([$doc]);

    $aiClientFactory = mock(AIClientFactory::class);
    $aiClientFactory->shouldReceive('createEmbeddingGenerator')->andReturn($embeddingGenerator);

    $vectorStore = mock(QdrantVectorStore::class);
    $vectorStore->shouldReceive('addDocuments')->once();

    $vectorStoreManager = mock(VectorStoreManager::class);
    $vectorStoreManager->shouldReceive('getStoreForAssistant')->andReturn($vectorStore);

    // ПРОВЕРКА: удаление старых точек должно быть вызвано
    $vectorStoreManager->shouldReceive('deletePoints')
        ->once()
        ->with($assistant, ['old-uuid-1']);

    $documentProcessor = new DocumentProcessor;

    $action = new IndexAssistantDocumentsAction(
        $aiClientFactory,
        $vectorStoreManager,
        $documentProcessor
    );

    $action->execute($assistant, [$doc], $knowledgeId);

    // Проверяем, что старый чанк удален из локальной БД
    $this->assertDatabaseMissing('chunks', [
        'content' => 'old content',
    ]);

    // И новый создан
    $this->assertDatabaseHas('chunks', [
        'knowledge_id' => $knowledgeId,
        'content' => 'new content',
    ]);
});
