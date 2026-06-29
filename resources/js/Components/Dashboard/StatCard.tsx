import { Link } from '@inertiajs/react';
import { type LucideIcon, ArrowUpRight } from 'lucide-react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    value: number | string;
    icon: LucideIcon;
    href?: string;
}

export default function StatCard({ label, value, icon: Icon, href, className = '', ...props }: Props) {
    return (
        <div 
            className={`pricing-item group relative overflow-hidden ${className}`}
            {...props}
        >
            {/* Градиентный фон при наведении */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--color-primary-rgb-12),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

            {/* Фоновая иконка */}
            <div className="absolute -right-6 -bottom-6 opacity-[0.03] text-white-color transition-all duration-700 ease-out group-hover:scale-150 group-hover:-translate-x-8 group-hover:-translate-y-8 group-hover:opacity-[0.08] pointer-events-none">
                <Icon size={180} strokeWidth={1} />
            </div>

            <div className="pricing-top relative z-10 bg-transparent border-none">
                <div className="flex justify-center mb-6">
                    <div className="w-[80px] h-[80px] bg-primary-rgb-12 border border-primary-color/30 rounded-full flex items-center justify-center transition-all duration-500 group-hover:border-primary-color group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(223,255,0,0.3)]">
                        <Icon className="h-10 w-10 text-primary-color" strokeWidth={1.5} />
                    </div>
                </div>
                <div className="pricing-top-content">
                    <h2 className="text-3xl sm:text-5xl font-title mb-2 text-white-color group-hover:text-primary-color transition-colors duration-500 tracking-tight">
                        <span className="group-hover:text-gradient">{value}</span>
                    </h2>
                    <p className="text-text-secondary uppercase tracking-[0.2em] text-[10px] sm:text-xs font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                        {label}
                    </p>
                </div>
            </div>

            {href && (
                <div className="p-6 text-center relative z-10">
                    <Link
                        href={href}
                        className="text-primary-color hover:text-white-color transition-colors text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                        Подробнее <ArrowUpRight size={16} />
                    </Link>
                </div>
            )}

            {/* Эффект переливающегося бордера при наведении */}
            <div className="absolute inset-0 border border-transparent group-hover:border-none pointer-events-none rounded-three">
                 <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-three p-[1px] bg-gradient-to-r from-primary-color via-white-color to-primary-color bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
                    <div className="h-full w-full bg-background-one rounded-three-inner"></div>
                 </div>
            </div>
        </div>
    );
}
