<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Moffhub\Billing\Models\Feature;
use Moffhub\Billing\Models\Plan;

class BillingSeeder extends Seeder
{
    public function run(): void
    {
        // Features
        $features = [
            [
                'slug' => 'assistants_count',
                'name' => 'Количество ассистентов',
                'type' => 'metered',
            ],
            [
                'slug' => 'messages_count',
                'name' => 'Сообщений в месяц',
                'type' => 'metered',
            ],
            [
                'slug' => 'knowledge_base_size',
                'name' => 'База знаний (МБ)',
                'type' => 'metered',
            ],
            [
                'slug' => 'connectors_access',
                'name' => 'Доступ к коннекторам',
                'type' => 'boolean',
            ],
        ];

        foreach ($features as $feature) {
            Feature::updateOrCreate(['slug' => $feature['slug']], $feature);
        }

        // Plans
        Plan::updateOrCreate(['slug' => 'start'], [
            'ulid' => (string) Str::ulid(),
            'name' => 'Старт',
            'slug' => 'start',
            'base_price' => 10000, // 100.00 RUB
            'billing_cycle' => 'monthly',
            'trial_days' => 7,
            'features' => ['assistants_count', 'messages_count', 'knowledge_base_size'],
            'limits' => [
                'assistants_count' => 1,
                'messages_count' => 1000,
                'knowledge_base_size' => 5,
                'voice_count' => 5,
                'links_count' => 10,
                'document_count' => 0,
            ],
        ]);

        Plan::updateOrCreate(['slug' => 'business'], [
            'ulid' => (string) Str::ulid(),
            'name' => 'Бизнес',
            'slug' => 'business',
            'base_price' => 50000, // 500.00 RUB
            'billing_cycle' => 'monthly',
            'trial_days' => 7,
            'features' => ['assistants_count', 'messages_count', 'knowledge_base_size', 'connectors_access'],
            'limits' => [
                'assistants_count' => 5,
                'messages_count' => 10000,
                'knowledge_base_size' => 50,
                'connectors_access' => true,
                'voice_count' => 50,
                'links_count' => 100,
                'document_count' => 50,
            ],
        ]);

        Plan::updateOrCreate(['slug' => 'pro'], [
            'ulid' => (string) Str::ulid(),
            'name' => 'Про',
            'slug' => 'pro',
            'base_price' => 150000, // 1500.00 RUB
            'billing_cycle' => 'monthly',
            'trial_days' => 0,
            'features' => ['assistants_count', 'messages_count', 'knowledge_base_size', 'connectors_access'],
            'limits' => [
                'assistants_count' => -1, // Unlimited
                'messages_count' => 100000,
                'knowledge_base_size' => 500,
                'connectors_access' => true,
                'voice_count' => -1,
                'links_count' => -1,
                'document_count' => -1,
            ],
        ]);
    }
}
