import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import SectionHeader from '@/Components/UI/SectionHeader';
import { Rocket, Calendar, Crown, type LucideIcon, ArrowRight, Sparkles, HelpCircle, CreditCard, RefreshCw, ShieldCheck, Wallet, Users, Lock, Zap, LifeBuoy, MessageCircle, ExternalLink } from 'lucide-react';
// LucideIcon used for getIcon return type
import Faq from '@/Components/Faq';
import Breadcrumbs from '@/Components/Breadcrumbs';
import Tips from '@/Components/Tips';
import PricingCard from '@/Components/Tariffs/PricingCard';

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
            answer: "Оплата производится через защищенный платежный шлюз. Вы можете использовать банковские карты или другие доступные методы оплаты.",
            icon: CreditCard,
        },
        {
            question: "Можно ли сменить тариф позже?",
            answer: "Да, вы можете перейти на более дорогой тариф в любое время. Разница в стоимости будет пересчитана автоматически.",
            icon: RefreshCw,
        },
        {
            question: "Предусмотрен ли возврат средств?",
            answer: "Мы предоставляем возврат средств в течение 7 дней, если сервис не подошел вам по техническим причинам.",
            icon: ShieldCheck,
        },
        {
            question: "Какие методы оплаты поддерживаются?",
            answer: "Мы поддерживаем Visa, MasterCard, МИР, а также оплату через СБП и электронные кошельки.",
            icon: Wallet,
        },
        {
            question: "Можно ли использовать один аккаунт для нескольких проектов?",
            answer: "Да, на тарифах Business и Pro вы можете создавать несколько ботов и баз знаний в рамках одного аккаунта.",
            icon: Users,
        },
        {
            question: "Насколько безопасны мои данные?",
            answer: "Все данные хранятся в зашифрованном виде. Мы соблюдаем требования GDPR и не передаём ваши данные третьим лицам.",
            icon: Lock,
        },
        {
            question: "Как быстро активируется тариф после оплаты?",
            answer: "Тариф активируется мгновенно после подтверждения платежа. Вы сразу получаете доступ ко всем функциям выбранного плана.",
            icon: Zap,
        },
        {
            question: "Какая поддержка предусмотрена на каждом тарифе?",
            answer: "На тарифе Start доступна поддержка через чат. Business и Pro включают приоритетную поддержку с гарантированным временем ответа.",
            icon: LifeBuoy,
        },
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

                    <div className="mb-12">
                        <SectionHeader
                            title="Тарифные планы"
                            icon={Crown}
                        />
                        <p className="text-text-secondary-dark max-w-2xl -mt-8">
                            Подключите бота к базе знаний на удобных условиях. Мы предлагаем гибкие планы для любого масштаба бизнеса.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {plans.map((plan, index) => (
                            <PricingCard
                                key={plan.id}
                                plan={plan}
                                isHighlighted={plan.slug === currentPlanSlug}
                                isCurrentPlan={plan.slug === currentPlanSlug}
                                icon={getIcon(plan.slug)}
                                onSubscribe={handleSubscribe}
                                formatPrice={formatPrice}
                                formatLimit={formatLimit}
                            />
                        ))}
                    </div>

                    <div className="mb-12">
                        <SectionHeader
                            title="Индивидуальные решения"
                            icon={Sparkles}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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

                        <div className="bg-background-one border border-border-color-one rounded-three p-8 relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-xl font-title text-white-color mb-4">Возникли <span className="text-primary-color">проблемы</span>?</h4>
                                <p className="text-sm text-text-secondary-dark mb-6 leading-relaxed">
                                    Мы всегда готовы помочь. Посетите наше сообщество или напишите напрямую разработчику.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <a
                                        href="https://vk.com/botsync"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="theme-button style-2 w-full"
                                    >
                                        <span data-text="Группа ВКонтакте">Группа ВКонтакте</span>
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="https://vk.com/id0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="theme-button style-1 w-full"
                                    >
                                        <span data-text="Написать разработчику">Написать разработчику</span>
                                        <MessageCircle className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16">
                        <div className="mb-10">
                            <SectionHeader
                                title="Частые вопросы"
                                icon={HelpCircle}
                            />
                            <p className="text-text-secondary-dark max-w-2xl -mt-8">
                                Ответы на самые популярные вопросы о тарифах, оплате и безопасности.
                            </p>
                        </div>

                        <Faq items={tariffFaqs} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
