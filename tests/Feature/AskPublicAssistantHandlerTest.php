<?php

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Chat\Commands\AskPublicAssistantCommand;
use App\Domain\Chat\Handlers\AskPublicAssistantHandler;
use App\Domain\Chat\Queries\AskAssistantQuery;
use App\Models\User;

test('public assistant handler saves chat history to database', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);
    $sessionId = 'test-session-123';

    $mockQuery = Mockery::mock(AskAssistantQuery::class);
    $mockQuery->shouldReceive('execute')
        ->once()
        ->andReturn(['answer' => 'Test answer']);

    $this->app->instance(AskAssistantQuery::class, $mockQuery);

    $handler = app(AskPublicAssistantHandler::class);
    $command = new AskPublicAssistantCommand($assistant, 'Test question', $sessionId);

    $result = $handler->handle($command);

    expect($result['answer'])->toBe('Test answer');

    $this->assertDatabaseHas('chat_histories', [
        'assistant_id' => $assistant->id,
        'user_id'      => null,
        'session_id'   => $sessionId,
        'question'     => 'Test question',
        'answer'       => 'Test answer',
    ]);
});

test('public assistant handler returns answer', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $mockQuery = Mockery::mock(AskAssistantQuery::class);
    $mockQuery->shouldReceive('execute')
        ->once()
        ->andReturn(['answer' => 'Hello!']);

    $this->app->instance(AskAssistantQuery::class, $mockQuery);

    $handler = app(AskPublicAssistantHandler::class);
    $command = new AskPublicAssistantCommand($assistant, 'Hi', 'session-abc');

    $result = $handler->handle($command);

    expect($result)->toHaveKey('answer', 'Hello!');
});
