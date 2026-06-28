import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import {
    Bot,
    MessagesSquare,
    Database,
    ArrowUpRight,
    Plus,
    Sparkles,
    Edit2,
    Trash2,
    Eye,
    type LucideIcon,
} from 'lucide-react';
import { router } from '@inertiajs/react';

interface Props {
    stats: {
        assistants_count: number;
        chats_count: number;
        knowledge_count: number;
    };
    recent_assistants: {
        id: number;
        name: string;
        status: string;
    }[];
}

interface StatCard {
    label: string;
    value: number;
    icon: LucideIcon;
    accent: string;
}

function statusBadge(status: string): { className: string; dot: string; label: string } {
    switch (status) {
        case 'ready':
        case 'active':
            return {
                className: 'bg-primary-rgb-12 text-primary-color border border-primary-color/20',
                dot: 'bg-primary-color',
                label: status === 'ready' ? 'Готов' : 'Активен',
            };
        case 'processing':
        case 'pending':
            return {
                className: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
                dot: 'bg-amber-500',
                label: 'В обработке',
            };
        case 'error':
        case 'failed':
            return {
                className: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
                dot: 'bg-rose-500',
                label: 'Ошибка',
            };
        default:
            return {
                className: 'bg-white/5 text-white/60 border border-white/10',
                dot: 'bg-white/40',
                label: status,
            };
    }
}

export default function Dashboard({ stats, recent_assistants }: Props) {
    const cards: StatCard[] = [
        {
            label: 'Ассистенты',
            value: stats.assistants_count,
            icon: Bot,
            accent: 'bg-primary-rgb-12 text-primary-color',
        },
        {
            label: 'Всего диалогов',
            value: stats.chats_count,
            icon: MessagesSquare,
            accent: 'bg-primary-rgb-12 text-primary-color',
        },
        {
            label: 'База знаний',
            value: stats.knowledge_count,
            icon: Database,
            accent: 'bg-primary-rgb-12 text-primary-color',
        },
    ];

    return (
        <AuthenticatedLayout
        >
            <Head title="Панель управления" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    <Breadcrumbs items={[]} />
                    
                    <div className="section-title">
                        <span className="sub-title before:w-[30px] before:h-[30px] before:bg-primary-color before:rounded-full before:inline-block before:mr-2 flex items-center">
                            BotSync Dashboard
                        </span>
                        <h2 className="text-3xl font-title uppercase">
                            Панель <span>управления</span>
                        </h2>
                    </div>

                    {/* Карточки статистики */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {cards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={card.label}
                                    className="pricing-item group"
                                >
                                    <div className="pricing-top">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-[80px] h-[80px] bg-primary-rgb-12 border border-primary-color rounded-full flex items-center justify-center">
                                                <Icon className="h-10 w-10 text-primary-color" strokeWidth={1.5} />
                                            </div>
                                        </div>
                                        <div className="pricing-top-content">
                                            <h2 className="text-4xl font-title mb-1">{card.value}</h2>
                                            <p className="text-text-secondary uppercase tracking-wider text-sm font-semibold">{card.label}</p>
                                        </div>
                                    </div>
                                    <div className="p-6 text-center">
                                        <Link 
                                            href={route('assistants.index')} 
                                            className="text-primary-color hover:text-white-color transition-colors text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                        >
                                            Подробнее <ArrowUpRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Последние ассистенты */}
                    <div className="bg-background-one border border-border-color-one rounded-three overflow-hidden">
                        <div className="flex items-center justify-between border-b border-border-color-one px-6 py-5 bg-extra-color">
                            <div className="flex items-center gap-3">
                                <Sparkles className="h-5 w-5 text-primary-color" strokeWidth={2} />
                                <h3 className="text-lg font-title uppercase text-white-color">
                                    Последние ассистенты
                                </h3>
                            </div>
                            <Link
                                href={route('assistants.index')}
                                className="text-sm font-bold text-primary-color hover:text-white-color transition-colors uppercase tracking-widest flex items-center gap-1"
                            >
                                Все ассистенты
                                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                            </Link>
                        </div>

                        {recent_assistants.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-rgb-12 text-primary-color mb-4">
                                    <Bot className="h-8 w-8" strokeWidth={2} />
                                </span>
                                <p className="text-lg font-title text-white-color uppercase">
                                    У вас пока нет ассистентов
                                </p>
                                <p className="mt-2 text-text-secondary">
                                    Создайте первого ассистента, чтобы начать работу.
                                </p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-border-color-one">
                                {recent_assistants.map((assistant) => {
                                    const badge = statusBadge(assistant.status);
                                    return (
                                        <li
                                            key={assistant.id}
                                            className="flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-extra-color"
                                        >
                                            <div className="flex min-w-0 items-center gap-4">
                                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-color text-black-color font-bold text-lg">
                                                    {assistant.name.charAt(0).toUpperCase()}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-base font-bold text-white-color uppercase tracking-tight">
                                                        {assistant.name}
                                                    </p>
                                                    <span
                                                        className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${badge.className}`}
                                                    >
                                                        <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${badge.dot}`} />
                                                        {badge.label}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('assistants.show', assistant.id)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary-rgb-12 text-primary-color hover:bg-primary-color hover:text-black-color transition-all"
                                                    title="Просмотр"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <Link
                                                    href={route('assistants.edit', assistant.id)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white-color transition-all"
                                                    title="Редактировать"
                                                >
                                                    <Edit2 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Вы уверены, что хотите удалить этого ассистента?')) {
                                                            router.delete(route('assistants.destroy', assistant.id));
                                                        }
                                                    }}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white-color transition-all"
                                                    title="Удалить"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        {/* Кнопка добавления ассистента */}
                        <div className="border-t border-border-color-one px-6 py-6 bg-extra-color/50">
                            <Link
                                href={route('assistants.create')}
                                className="theme-button style-1 w-full sm:w-auto"
                            >
                                <span data-text="Добавить ассистента">Добавить ассистента</span>
                                <i><Plus size={16} /></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
