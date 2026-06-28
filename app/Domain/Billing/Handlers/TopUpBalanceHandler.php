<?php

namespace App\Domain\Billing\Handlers;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class TopUpBalanceHandler
{
    public function handle(User $user, float $amount): void
    {
        DB::transaction(function () use ($user, $amount) {
            $user->balance += $amount;
            $user->save();
        });
    }
}
