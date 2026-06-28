<?php

namespace App\Domain\Billing\Handlers;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Moffhub\Billing\Models\Payment;

class TopUpBalanceHandler
{
    public function handle(User $user, float $amount): void
    {
        DB::transaction(function () use ($user, $amount) {
            $user->balance += $amount;
            $user->save();

            Payment::create([
                'ulid' => (string) Str::ulid(),
                'billable_type' => $user->getMorphClass(),
                'billable_id' => $user->id,
                'amount' => (int) ($amount * 100),
                'currency' => 'RUB',
                'status' => 'completed',
                'payment_method' => 'card',
                'paid_at' => now(),
            ]);
        });
    }
}
