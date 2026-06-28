import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Check, Rocket, Calendar, Crown, type LucideIcon, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import Tips from '@/Components/Tips';
import FAQ from '@/Components/FAQ';

/**
 * Описание одного тарифа.
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
 */
function formatPrice(value: number): string {
    return `${value.toLocaleString('ru-RU')} ₽`;
}

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

    const tariffTips = [
        'Выбирайте годовой тариф, чтобы сэкономить до 30% стоимости.',
        'Пробный тариф идеально подходит для тестирования базовых функций.',
        'Приоритетная поддержка доступна на ежемесячном и годовом тарифах.',
    ];

    const tariffFaqs = [
        {
            question: "Как происходит оплата?",
            answer: "Оплата производится через защищенный платежный шлюз. Вы можете использовать банковские карты или другие доступные методы оплаты."
        },
        {
            question: "Можно ли сменить тариф позже?",
            answer: "Да, вы можете перейти на более дорогой тариф в любое время. Разница в стоимости будет пересчитана автоматически."
        },
        {
            question: "Предусмотрен ли возврат средств?",
            answer: "Мы предоставляем возврат средств в течение 7 дней, если сервис не подошел вам по техническим причинам."
        },
        {
            question: "Какие методы оплаты поддерживаются?",
            answer: "Мы поддерживаем Visa, MasterCard, МИР, а также оплату через СБП и электронные кошельки."
        }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Тарифы" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <Breadcrumbs items={[{ label: 'Тарифы' }]} />

                    <Tips tips={tariffTips} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        <div className="lg:col-span-2">
                            <div className="mb-12">
                                <h3 className="text-3xl font-title text-white-color mb-4">
                                    Выберите подходящий <span className="text-primary-color">тариф</span>
                                </h3>
                                <p className="text-text-secondary-dark max-w-2xl">
                                    Подключите бота к базе знаний на удобных условиях. Мы предлагаем гибкие планы для любого масштаба бизнеса.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tariffs.map((tariff) => {
                                    const Icon = tariff.icon;
                                    return (
                                        <div key={tariff.name} className="pricing-item group flex flex-col">
                                            <div className="pricing-top">
                                                <div className="flex justify-center mb-6">
                                                    <div className="w-[100px] h-[100px] bg-primary-rgb-12 border border-primary-color rounded-full flex items-center justify-center">
                                                        <Icon className="h-8 w-8 text-primary-color" />
                                                    </div>
                                                </div>
                                                <div className="pricing-top-content">
                                                    <h2 className="text-[38px] font-title text-white-color">{formatPrice(tariff.price)}</h2>
                                                    <p className="text-text-secondary-dark">{tariff.period}</p>
                                                </div>
                                            </div>

                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="mb-4">
                                                    {tariff.highlighted && (
                                                        <div className="mb-4">
                                                            <span className="bg-primary-color text-black-color text-[12px] font-title px-4 py-1 rounded-full uppercase">
                                                                Популярный
                                                            </span>
                                                        </div>
                                                    )}
                                                    <h4 className="text-xl font-title text-white-color mb-2">{tariff.name}</h4>
                                                    <p className="text-sm text-text-secondary-dark leading-relaxed">
                                                        {tariff.description}
                                                    </p>
                                                </div>

                                                <ul className="space-y-3 mb-8 flex-1">
                                                    {tariff.features.map((feature) => (
                                                        <li key={feature} className="flex items-start gap-3 text-sm text-text-secondary-dark">
                                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-color" strokeWidth={3} />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>

                                                <button className={`theme-button w-full ${tariff.highlighted ? 'style-1' : 'style-2'}`}>
                                                    <span data-text="Выбрать тариф">Выбрать тариф</span>
                                                    <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-background-one border border-border-color-one rounded-three p-8 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h4 className="text-xl font-title text-white-color mb-4">Нужен <span className="text-primary-color">Enterprise</span>?</h4>
                                    <p className="text-sm text-text-secondary-dark mb-6 leading-relaxed">
                                        Если вам нужны индивидуальные условия, персональный менеджер и SLA, свяжитесь с нами.
                                    </p>
                                    <button className="theme-button style-2 w-full">
                                        <span data-text="Связаться">Связаться</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <FAQ 
                        items={tariffFaqs} 
                        title={<>Вопросы по <span className="text-primary-color">тарифам</span></>}
                        subtitle="Все, что нужно знать об оплате и использовании сервиса."
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
