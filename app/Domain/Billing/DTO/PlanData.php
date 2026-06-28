<?php

namespace App\Domain\Billing\DTO;

use Spatie\LaravelData\Data;

class PlanData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $slug,
        public int $base_price,
        public string $billing_cycle,
        public int $trial_days,
        public array $limits,
    ) {}
}
