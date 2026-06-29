import { Link } from '@inertiajs/react';
import { type LucideIcon } from 'lucide-react';

interface Props {
    title: string;
    icon?: LucideIcon;
    href?: string;
    linkText?: string;
    linkIcon?: LucideIcon;
    className?: string;
}

export default function SectionHeader({
    title,
    icon: Icon,
    href,
    linkText,
    linkIcon: LinkIcon,
    className = ''
}: Props) {
    return (
        <div className={`flex items-center gap-4 sm:gap-6 mb-8 ${className}`}>
            <div className="flex items-center gap-3 shrink-0">
                {Icon && (
                    <div className="w-8 h-8 rounded-lg bg-primary-rgb-12 flex items-center justify-center border border-primary-color/20">
                         <Icon className="h-4 w-4 text-primary-color" strokeWidth={2} />
                    </div>
                )}
                <h3 className="text-sm sm:text-lg font-title uppercase text-white-color tracking-[0.1em]">
                    {title}
                </h3>
            </div>
            
            {/* Декоративная линия */}
            <div className="flex-1 relative h-px flex items-center">
                <div className="w-full h-[1px] bg-border-color-one"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-color/40 via-primary-color/10 to-transparent h-[1px]"></div>
                
                {/* Анимированный блик на линии */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-transparent via-primary-color/30 to-transparent h-[1px] animate-[shimmer_4s_infinite_linear]"></div>
            </div>

            {href && (
                <Link
                    href={href}
                    className="shrink-0 flex items-center gap-2 group/link"
                >
                    <span className="text-[10px] sm:text-xs font-bold text-primary-color group-hover/link:text-white-color transition-colors uppercase tracking-[0.2em]">
                        {linkText}
                    </span>
                    {LinkIcon && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg border border-primary-color/20 flex items-center justify-center text-primary-color group-hover/link:bg-primary-color group-hover/link:text-black-color transition-all duration-300 group-hover/link:scale-110">
                            <LinkIcon size={14} strokeWidth={2.5} />
                        </div>
                    )}
                </Link>
            )}
        </div>
    );
}
