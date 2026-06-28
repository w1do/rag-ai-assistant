import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Bot,
    MessagesSquare,
    Database,
    ArrowUpRight,
    Plus,
    Sparkles,
    type LucideIcon,
} from 'lucide-react';

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

/**
 * Описание одной карточки статистики на панели управления.
 *
 * @property label Подпись метрики.
 * @property value Числовое значение метрики.
 * @property icon Иконка lucide для визуального акцента.
 * @property accent Набор tailwind-классов для цветовой темы иконки.
 */
interface StatCard {
    label: string;
    value: number;
    icon: LucideIcon;
    accent: string;
}

/**
 * Возвращает оформление бейджа статуса ассистента.
 *
 * Сопоставляет строковый статус с цветовой схемой бейджа и подписью,
 * чтобы единообразно отображать состояние ассистента в списке.
 *
 * @param status Статус ассистента из данных сервера.
 * @return Объект с CSS-классами, цветом индикатора и читаемой подписью.
 */
function statusBadge(status: string): { className: string; dot: string; label: string } {
    switch (status) {
        case 'ready':
        case 'active':
            return {
                className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
                dot: 'bg-emerald-500',
                label: status === 'ready' ? 'Готов' : 'Активен',
            };
        case 'processing':
        case 'pending':
            return {
                className: 'bg-amber-50 text-amber-700 ring-amber-600/20',
                dot: 'bg-amber-500',
                label: 'В обработке',
            };
        case 'error':
        case 'failed':
            return {
                className: 'bg-rose-50 text-rose-700 ring-rose-600/20',
                dot: 'bg-rose-500',
                label: 'Ошибка',
            };
        default:
            return {
                className: 'bg-gray-100 text-gray-600 ring-gray-500/20',
                dot: 'bg-gray-400',
                label: status,
            };
    }
}

/**
 * Главная страница панели управления.
 *
 * Отображает карточки ключевых метрик (ассистенты, диалоги, база знаний)
 * с иконками lucide и аккуратными бордерами, а также блок последних
 * ассистентов с кнопкой добавления нового ассистента.
 *
 * @param stats Агрегированная статистика аккаунта.
 * @param recent_assistants Список недавно созданных ассистентов.
 */
export default function Dashboard({ stats, recent_assistants }: Props) {
    const cards: StatCard[] = [
        {
            label: 'Ассистенты',
            value: stats.assistants_count,
            icon: Bot,
            accent: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
        },
        {
            label: 'Всего диалогов',
            value: stats.chats_count,
            icon: MessagesSquare,
            accent: 'bg-sky-50 text-sky-600 ring-sky-100',
        },
        {
            label: 'База знаний',
            value: stats.knowledge_count,
            icon: Database,
            accent: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Панель управления
                </h2>
            }
        >
            <Head title="Панель управления" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    {/* Карточки статистики */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {cards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={card.label}
                                    className="group relative overflow-hidden rounded-[20px] border border-gray-200 bg-white p-7 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                                >
                                    {/* Hover Gradient Background (3 colors as per cards.md) */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br from-[#151B27] via-[#C8A645] to-[#0C1019]" />
                                    <div className="relative z-10 flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                {card.label}
                                            </p>
                                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                                                {card.value}
                                            </p>
                                        </div>
                                        <span
                                            className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-inset ${card.accent}`}
                                        >
                                            <Icon className="h-6 w-6" strokeWidth={2} />
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Последние ассистенты */}
                    <div className="overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-md">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-indigo-500" strokeWidth={2} />
                                <h3 className="text-base font-semibold text-gray-900">
                                    Последние ассистенты
                                </h3>
                            </div>
                            <Link
                                href={route('assistants.index')}
                                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800"
                            >
                                Все ассистенты
                                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                            </Link>
                        </div>

                        {recent_assistants.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                                    <Bot className="h-7 w-7" strokeWidth={2} />
                                </span>
                                <p className="mt-4 text-sm font-medium text-gray-900">
                                    У вас пока нет ассистентов
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Создайте первого ассистента, чтобы начать работу.
                                </p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {recent_assistants.map((assistant) => {
                                    const badge = statusBadge(assistant.status);
                                    return (
                                        <li
                                            key={assistant.id}
                                            className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-sm font-semibold text-white">
                                                    {assistant.name.charAt(0).toUpperCase()}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-gray-900">
                                                        {assistant.name}
                                                    </p>
                                                    <span
                                                        className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${badge.className}`}
                                                    >
                                                        <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                                                        {badge.label}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link
                                                href={route('assistants.show', assistant.id)}
                                                className="inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-800"
                                            >
                                                Перейти
                                                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        {/* Кнопка добавления ассистента */}
                        <div className="border-t border-gray-100 px-6 py-4">
                            <Link
                                href={route('assistants.create')}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow sm:w-auto"
                            >
                                <Plus className="h-4 w-4" strokeWidth={2.5} />
                                Добавить ассистента
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
