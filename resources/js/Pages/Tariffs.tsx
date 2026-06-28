import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Check, Rocket, Calendar, Crown, type LucideIcon, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import Tips from '@/Components/Tips';
import FAQ from '@/Components/FAQ';

/**
 * Форматирует число как стоимость в рублях с разделением разрядов.
 */
function formatPrice(value: number): string {
    return `${value.toLocaleString('ru-RU')} ₽`;
}

interface Props {
    plans: any[];
    features: any[];
    currentPlanSlug: string | null;
}

export default function Tariffs({ plans, features, currentPlanSlug }: Props) {
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

    const getIcon = (slug: string) => {
        switch (slug) {
            case 'start': return Rocket;
            case 'business': return Calendar;
            case 'pro': return Crown;
            default: return Rocket;
        }
    };

    const getFeatureName = (slug: string) => {
        const feature = features.find(f => f.slug === slug);
        return feature ? feature.name : slug;
    };

    const formatLimit = (slug: string, limit: any) => {
        const name = getFeatureName(slug);
        if (limit === -1) return `${name}: Безлимитно`;
        if (typeof limit === 'boolean') return limit ? name : `Нет ${name}`;
        return `${name}: ${limit}`;
    };

    const handleSubscribe = (planSlug: string) => {
        const message = currentPlanSlug
            ? 'Вы точно хотите сменить текущий тарифный план?'
            : 'Вы точно хотите выбрать этот тарифный план?';

        if (confirm(message)) {
            router.post(route('billing.subscribe', planSlug));
        }
    };

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
                                {plans.map((plan) => {
                                    const Icon = getIcon(plan.slug);
                                    const highlighted = plan.slug === 'business';
                                    return (
                                        <div key={plan.id} className="pricing-item group flex flex-col">
                                            <div className="pricing-top">
                                                <div className="flex justify-center mb-6">
                                                    <div className="w-[100px] h-[100px] bg-primary-rgb-12 border border-primary-color rounded-full flex items-center justify-center">
                                                        <Icon className="h-8 w-8 text-primary-color" />
                                                    </div>
                                                </div>
                                                <div className="pricing-top-content">
                                                    <h2 className="text-[38px] font-title text-white-color">{formatPrice(plan.base_price / 100)}</h2>
                                                    <p className="text-text-secondary-dark">
                                                        {plan.billing_cycle === 'monthly' ? 'в месяц' : plan.billing_cycle}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="mb-4">
                                                    {highlighted && (
                                                        <div className="mb-4">
                                                            <span className="bg-primary-color text-black-color text-[12px] font-title px-4 py-1 rounded-full uppercase">
                                                                Популярный
                                                            </span>
                                                        </div>
                                                    )}
                                                    <h4 className="text-xl font-title text-white-color mb-2">{plan.name}</h4>
                                                    <p className="text-sm text-text-secondary-dark leading-relaxed">
                                                        {plan.trial_days > 0 ? `Пробный период: ${plan.trial_days} дней` : 'Мгновенный доступ'}
                                                    </p>
                                                </div>

                                                <ul className="space-y-3 mb-8 flex-1">
                                                    {Object.entries(plan.limits || {}).map(([slug, limit]) => (
                                                        <li key={slug} className="flex items-start gap-3 text-sm text-text-secondary-dark">
                                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-color" strokeWidth={3} />
                                                            {formatLimit(slug, limit)}
                                                        </li>
                                                    ))}
                                                </ul>

                                                <button 
                                                    onClick={() => handleSubscribe(plan.slug)}
                                                    disabled={plan.slug === currentPlanSlug}
                                                    className={`theme-button w-full ${plan.slug === currentPlanSlug ? 'opacity-50 cursor-not-allowed' : (highlighted ? 'style-1' : 'style-2')}`}
                                                >
                                                    {plan.slug === currentPlanSlug ? (
                                                        <>
                                                            <span data-text="Уже выбрано">Уже выбрано</span>
                                                            <Check className="w-5 h-5" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span data-text="Выбрать тариф">Выбрать тариф</span>
                                                            <ArrowRight className="w-5 h-5" />
                                                        </>
                                                    )}
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
