<?php

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Chat\Queries\AskAssistantQuery;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

it('renders the public share-chat page', function () {
    $assistant = Assistant::factory()->create(['user_id' => User::factory()]);

    $this->get(route('share-chat.show', $assistant))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('ShareChat')
            ->where('assistant.id', $assistant->id)
            ->has('initialMessages')
            ->has('csrfToken')
        );
});

it('answers a public message and returns sources as json', function () {
    $assistant = Assistant::factory()->create(['user_id' => User::factory()]);

    $mockQuery = Mockery::mock(AskAssistantQuery::class);
    $mockQuery->shouldReceive('execute')
        ->once()
        ->withArgs(fn ($argAssistant, $argQuestion, $argHistory) => $argAssistant->id === $assistant->id
            && $argQuestion === 'Привет'
            && $argHistory->isEmpty()
        )
        ->andReturn(['answer' => 'Здравствуйте!', 'sources' => []]);

    $this->app->instance(AskAssistantQuery::class, $mockQuery);

    $this->postJson(route('share-chat.message', $assistant), ['question' => 'Привет'])
        ->assertOk()
        ->assertJson([
            'answer' => 'Здравствуйте!',
            'sources' => [],
        ]);
});

it('uses history from cache for public messages', function () {
    $assistant = Assistant::factory()->create(['user_id' => User::factory()]);

    $mockQuery = Mockery::mock(AskAssistantQuery::class);
    $mockQuery->shouldReceive('execute')
        ->twice()
        ->andReturn(['answer' => 'A1', 'sources' => []]);

    $this->app->instance(AskAssistantQuery::class, $mockQuery);

    $this->postJson(route('share-chat.message', $assistant), ['question' => 'Q1'])->assertOk();
    $this->postJson(route('share-chat.message', $assistant), ['question' => 'Q2'])->assertOk();
});

it('validates that a question is required for public messages', function () {
    $assistant = Assistant::factory()->create(['user_id' => User::factory()]);

    $response = $this->postJson(route('share-chat.message', $assistant), []);

    $response->assertStatus(422)
        ->assertJsonPath('errors.question.0', fn ($message) => is_string($message));
});
