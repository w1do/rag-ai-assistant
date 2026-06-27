<?php

namespace App\Http\Controllers\User;

use App\Domain\User\Commands\DeleteUserCommand;
use App\Domain\User\Commands\UpdateProfileCommand;
use App\Domain\User\DTO\ProfileUpdateDTO;
use App\Domain\User\Handlers\DeleteUserHandler;
use App\Domain\User\Handlers\UpdateProfileHandler;
use App\Domain\User\Queries\GetProfileDataQuery;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Отображает страницу редактирования профиля.
     *
     * @OA\Get(
     *     path="/profile",
     *     summary="Редактирование профиля",
     *     tags={"Profile"},
     *
     *     @OA\Response(response=200, description="Успешный ответ")
     * )
     */
    public function edit(Request $request, GetProfileDataQuery $query): Response
    {
        /** @var User $user */
        $user = $request->user();

        return Inertia::render('Profile/Edit', $query->execute($user));
    }

    /**
     * Обновляет информацию профиля.
     *
     * @OA\Patch(
     *     path="/profile",
     *     summary="Обновление профиля",
     *     tags={"Profile"},
     *
     *     @OA\RequestBody(ref="#/components/schemas/ProfileUpdateRequest"),
     *
     *     @OA\Response(response=302, description="Перенаправление обратно")
     * )
     */
    public function update(ProfileUpdateRequest $request, UpdateProfileHandler $handler): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $handler->handle(new UpdateProfileCommand(
            $user,
            ProfileUpdateDTO::fromArray($request->validated())
        ));

        return Redirect::route('profile.edit');
    }

    /**
     * Удаляет аккаунт пользователя.
     *
     * @OA\Delete(
     *     path="/profile",
     *     summary="Удаление аккаунта",
     *     tags={"Profile"},
     *
     *     @OA\RequestBody(
     *
     *         @OA\JsonContent(
     *             required={"password"},
     *
     *             @OA\Property(property="password", type="string", format="password")
     *         )
     *     ),
     *
     *     @OA\Response(response=302, description="Перенаправление на главную")
     * )
     */
    public function destroy(Request $request, DeleteUserHandler $handler): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        /** @var User $user */
        $user = $request->user();

        Auth::logout();

        $handler->handle(new DeleteUserCommand($user));

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
