<?php

namespace App\Domain\Billing\Handlers;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Moffhub\Billing\Models\Plan;

class SubscribeHandler
{
    /**
     * @throws Exception
     */
    public function handle(User $user, Plan $plan): void
    {
        $price = $plan->base_price / 100;

        if ($user->balance < $price) {
            throw new Exception('Недостаточно средств на балансе');
        }

        DB::transaction(function () use ($user, $plan, $price) {
            $user->balance -= $price;
            $user->save();

            $user->subscribe($plan->slug)->create();
        });
    }
}
