<?php

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Knowledge\Models\Knowledge;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

test('user deletion deletes their assistants and knowledge files', function () {
    Storage::fake('local');

    $user = User::factory()->create();
    $assistant = Assistant::factory()->create(['user_id' => $user->id]);

    $knowledge = Knowledge::factory()->create([
        'assistant_id' => $assistant->id,
        'path' => 'documents/test.pdf',
    ]);

    Storage::disk('local')->put('documents/test.pdf', 'content');

    $this->actingAs($user)
        ->delete('/profile', [
            'password' => 'password',
        ])
        ->assertRedirect('/');

    $this->assertDatabaseMissing('users', ['id' => $user->id]);
    $this->assertDatabaseMissing('assistants', ['id' => $assistant->id]);
    $this->assertDatabaseMissing('knowledge', ['id' => $knowledge->id]);

    Storage::disk('local')->assertMissing('documents/test.pdf');
});
