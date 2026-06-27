<?php

use App\Domain\Assistant\Actions\IndexAssistantDocumentsAction;
use App\Domain\Assistant\Models\Assistant;
use App\Domain\Knowledge\Models\Knowledge;
use App\Models\User;
use Mockery\MockInterface;

test('it can process callback data and index it', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    // Мокаем экшн индексации, так как он требует внешних сервисов (Qdrant, AI)
    $this->mock(IndexAssistantDocumentsAction::class, function (MockInterface $mock) {
        $mock->shouldReceive('execute')->once();
    });

    $payload = [
        'assistant_id' => $assistant->id,
        'name' => 'Test API Source',
        'chunks' => [
            [
                'question' => 'Какую пицу делаете',
                'answer' => 'Большую и тонкую',
            ],
        ],
    ];

    $response = $this->postJson('/api/v1/callback', $payload);

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Данные успешно получены и проиндексированы',
            'assistant_id' => $assistant->id,
        ]);

    $this->assertDatabaseHas('knowledge', [
        'assistant_id' => $assistant->id,
        'type' => 'api',
        'name' => 'Test API Source',
        'status' => 'ready',
    ]);
});

test('it validates request data', function () {
    $response = $this->postJson('/api/v1/callback', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['assistant_id', 'name', 'chunks']);
});

test('it can process universal chunks data', function () {
    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $this->mock(IndexAssistantDocumentsAction::class, function (MockInterface $mock) {
        $mock->shouldReceive('execute')->once()->with(
            Mockery::type(Assistant::class),
            Mockery::on(function ($documents) {
                return count($documents) === 2 &&
                    str_contains($documents[0]->content, 'title: iPhone 15') &&
                    str_contains($documents[1]->content, 'service: Delivery');
            }),
            Mockery::any()
        );
    });

    $payload = [
        'assistant_id' => $assistant->id,
        'name' => 'Products API',
        'chunks' => [
            ['title' => 'iPhone 15', 'price' => '999$'],
            ['service' => 'Delivery', 'time' => '24h'],
        ],
    ];

    $response = $this->postJson('/api/v1/callback', $payload);

    $response->assertStatus(200);
    $this->assertDatabaseHas('knowledge', [
        'name' => 'Products API',
        'status' => 'ready',
    ]);

    $knowledge = Knowledge::where('name', 'Products API')->first();
});
