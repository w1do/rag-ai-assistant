import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Check, Rocket, Calendar, Crown, type LucideIcon } from 'lucide-react';

/**
 * Описание одного тарифа.
 *
 * @property name Название тарифа.
 * @property price Стоимость в рублях (число).
 * @property period Период оплаты (например, «в день», «в месяц», «в год»).
 * @property description Краткое описание тарифа.
 * @property features Список преимуществ тарифа.
 * @property icon Иконка lucide для визуального акцента.
 * @property highlighted Признак выделенного (рекомендуемого) тарифа.
 */
interface Tariff {
    name: string;
    price: number;
    period: string;
    description: string;
    features: string[];
    icon: LucideIcon;
    highlighted: boolean;
}

/**
 * Форматирует число как стоимость в рублях с разделением разрядов.
 *
 * @param value Числовое значение стоимости.
 * @return Строка вида «1 950 ₽».
 */
function formatPrice(value: number): string {
    return `${value.toLocaleString('ru-RU')} ₽`;
}

/**
 * Страница тарифов.
 *
 * Отображает три доступных тарифа: пробный на 1 день, ежемесячный и годовой.
 * Каждый тариф представлен карточкой со стоимостью, описанием и преимуществами.
 */
export default function Tariffs() {
    const tariffs: Tariff[] = [
        {
            name: 'Пробный',
            price: 50,
            period: 'за 1 день',
            description: 'Попробуйте бота на один день.',
            features: [
                'Доступ к боту на 1 день',
                'Подключение к базе знаний',
                'Базовая поддержка',
            ],
            icon: Rocket,
            highlighted: false,
        },
        {
            name: 'Ежемесячный',
            price: 1950,
            period: 'в месяц',
            description: 'Оптимальный выбор для постоянной работы.',
            features: [
                'Безлимитная работа бота',
                'Подключение к базе знаний',
                'Приоритетная поддержка',
                'Регулярные обновления',
            ],
            icon: Calendar,
            highlighted: true,
        },
        {
            name: 'Годовой',
            price: 22000,
            period: 'в год',
            description: 'Максимальная выгода при оплате на год.',
            features: [
                'Безлимитная работа бота',
                'Подключение к базе знаний',
                'Премиум поддержка',
                'Экономия по сравнению с помесячной оплатой',
            ],
            icon: Crown,
            highlighted: false,
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Тарифы
                </h2>
            }
        >
            <Head title="Тарифы" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                            Выберите подходящий тариф
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Подключите бота к базе знаний на удобных условиях.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {tariffs.map((tariff) => {
                            const Icon = tariff.icon;
                            return (
                                <div
                                    key={tariff.name}
                                    className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                                        tariff.highlighted
                                            ? 'border-indigo-500 ring-1 ring-indigo-500'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {tariff.highlighted && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                                            Популярный
                                        </span>
                                    )}

                                    <span
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-inset ${
                                            tariff.highlighted
                                                ? 'bg-indigo-50 text-indigo-600 ring-indigo-100'
                                                : 'bg-gray-50 text-gray-600 ring-gray-100'
                                        }`}
                                    >
                                        <Icon className="h-6 w-6" strokeWidth={2} />
                                    </span>

                                    <h4 className="mt-4 text-base font-semibold text-gray-900">
                                        {tariff.name}
                                    </h4>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {tariff.description}
                                    </p>

                                    <div className="mt-4 flex items-baseline gap-1">
                                        <span className="text-3xl font-bold tracking-tight text-gray-900">
                                            {formatPrice(tariff.price)}
                                        </span>
                                        <span className="text-sm font-medium text-gray-500">
                                            {tariff.period}
                                        </span>
                                    </div>

                                    <ul className="mt-6 space-y-3">
                                        {tariff.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-start gap-2 text-sm text-gray-600"
                                            >
                                                <Check
                                                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                                                    strokeWidth={2.5}
                                                />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        type="button"
                                        className={`mt-8 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                                            tariff.highlighted
                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                : 'border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                                        }`}
                                    >
                                        Выбрать тариф
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
