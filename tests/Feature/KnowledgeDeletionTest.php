<?php

namespace Tests\Feature;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Assistant\Models\Chunk;
use App\Domain\Knowledge\Actions\DeleteKnowledgeAction;
use App\Domain\Knowledge\Models\Knowledge;
use App\Infrastructure\AI\VectorStoreManager;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class KnowledgeDeletionTest extends TestCase
{
    use RefreshDatabase;

    public function test_delete_knowledge_action_calls_vector_store_manager_with_correct_ids()
    {
        $user = User::factory()->create();
        $assistant = Assistant::factory()->create(['user_id' => $user->id]);
        $knowledge = Knowledge::factory()->create(['assistant_id' => $assistant->id]);

        // Create some chunks
        Chunk::create([
            'assistant_id' => $assistant->id,
            'knowledge_id' => $knowledge->id,
            'content' => 'Chunk 1',
            'qdrant_id' => 'uuid-1',
        ]);

        Chunk::create([
            'assistant_id' => $assistant->id,
            'knowledge_id' => $knowledge->id,
            'content' => 'Chunk 2',
            'qdrant_id' => 'uuid-2',
        ]);

        $mockVectorStoreManager = Mockery::mock(VectorStoreManager::class);
        $mockVectorStoreManager->shouldReceive('deletePoints')
            ->once()
            ->with(Mockery::on(function ($passedAssistant) use ($assistant) {
                return $passedAssistant->id === $assistant->id;
            }), ['uuid-1', 'uuid-2']);

        $action = new DeleteKnowledgeAction($mockVectorStoreManager);
        $action->execute($knowledge);

        $this->assertDatabaseMissing('knowledge', ['id' => $knowledge->id]);
        $this->assertDatabaseMissing('chunks', ['knowledge_id' => $knowledge->id]);
    }
}
