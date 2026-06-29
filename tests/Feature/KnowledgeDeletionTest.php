<?php

namespace Tests\Feature;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Assistant\Models\Chunk;
use App\Domain\Knowledge\Actions\DeleteKnowledgeAction;
use App\Domain\Knowledge\Models\Knowledge;
use App\Infrastructure\AI\VectorStoreManager;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
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
        $qdrantId1 = (string) Str::uuid();
        $qdrantId2 = (string) Str::uuid();

        Chunk::create([
            'assistant_id' => $assistant->id,
            'knowledge_id' => $knowledge->id,
            'content' => 'Chunk 1',
            'qdrant_id' => $qdrantId1,
        ]);

        Chunk::create([
            'assistant_id' => $assistant->id,
            'knowledge_id' => $knowledge->id,
            'content' => 'Chunk 2',
            'qdrant_id' => $qdrantId2,
        ]);

        $mockVectorStoreManager = Mockery::mock(VectorStoreManager::class);
        $mockVectorStoreManager->shouldReceive('deletePoints')
            ->once()
            ->with(Mockery::on(function ($passedAssistant) use ($assistant) {
                return $passedAssistant->id === $assistant->id;
            }), [$qdrantId1, $qdrantId2]);

        $action = new DeleteKnowledgeAction($mockVectorStoreManager);
        $action->execute($knowledge);

        $this->assertDatabaseMissing('knowledge', ['id' => $knowledge->id]);
        $this->assertDatabaseMissing('chunks', ['knowledge_id' => $knowledge->id]);
    }
}
