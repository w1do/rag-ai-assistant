import { Check, ArrowRight, type LucideIcon } from 'lucide-react';

interface Plan {
    id: number;
    slug: string;
    name: string;
    base_price: number;
    billing_cycle: string;
    trial_days: number;
    limits: Record<string, any>;
}

interface PricingCardProps {
    plan: Plan;
    isHighlighted: boolean;
    isCurrentPlan: boolean;
    icon: LucideIcon;
    onSubscribe: (slug: string) => void;
    formatPrice: (value: number) => string;
    formatLimit: (slug: string, limit: any) => string;
}

export default function PricingCard({
    plan,
    isHighlighted,
    isCurrentPlan,
    icon: Icon,
    onSubscribe,
    formatPrice,
    formatLimit,
}: PricingCardProps) {
    return (
        <>
            <div
                className="flex flex-col rounded-[24px] overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                style={isHighlighted ? {
                    border: '1px dashed rgba(223,255,0,0.7)',
                    background: 'rgba(25,25,25,0.55)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.32)',
                } : {
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(25,25,25,0.45)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    boxShadow: '0 4px 24px 0 rgba(0,0,0,0.22)',
                }}
            >

                {/* Top section */}
                <div
                    className="relative z-10 text-center px-6 pt-8 pb-6"
                    style={{
                        background: isHighlighted
                            ? 'rgba(223,255,0,0.04)'
                            : 'rgba(10,7,8,0.5)',
                        borderBottom: '1px solid rgba(255,255,255,0.07)',
                    }}
                >
                    <div className="flex justify-center mb-5">
                        <div
                            className="w-[100px] h-[100px] rounded-full flex items-center justify-center"
                            style={{
                                background: 'rgba(221,255,0,0.123)',
                                border: '1px solid var(--primary-color)',
                            }}
                        >
                            <Icon className="h-8 w-8 text-primary-color" />
                        </div>
                    </div>
                    <h2 className="text-[38px] font-title text-white-color leading-none">
                        {formatPrice(plan.base_price / 100)}
                    </h2>
                    <p className="text-text-secondary-dark mt-1 text-sm">
                        {plan.billing_cycle === 'monthly' ? 'в месяц' : plan.billing_cycle}
                    </p>
                </div>

                {/* Body */}
                <div className="relative z-10 p-6 flex flex-col flex-1">
                    <div className="mb-5">
                        {isCurrentPlan && (
                            <div className="mb-3">
                                <span className="text-[11px] font-title px-4 py-1 rounded-full uppercase tracking-widest bg-primary-color text-black-color">
                                    Уже выбрано
                                </span>
                            </div>
                        )}
                        <h4 className="text-xl font-title text-white-color mb-1">{plan.name}</h4>
                        <p className="text-sm text-text-secondary-dark">
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
                        onClick={() => onSubscribe(plan.slug)}
                        disabled={isCurrentPlan}
                        className={`theme-button w-full ${
                            isCurrentPlan
                                ? 'opacity-50 cursor-not-allowed'
                                : isHighlighted
                                    ? 'style-1'
                                    : 'style-2'
                        }`}
                    >
                        {isCurrentPlan ? (
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
        </>
    );
}
