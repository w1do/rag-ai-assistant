<?php

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Chat\Models\ChatHistory;
use App\Infrastructure\AI\AIClientFactory;
use App\Models\User;
use LLPhant\Chat\OpenAIChat;
use Mockery\MockInterface;

test('authenticated user can view their assistant dialogues', function () {
    $this->withoutVite();
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);
    ChatHistory::create([
        'assistant_id' => $assistant->id,
        'user_id' => $user->id,
        'question' => 'How are you?',
        'answer' => 'I am fine.',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('assistants.dialogues', $assistant));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Chat/AssistantChat')
        ->has('history', 1)
        ->where('history.0.question', 'How are you?')
    );
});

test('user cannot view others assistant dialogues', function () {
    $this->withoutVite();
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $otherUser->id]);

    $response = $this
        ->actingAs($user)
        ->get(route('assistants.dialogues', $assistant));

    $response->assertForbidden();
});

test('authenticated user can get summary of dialogues', function () {
    $this->withoutVite();
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    ChatHistory::create([
        'assistant_id' => $assistant->id,
        'user_id' => $user->id,
        'question' => 'What is your name?',
        'answer' => 'Bot',
    ]);

    // Mock AI Client
    $mockChatClient = Mockery::mock(OpenAIChat::class);
    $mockChatClient->shouldReceive('generateText')
        ->once()
        ->andReturn('Пользователи интересуются именем ассистента.');

    $this->mock(AIClientFactory::class, function (MockInterface $mock) use ($mockChatClient) {
        $mock->shouldReceive('createChatClient')->andReturn($mockChatClient);
    });

    $response = $this
        ->actingAs($user)
        ->get(route('assistants.dialogues.summary', $assistant));

    $response->assertOk();
    $response->assertJson(['summary' => 'Пользователи интересуются именем ассистента.']);
});
