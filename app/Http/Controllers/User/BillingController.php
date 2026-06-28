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
use OpenApi\Attributes as OA;

class BillingController extends Controller
{
    #[OA\Post(
        path: '/billing/top-up',
        summary: 'Пополнение баланса пользователя',
        tags: ['Billing'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/TopUpRequest')
        ),
        responses: [
            new OA\Response(response: 200, description: 'Баланс успешно пополнен'),
            new OA\Response(response: 422, description: 'Ошибка валидации'),
        ]
    )]
    public function topUp(TopUpRequest $request, TopUpBalanceHandler $handler): RedirectResponse
    {
        $handler->handle($request->user(), $request->amount);

        return back()->with('success', 'Баланс успешно пополнен');
    }

    #[OA\Post(
        path: '/billing/subscribe/{plan}',
        summary: 'Подписка на тарифный план',
        tags: ['Billing'],
        parameters: [
            new OA\Parameter(
                name: 'plan',
                in: 'path',
                required: true,
                description: 'Slug тарифного плана',
                schema: new OA\Schema(type: 'string')
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Успешная подписка'),
            new OA\Response(response: 400, description: 'Недостаточно средств или другая ошибка'),
        ]
    )]
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
