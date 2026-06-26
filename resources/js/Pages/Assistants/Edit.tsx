import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Plus, Trash2 } from 'lucide-react';
import { FormEventHandler, ReactNode, useState } from 'react';

/**
 * Структура данных ассистента, передаваемая со стороны сервера.
 */
interface Assistant {
    id: number;
    name: string;
    description: string | null;
    style: string;
    brand_name: string | null;
    phone: string | null;
    social: Record<string, string> | null;
    fallback: string | null;
    welcome_message: string | null;
    actions: string[] | null;
    system: string | null;
}

interface Props {
    assistant: Assistant;
}

type TabKey = 'general' | 'contacts' | 'behavior';

/**
 * Описание вкладок формы редактирования.
 * Каждая вкладка снабжена иконкой и кратким описанием для наглядности.
 */
const TABS: { key: TabKey; label: string; hint: string; icon: ReactNode }[] = [
    {
        key: 'general',
        label: 'Основное',
        hint: 'Имя, описание и стиль',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
            </svg>
        ),
    },
    {
        key: 'contacts',
        label: 'Контакты',
        hint: 'Телефон и соцсети',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11 11 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
        ),
    },
    {
        key: 'behavior',
        label: 'Поведение',
        hint: 'Fallback и промпт',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
    },
];

const STYLE_LABELS: Record<string, string> = {
    business: 'Деловой',
    commercial: 'Коммерческий',
    rude: 'Грубый',
    positive: 'Позитивный',
};

const fieldClass =
    'mt-1.5 block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500';

const inputClass = 'mt-1.5 block w-full px-3 py-2 text-sm';

const inlineInputClass = 'block w-full px-3 py-2 text-sm';

const helpClass = 'mt-1.5 text-xs leading-relaxed text-gray-400';

export default function Edit({ assistant }: Props) {
    const [activeTab, setActiveTab] = useState<TabKey>('general');

    const { data, setData, patch, processing, errors, isDirty } = useForm({
        name: assistant.name || '',
        description: assistant.description || '',
        style: assistant.style || 'business',
        brand_name: assistant.brand_name || '',
        phone: assistant.phone || '',
        social: assistant.social || { telegram: '', vk: '' },
        fallback: assistant.fallback || '',
        welcome_message: assistant.welcome_message || '',
        actions: assistant.actions || [],
        system: assistant.system || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('assistants.update', assistant.id));
    };

    const handleSocialChange = (key: string, value: string) => {
        setData('social', {
            ...data.social,
            [key]: value,
        });
    };

    const errorsByTab: Record<TabKey, string[]> = {
        general: ['name', 'description', 'style', 'brand_name'],
        contacts: ['phone', 'social'],
        behavior: ['fallback', 'welcome_message', 'system'],
    };

    const tabHasError = (tab: TabKey) =>
        errorsByTab[tab].some((field) => Boolean((errors as Record<string, string>)[field]));

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold leading-tight text-gray-800">
                        Редактирование ассистента
                    </h2>
                    <Link href={route('assistants.show', assistant.id)}>
                        <SecondaryButton>Назад</SecondaryButton>
                    </Link>
                </div>
            }
        >
            <Head title={`Редактировать ${assistant.name}`} />

            <div className="py-6">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-4">
                        {/* Превью ассистента */}
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-base font-bold uppercase text-white">
                                    {(data.name || 'A').charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-gray-900">
                                        {data.name || 'Без названия'}
                                    </p>
                                    <p className="truncate text-xs text-gray-400">
                                        {data.description || 'Описание не задано'}
                                    </p>
                                </div>
                                <span className="hidden shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 sm:inline">
                                    {STYLE_LABELS[data.style] || data.style}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                            {/* Вертикальные табы */}
                            <nav className="md:col-span-4 lg:col-span-3">
                                <div className="flex gap-1.5 overflow-x-auto rounded-lg border border-gray-200 bg-white p-1.5 shadow-sm md:flex-col md:gap-1">
                                    {TABS.map((tab) => {
                                        const isActive = activeTab === tab.key;
                                        return (
                                            <button
                                                key={tab.key}
                                                type="button"
                                                onClick={() => setActiveTab(tab.key)}
                                                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left transition-colors ${
                                                    isActive
                                                        ? 'bg-indigo-50 text-indigo-700'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <span className={isActive ? 'text-indigo-600' : 'text-gray-400'}>
                                                    {tab.icon}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block whitespace-nowrap text-sm font-medium">
                                                        {tab.label}
                                                    </span>
                                                    <span className="hidden whitespace-nowrap text-xs text-gray-400 md:block">
                                                        {tab.hint}
                                                    </span>
                                                </span>
                                                {tabHasError(tab.key) && (
                                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </nav>

                            {/* Контент таба */}
                            <div className="md:col-span-8 lg:col-span-9">
                                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                                    {activeTab === 'general' && (
                                        <div className="space-y-4">
                                            <div>
                                                <InputLabel htmlFor="name" value="Имя ассистента" />
                                                <TextInput
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    value={data.name}
                                                    className={inputClass}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.name} className="mt-1.5" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="description" value="Описание / Информация о компании" />
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    value={data.description || ''}
                                                    className={fieldClass}
                                                    rows={4}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    placeholder="Краткое описание вашей компании для контекста ассистента"
                                                />
                                                <InputError message={errors.description} className="mt-1.5" />
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div>
                                                    <InputLabel htmlFor="style" value="Стиль общения" />
                                                    <select
                                                        id="style"
                                                        name="style"
                                                        value={data.style}
                                                        className={fieldClass}
                                                        onChange={(e) => setData('style', e.target.value)}
                                                    >
                                                        <option value="business">Деловой</option>
                                                        <option value="commercial">Коммерческий</option>
                                                        <option value="rude">Грубый</option>
                                                        <option value="positive">Позитивный</option>
                                                    </select>
                                                    <InputError message={errors.style} className="mt-1.5" />
                                                </div>

                                                <div>
                                                    <InputLabel htmlFor="brand_name" value="Имя бренда" />
                                                    <TextInput
                                                        id="brand_name"
                                                        type="text"
                                                        name="brand_name"
                                                        value={data.brand_name || ''}
                                                        className={inputClass}
                                                        onChange={(e) => setData('brand_name', e.target.value)}
                                                    />
                                                    <InputError message={errors.brand_name} className="mt-1.5" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'contacts' && (
                                        <div className="space-y-4">
                                            <div>
                                                <InputLabel htmlFor="phone" value="Номер телефона" />
                                                <TextInput
                                                    id="phone"
                                                    type="text"
                                                    name="phone"
                                                    value={data.phone || ''}
                                                    className={inputClass}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="+7 (___) ___-__-__"
                                                />
                                                <InputError message={errors.phone} className="mt-1.5" />
                                            </div>

                                            <div>
                                                <InputLabel value="Социальные сети" />
                                                <div className="mt-1.5 space-y-2.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="w-20 shrink-0 text-xs font-medium text-gray-500">
                                                            Telegram
                                                        </span>
                                                        <TextInput
                                                            type="text"
                                                            value={data.social?.telegram || ''}
                                                            className={inlineInputClass}
                                                            onChange={(e) => handleSocialChange('telegram', e.target.value)}
                                                            placeholder="@username"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="w-20 shrink-0 text-xs font-medium text-gray-500">
                                                            VK
                                                        </span>
                                                        <TextInput
                                                            type="text"
                                                            value={data.social?.vk || ''}
                                                            className={inlineInputClass}
                                                            onChange={(e) => handleSocialChange('vk', e.target.value)}
                                                            placeholder="vk.com/id"
                                                        />
                                                    </div>
                                                </div>
                                                <InputError message={errors.social} className="mt-1.5" />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'behavior' && (
                                        <div className="space-y-4">
                                            <div>
                                                <InputLabel htmlFor="welcome_message" value="Приветственное сообщение" />
                                                <textarea
                                                    id="welcome_message"
                                                    name="welcome_message"
                                                    value={data.welcome_message || ''}
                                                    className={fieldClass}
                                                    rows={3}
                                                    onChange={(e) => setData('welcome_message', e.target.value)}
                                                    placeholder="Это сообщение будет первым в каждом чате"
                                                />
                                                <p className={helpClass}>
                                                    Это сообщение будет служить приветственным в каждом боте.
                                                </p>
                                                <InputError message={errors.welcome_message} className="mt-1.5" />
                                            </div>

                                            <div>
                                                <InputLabel value="Кнопки быстрого ответа (Actions)" />
                                                <div className="mt-2 space-y-2">
                                                    {(data.actions || []).map((action, index) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <TextInput
                                                                value={action}
                                                                onChange={(e) => {
                                                                    const newActions = [...(data.actions || [])];
                                                                    newActions[index] = e.target.value;
                                                                    setData('actions', newActions);
                                                                }}
                                                                className="flex-grow"
                                                                placeholder="Например: Какое гбо устанавливаете?"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newActions = (data.actions || []).filter((_, i) => i !== index);
                                                                    setData('actions', newActions);
                                                                }}
                                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <SecondaryButton
                                                        type="button"
                                                        onClick={() => setData('actions', [...(data.actions || []), ''])}
                                                        className="mt-1"
                                                    >
                                                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                                                        Добавить кнопку
                                                    </SecondaryButton>
                                                </div>
                                                <p className={helpClass}>
                                                    Эти кнопки помогут пользователю быстро задать часто встречающиеся вопросы.
                                                </p>
                                                <InputError message={errors.actions} className="mt-1.5" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="fallback" value="Сообщение при отсутствии ответа (Fallback)" />
                                                <textarea
                                                    id="fallback"
                                                    name="fallback"
                                                    value={data.fallback || ''}
                                                    className={fieldClass}
                                                    rows={3}
                                                    onChange={(e) => setData('fallback', e.target.value)}
                                                    placeholder="Что ответить, если ассистент не знает ответа?"
                                                />
                                                <p className={helpClass}>
                                                    Это сообщение отправится пользователю, если ассистент не найдёт ответ в базе знаний.
                                                </p>
                                                <InputError message={errors.fallback} className="mt-1.5" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="system" value="Системный промпт" />
                                                <textarea
                                                    id="system"
                                                    name="system"
                                                    value={data.system || ''}
                                                    className={fieldClass}
                                                    rows={5}
                                                    onChange={(e) => setData('system', e.target.value)}
                                                    placeholder="Системная инструкция для ассистента. Ассистент отвечает только по базе знаний."
                                                />
                                                <p className={helpClass}>
                                                    Системный промпт задаёт поведение ассистента. Ответы формируются строго по базе знаний (Qdrant).
                                                </p>
                                                <InputError message={errors.system} className="mt-1.5" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Панель сохранения */}
                        <div className="sticky bottom-4 flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
                            <p className="flex items-center gap-2 text-xs text-gray-500">
                                <span
                                    className={`h-2 w-2 rounded-full ${
                                        isDirty ? 'bg-amber-400' : 'bg-green-500'
                                    }`}
                                />
                                {isDirty ? 'Есть несохранённые изменения' : 'Все изменения сохранены'}
                            </p>
                            <div className="flex items-center gap-2.5">
                                <Link href={route('assistants.show', assistant.id)}>
                                    <SecondaryButton type="button">Отмена</SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    Сохранить изменения
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
