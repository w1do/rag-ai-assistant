<?php

namespace App\Http\Controllers\User;

use App\Domain\Billing\Queries\GetPlansQuery;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Moffhub\Billing\Models\Feature;

class TariffController extends Controller
{
    public function index(Request $request, GetPlansQuery $query): Response
    {
        $user = $request->user();
        $currentPlanSlug = null;

        if ($user) {
            $activeSubscription = $user->subscriptions()->active()->first();
            $currentPlanSlug = $activeSubscription?->plan?->slug;
        }

        return Inertia::render('Tariffs', [
            'plans' => $query->execute(),
            'features' => Feature::all(),
            'currentPlanSlug' => $currentPlanSlug,
        ]);
    }
}
