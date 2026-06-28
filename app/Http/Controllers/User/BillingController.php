<?php

namespace App\Http\Controllers\User;

use App\Domain\Billing\Handlers\SubscribeHandler;
use App\Domain\Billing\Handlers\TopUpBalanceHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\Billing\SubscribeRequest;
use App\Http\Requests\User\Billing\TopUpRequest;
use Exception;
use Illuminate\Http\RedirectResponse;
use Moffhub\Billing\Models\Plan;

class BillingController extends Controller
{
    public function topUp(TopUpRequest $request, TopUpBalanceHandler $handler): RedirectResponse
    {
        $handler->handle($request->user(), $request->amount);

        return back()->with('success', 'Баланс успешно пополнен');
    }

    public function subscribe(SubscribeRequest $request, Plan $plan, SubscribeHandler $handler): RedirectResponse
    {
        try {
            $handler->handle($request->user(), $plan);

            return back()->with('success', "Вы успешно подписались на тариф {$plan->name}");
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
