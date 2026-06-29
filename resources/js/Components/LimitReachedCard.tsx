import { Link } from '@inertiajs/react';
import { ArrowRight, Zap, Lock } from 'lucide-react';

interface Props {
    title: string;
    description: string;
    buttonText?: string;
    className?: string;
}

/**
 * Компонент для отображения уведомления о достижении лимита.
 * Использует стилистику дизайн-системы: закругления 2px (rounded-three), фон --background-one,
 * акцентная кнопка style-1 и декоративные элементы.
 */
export default function LimitReachedCard({ 
    title, 
    description, 
    buttonText = "Улучшить тариф",
    className = ""
}: Props) {
    return (
        <div className={`pricing-item !mb-0 p-6 sm:p-8 border border-border-color-one bg-background-one rounded-three relative overflow-hidden group transition-all duration-500 hover:border-primary-color/50 ${className}`}>
            {/* Декоративные элементы фона для "красоты" */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary-color/5 rounded-full blur-3xl group-hover:bg-primary-color/10 transition-all duration-700"></div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary-color/5 rounded-full blur-2xl group-hover:bg-primary-color/10 transition-all duration-700"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-primary-color/10 flex items-center justify-center text-primary-color border border-primary-color/20 group-hover:rotate-12 transition-transform duration-500">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-white-color uppercase tracking-tight font-title">
                            {title}
                        </h4>
                    </div>
                    
                    <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
                        {description}
                    </p>
                </div>
                
                <div className="pricing-button-wapper shrink-0 w-full md:w-auto">
                    <Link href={route('tariffs')} className="theme-button style-1 !h-[52px] px-8 w-full md:w-auto">
                        <span data-text={buttonText}>{buttonText}</span>
                        <i><ArrowRight size={18} /></i>
                    </Link>
                </div>
            </div>
            
            {/* Едва заметная иконка замка в углу */}
            <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <Lock size={48} className="text-white-color" />
            </div>
        </div>
    );
}
