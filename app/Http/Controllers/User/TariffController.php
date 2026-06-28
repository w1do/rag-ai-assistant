<?php

namespace App\Http\Controllers\User;

use App\Domain\Billing\Queries\GetPlansQuery;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Moffhub\Billing\Models\Feature;

class TariffController extends Controller
{
    public function index(GetPlansQuery $query): Response
    {
        return Inertia::render('Tariffs', [
            'plans' => $query->execute(),
            'features' => Feature::all(),
        ]);
    }
}
