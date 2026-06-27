<?php

namespace App\Domain\User\Queries;

use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class GetProfileDataQuery
{
    /**
     * @return array{mustVerifyEmail: bool, status: string|null}
     */
    public function execute(User $user): array
    {
        return [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
        ];
    }
}
