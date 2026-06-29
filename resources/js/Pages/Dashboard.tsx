import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import StatCardComponent from '@/Components/Dashboard/StatCard';
import SectionHeader from '@/Components/UI/SectionHeader';
import GradientAlert from '@/Components/GradientAlert';
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
    MessageSquare,
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
        avatar?: string;
        background_image?: string;
    }[];
}

interface StatCard {
    label: string;
    value: number;
    icon: LucideIcon;
    href: string;
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
            href: route('assistants.index'),
        },
        {
            label: 'Всего диалогов',
            value: stats.chats_count,
            icon: MessagesSquare,
            href: route('chats.index'),
        },
        {
            label: 'База знаний',
            value: stats.knowledge_count,
            icon: Database,
            href: route('connectors.index'),
        },
    ];

    return (
        <AuthenticatedLayout
        >
            <Head title="Панель управления" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    <Breadcrumbs items={[]} />

                    <GradientAlert />

                    <SectionHeader 
                        title="Статистика" 
                        icon={Bot}
                        href={route('dashboard')}
                        linkText="Обновить"
                        linkIcon={Sparkles}
                        className="!mb-6"
                    />

                    {/* Карточки статистики */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {cards.map((card, index) => (
                            <StatCardComponent
                                key={card.label}
                                label={card.label}
                                value={card.value}
                                icon={card.icon}
                                href={card.href}
                                className={`wow fadeInUp`}
                                data-wow-delay={`${index * 0.1}s`}
                            />
                        ))}
                    </div>

                    {/* Последние ассистенты */}
                    <div className="space-y-6">
                        <SectionHeader 
                            title="Ассистенты" 
                            icon={Sparkles}
                            href={route('assistants.create')}
                            linkText="Добавить нового"
                            linkIcon={Plus}
                        />

                        <div className="bg-background-one border border-border-color-one rounded-three overflow-hidden">
                            {recent_assistants.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-rgb-12 text-primary-color mb-4">
                                    <Bot className="h-8 w-8" strokeWidth={2} />
                                </span>
                                <p className="text-base sm:text-lg font-title text-white-color uppercase">
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
                                            className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-extra-color overflow-hidden"
                                        >
                                            {/* Background Image Overlay */}
                                            {assistant.background_image && (
                                                <div 
                                                    className="absolute inset-0 z-0 opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.08]"
                                                    style={{ 
                                                        backgroundImage: `url(${assistant.background_image})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }}
                                                />
                                            )}

                                            {/* Avatar Watermark Background */}
                                            <div className="absolute -right-4 -top-2 z-0 pointer-events-none opacity-[0.02] transition-opacity duration-500 group-hover:opacity-[0.04]">
                                                {assistant.avatar ? (
                                                    <img 
                                                        src={assistant.avatar} 
                                                        alt="" 
                                                        className="w-24 h-24 object-cover grayscale"
                                                    />
                                                ) : (
                                                    <div className="text-6xl font-bold text-white select-none">
                                                        {assistant.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="relative z-10 flex min-w-0 items-center gap-3 sm:gap-4">
                                                <span className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary-color text-black-color font-bold text-sm sm:text-lg overflow-hidden">
                                                    {assistant.avatar ? (
                                                        <img src={assistant.avatar} alt={assistant.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        assistant.name.charAt(0).toUpperCase()
                                                    )}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-xs sm:text-base font-bold text-white-color uppercase tracking-tight">
                                                        {assistant.name}
                                                    </p>
                                                    <span
                                                        className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] sm:text-xs font-bold uppercase tracking-wider ${badge.className}`}
                                                    >
                                                        <span className={`h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full animate-pulse ${badge.dot}`} />
                                                        {badge.label}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="relative z-10 flex items-center gap-2 sm:justify-end">
                                                <Link
                                                    href={route('assistants.dialogues', assistant.id)}
                                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-primary-rgb-12 text-primary-color hover:bg-primary-color hover:text-black-color transition-all"
                                                    title="Диалоги"
                                                >
                                                    <MessageSquare size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                </Link>
                                                <Link
                                                    href={route('assistants.show', assistant.id)}
                                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white-color transition-all"
                                                    title="Просмотр"
                                                >
                                                    <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                </Link>
                                                <Link
                                                    href={route('assistants.edit', assistant.id)}
                                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white-color transition-all"
                                                    title="Редактировать"
                                                >
                                                    <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Вы уверены, что хотите удалить этого ассистента?')) {
                                                            router.delete(route('assistants.destroy', assistant.id));
                                                        }
                                                    }}
                                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white-color transition-all"
                                                    title="Удалить"
                                                >
                                                    <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
);
}
