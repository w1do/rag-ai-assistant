<?php

namespace Tests\Feature;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Chat\Models\ChatHistory;
use App\Domain\Chat\Queries\AskAssistantQuery;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Mockery;
use Tests\TestCase;

class ChatHistoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_ask_assistant_action_fetches_last_5_history_records()
    {
        $this->withoutVite();
        $user = User::factory()->create();
        $assistant = Assistant::factory()->create(['user_id' => $user->id]);

        // Create 7 history records (we should only take last 5)
        for ($i = 1; $i <= 7; $i++) {
            Carbon::setTestNow(now()->addMinutes(1));
            ChatHistory::create([
                'assistant_id' => $assistant->id,
                'user_id' => $user->id,
                'question' => "Question $i",
                'answer' => "Answer $i",
            ]);
        }

        $mockQuery = Mockery::mock(AskAssistantQuery::class);
        $mockQuery->shouldReceive('execute')
            ->once()
            ->withArgs(function ($argAssistant, $argQuestion, $argHistory) use ($assistant) {
                // Verify that we only got 5 records and they are the LATEST ones (3 to 7)
                // and in CHRONOLOGICAL order (reversed from latest)
                return $argAssistant->id === $assistant->id &&
                       $argQuestion === 'Current Question' &&
                       $argHistory->count() === 5 &&
                       $argHistory->first()->question === 'Question 3' &&
                       $argHistory->last()->question === 'Question 7';
            })
            ->andReturn([
                'answer' => 'Mock Answer',
                'sources' => [],
            ]);

        $this->app->instance(AskAssistantQuery::class, $mockQuery);

        $response = $this->actingAs($user)
            ->post(route('assistants.chat.store', $assistant), [
                'question' => 'Current Question',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('chat_histories', [
            'question' => 'Current Question',
            'answer' => 'Mock Answer',
        ]);
    }

    public function test_ask_assistant_action_works_with_empty_history()
    {
        $this->withoutVite();
        $user = User::factory()->create();
        $assistant = Assistant::factory()->create(['user_id' => $user->id]);

        $mockQuery = Mockery::mock(AskAssistantQuery::class);
        $mockQuery->shouldReceive('execute')
            ->once()
            ->withArgs(function ($argAssistant, $argQuestion, $argHistory) use ($assistant) {
                return $argAssistant->id === $assistant->id &&
                       $argQuestion === 'Current Question' &&
                       $argHistory->isEmpty();
            })
            ->andReturn([
                'answer' => 'Mock Answer',
                'sources' => [],
            ]);

        $this->app->instance(AskAssistantQuery::class, $mockQuery);

        $response = $this->actingAs($user)
            ->post(route('assistants.chat.store', $assistant), [
                'question' => 'Current Question',
            ]);

        $response->assertRedirect();
    }
}
