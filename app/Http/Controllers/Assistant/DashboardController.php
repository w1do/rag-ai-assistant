<?php

namespace App\Http\Controllers\Assistant;

use App\Domain\Assistant\Queries\GetDashboardStatsQuery;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(GetDashboardStatsQuery $query): Response
    {
        return Inertia::render('Dashboard', $query->execute(auth()->user()));
    }
}
