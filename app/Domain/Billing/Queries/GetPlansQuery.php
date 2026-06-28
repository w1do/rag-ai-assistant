<?php

namespace App\Domain\Billing\Queries;

use App\Domain\Billing\DTO\PlanData;
use Illuminate\Support\Collection;
use Moffhub\Billing\Models\Plan;

class GetPlansQuery
{
    /**
     * @return Collection<int, PlanData>
     */
    public function execute(): Collection
    {
        return PlanData::collect(Plan::all());
    }
}
