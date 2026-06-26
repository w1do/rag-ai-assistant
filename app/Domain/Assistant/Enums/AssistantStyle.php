<?php

namespace App\Domain\Assistant\Enums;

/**
 * Стили общения ассистента.
 */
enum AssistantStyle: string
{
    /** Коммерческий: убедительный, подчеркивает выгоды, призывает к действию */
    case Commercial = 'commercial';

    /** Деловой: профессиональный, сдержанный и конкретный */
    case Business = 'business';

    /** Грубый: краткий, дерзкий, без лишних любезностей */
    case Rude = 'rude';

    /** Позитивный: очень дружелюбный, использует смайлики, заряжает энергией */
    case Positive = 'positive';
}
