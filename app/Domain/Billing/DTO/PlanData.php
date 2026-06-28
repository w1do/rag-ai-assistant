<?php

namespace App\Domain\Billing\DTO;

use Moffhub\Billing\Enums\BillingCycle;
use Spatie\LaravelData\Data;

class PlanData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $slug,
        public int $base_price,
        public BillingCycle $billing_cycle,
        public int $trial_days,
        public array $limits,
    ) {}
}
