<?php

namespace App\Domain\Billing\Handlers;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Moffhub\Billing\Models\Payment;
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
            // Cancel all current active subscriptions if they exist
            $user->subscriptions()->active()->get()->each(function ($subscription) {
                $subscription->cancel(true);
            });

            $user->balance -= $price;
            $user->save();

            $subscription = $user->subscribe($plan->slug)->create();

            Payment::create([
                'ulid' => (string) Str::ulid(),
                'billable_type' => $user->getMorphClass(),
                'billable_id' => $user->id,
                'subscription_id' => $subscription->id,
                'amount' => $plan->base_price,
                'currency' => 'RUB',
                'status' => 'completed',
                'payment_method' => 'manual',
                'paid_at' => now(),
                'metadata' => [
                    'plan_name' => $plan->name,
                ],
            ]);
        });
    }
}
