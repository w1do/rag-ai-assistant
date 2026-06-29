import { Link } from '@inertiajs/react';
import { Mail, MessageCircle, Zap } from 'lucide-react';

const navLinks = [
    { label: 'Ассистенты', href: 'assistants.index' },
    { label: 'Коннекторы', href: 'connectors.index' },
    { label: 'Тарифы', href: 'tariffs' },
    { label: 'Финансы', href: 'finance' },
    { label: 'Профиль', href: 'profile.edit' },
];

export default function DashboardFooter() {
    return (
        <footer className="relative mt-auto border-t border-border-color-one bg-background-one">
            {/* Decorative gradient line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-color to-transparent opacity-60" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-3">
                    {/* Left: Logo + tagline */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center group w-fit">
                            <div className="w-8 h-8 bg-primary-color rounded flex items-center justify-center mr-2">
                                <div className="w-4 h-4 bg-black rounded-sm transform rotate-45 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-primary-color rounded-full animate-pulse" />
                                </div>
                            </div>
                            <span className="text-xl font-title tracking-tight text-white-color uppercase">
                                Bot<span className="text-primary-color">Sync</span>
                            </span>
                        </Link>
                        <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                            AI-ассистенты нового поколения для автоматизации вашего бизнеса.
                        </p>
                    </div>

                    {/* Center: Navigation */}
                    <div className="flex flex-col gap-3">
                        <p className="text-[10px] font-title uppercase tracking-widest text-text-secondary mb-1">
                            Навигация
                        </p>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={route(link.href)}
                                className="text-sm text-white-color/70 hover:text-primary-color transition-colors duration-200 w-fit"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Support + status */}
                    <div className="flex flex-col gap-4">
                        <p className="text-[10px] font-title uppercase tracking-widest text-text-secondary">
                            Поддержка
                        </p>
                        <div className="flex flex-col gap-3">
                            <a
                                href="https://t.me/botsync_support"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-white-color/70 hover:text-primary-color transition-colors duration-200 w-fit"
                            >
                                <MessageCircle className="h-4 w-4 shrink-0" />
                                Telegram
                            </a>
                            <a
                                href="mailto:support@botsync.ai"
                                className="flex items-center gap-2 text-sm text-white-color/70 hover:text-primary-color transition-colors duration-200 w-fit"
                            >
                                <Mail className="h-4 w-4 shrink-0" />
                                support@botsync.ai
                            </a>
                        </div>

                        {/* System status badge */}
                        <div className="flex items-center gap-2 mt-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                            </span>
                            <span className="text-xs text-green-400 font-medium">Система работает</span>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col items-center justify-between gap-2 border-t border-border-color-one py-5 sm:flex-row">
                    <p className="text-xs text-text-secondary">
                        © {new Date().getFullYear()} BotSync. Все права защищены.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                        <Zap className="h-3 w-3 text-primary-color" />
                        <span>v1.0.0</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
