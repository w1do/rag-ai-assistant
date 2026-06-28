import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Plus, Trash2, Settings, Phone, Zap } from 'lucide-react';
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
        icon: <Settings className="h-4 w-4" />,
    },
    {
        key: 'contacts',
        label: 'Контакты',
        hint: 'Телефон и соцсети',
        icon: <Phone className="h-4 w-4" />,
    },
    {
        key: 'behavior',
        label: 'Поведение',
        hint: 'Fallback и промпт',
        icon: <Zap className="h-4 w-4" />,
    },
];

const STYLE_LABELS: Record<string, string> = {
    business: 'Деловой',
    commercial: 'Коммерческий',
    rude: 'Грубый',
    positive: 'Позитивный',
};

const fieldClass =
    'mt-1.5 block w-full rounded-2xl border-border-color-one bg-extra-color px-4 py-3 text-sm text-white-color shadow-sm transition-all focus:border-primary-color focus:ring-primary-color placeholder:text-text-secondary/50';

const inputClass = 'mt-1.5 block w-full bg-extra-color border-border-color-one text-white-color rounded-2xl px-4 py-3 text-sm';

const inlineInputClass = 'block w-full bg-extra-color border-border-color-one text-white-color rounded-2xl px-4 py-3 text-sm';

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
                    <h2 className="text-2xl font-bold uppercase tracking-tight text-white-color font-title">
                        Редактирование
                    </h2>
                    <Link href={route('assistants.show', assistant.id)} className="theme-button style-2 !h-[44px]">
                        <span data-text="Назад">Назад</span>
                    </Link>
                </div>
            }
        >
            <Head title={`Редактировать ${assistant.name}`} />

            <div className="py-6">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-4">
                        {/* Превью ассистента */}
                        <div className="rounded-three border border-border-color-one bg-background-one p-5 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-color text-xl font-bold uppercase text-black-color shadow-lg shadow-primary-color/20">
                                    {(data.name || 'A').charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-lg font-bold uppercase tracking-tight text-white-color font-title">
                                        {data.name || 'Без названия'}
                                    </p>
                                    <p className="truncate text-sm text-text-secondary">
                                        {data.description || 'Описание не задано'}
                                    </p>
                                </div>
                                <span className="hidden shrink-0 rounded-full bg-primary-color/10 border border-primary-color/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-color sm:inline">
                                    {STYLE_LABELS[data.style] || data.style}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                            {/* Вертикальные табы */}
                            <nav className="md:col-span-4 lg:col-span-3">
                                <div className="flex gap-2 overflow-x-auto rounded-three border border-border-color-one bg-background-one p-2 shadow-sm md:flex-col md:gap-2">
                                    {TABS.map((tab) => {
                                        const isActive = activeTab === tab.key;
                                        return (
                                            <button
                                                key={tab.key}
                                                type="button"
                                                onClick={() => setActiveTab(tab.key)}
                                                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-300 ${
                                                    isActive
                                                        ? 'bg-primary-color text-black-color font-bold'
                                                        : 'text-white-color hover:bg-extra-color'
                                                }`}
                                            >
                                                <span className={isActive ? 'text-black-color' : 'text-primary-color'}>
                                                    {tab.icon}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block whitespace-nowrap text-[13px] uppercase tracking-wider">
                                                        {tab.label}
                                                    </span>
                                                    <span className={`hidden whitespace-nowrap text-[10px] uppercase opacity-60 md:block ${isActive ? 'text-black-color' : 'text-text-secondary'}`}>
                                                        {tab.hint}
                                                    </span>
                                                </span>
                                                {tabHasError(tab.key) && (
                                                    <span className={`h-2 w-2 shrink-0 rounded-full ${isActive ? 'bg-black-color' : 'bg-red-500 animate-pulse'}`} />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </nav>

                            {/* Контент таба */}
                            <div className="md:col-span-8 lg:col-span-9">
                                <div className="rounded-three border border-border-color-one bg-background-one p-6 shadow-sm">
                                    {activeTab === 'general' && (
                                        <div className="space-y-6">
                                            <div>
                                                <InputLabel htmlFor="name" value="Имя ассистента" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />
                                                <TextInput
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    value={data.name}
                                                    className={inputClass}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.name} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="description" value="Описание / Информация" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    value={data.description || ''}
                                                    className={fieldClass}
                                                    rows={4}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    placeholder="Краткое описание вашей компании для контекста ассистента"
                                                />
                                                <InputError message={errors.description} className="mt-2" />
                                            </div>

                                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                <div>
                                                    <InputLabel htmlFor="style" value="Стиль общения" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />
                                                    <select
                                                        id="style"
                                                        name="style"
                                                        value={data.style}
                                                        className={fieldClass}
                                                        onChange={(e) => setData('style', e.target.value)}
                                                    >
                                                        <option value="business" className="bg-background-one">Деловой</option>
                                                        <option value="commercial" className="bg-background-one">Коммерческий</option>
                                                        <option value="rude" className="bg-background-one">Грубый</option>
                                                        <option value="positive" className="bg-background-one">Позитивный</option>
                                                    </select>
                                                    <InputError message={errors.style} className="mt-2" />
                                                </div>

                                                <div>
                                                    <InputLabel htmlFor="brand_name" value="Имя бренда" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />
                                                    <TextInput
                                                        id="brand_name"
                                                        type="text"
                                                        name="brand_name"
                                                        value={data.brand_name || ''}
                                                        className={inputClass}
                                                        onChange={(e) => setData('brand_name', e.target.value)}
                                                    />
                                                    <InputError message={errors.brand_name} className="mt-2" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'contacts' && (
                                        <div className="space-y-6">
                                            <div>
                                                <InputLabel htmlFor="phone" value="Номер телефона" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />
                                                <TextInput
                                                    id="phone"
                                                    type="text"
                                                    name="phone"
                                                    value={data.phone || ''}
                                                    className={inputClass}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="+7 (___) ___-__-__"
                                                />
                                                <InputError message={errors.phone} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel value="Социальные сети" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />
                                                <div className="mt-2 space-y-4">
                                                    <div className="flex items-center gap-4">
                                                        <span className="w-24 shrink-0 text-[11px] font-bold uppercase tracking-widest text-text-secondary">
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
                                                    <div className="flex items-center gap-4">
                                                        <span className="w-24 shrink-0 text-[11px] font-bold uppercase tracking-widest text-text-secondary">
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
                                                <InputError message={errors.social} className="mt-2" />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'behavior' && (
                                        <div className="space-y-6">
                                            <div>
                                                <InputLabel htmlFor="welcome_message" value="Приветствие" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />
                                                <textarea
                                                    id="welcome_message"
                                                    name="welcome_message"
                                                    value={data.welcome_message || ''}
                                                    className={fieldClass}
                                                    rows={3}
                                                    onChange={(e) => setData('welcome_message', e.target.value)}
                                                    placeholder="Это сообщение будет первым в каждом чате"
                                                />
                                                <p className="mt-2 text-xs text-text-secondary">
                                                    Это сообщение будет служить приветственным в каждом боте.
                                                </p>
                                                <InputError message={errors.welcome_message} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel value="Быстрые ответы (Actions)" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />
                                                <div className="mt-2 space-y-3">
                                                    {(data.actions || []).map((action, index) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <TextInput
                                                                value={action}
                                                                onChange={(e) => {
                                                                    const newActions = [...(data.actions || [])];
                                                                    newActions[index] = e.target.value;
                                                                    setData('actions', newActions);
                                                                }}
                                                                className="flex-grow bg-extra-color border-border-color-one text-white-color rounded-2xl px-4 py-3"
                                                                placeholder="Например: Какое гбо устанавливаете?"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newActions = (data.actions || []).filter((_, i) => i !== index);
                                                                    setData('actions', newActions);
                                                                }}
                                                                className="text-red-500 hover:text-red-400 transition-colors p-2"
                                                            >
                                                                <Trash2 size={20} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('actions', [...(data.actions || []), ''])}
                                                        className="theme-button style-2 !h-[44px] w-full"
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        <span data-text="Добавить кнопку">Добавить кнопку</span>
                                                    </button>
                                                </div>
                                                <InputError message={errors.actions} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="fallback" value="Сообщение Fallback" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />
                                                <textarea
                                                    id="fallback"
                                                    name="fallback"
                                                    value={data.fallback || ''}
                                                    className={fieldClass}
                                                    rows={3}
                                                    onChange={(e) => setData('fallback', e.target.value)}
                                                    placeholder="Что ответить, если ассистент не знает ответа?"
                                                />
                                                <InputError message={errors.fallback} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="system" value="Системный промпт" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />
                                                <textarea
                                                    id="system"
                                                    name="system"
                                                    value={data.system || ''}
                                                    className={fieldClass}
                                                    rows={5}
                                                    onChange={(e) => setData('system', e.target.value)}
                                                    placeholder="Системная инструкция для ассистента."
                                                />
                                                <InputError message={errors.system} className="mt-2" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Панель сохранения */}
                        <div className="sticky bottom-6 flex items-center justify-between gap-6 rounded-three border border-border-color-one bg-background-one/90 px-6 py-4 shadow-xl backdrop-blur-md">
                            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-text-secondary">
                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${
                                        isDirty ? 'bg-amber-400 animate-pulse' : 'bg-primary-color'
                                    }`}
                                />
                                {isDirty ? 'Есть изменения' : 'Сохранено'}
                            </p>
                            <div className="flex items-center gap-4">
                                <Link href={route('assistants.show', assistant.id)} className="text-sm font-bold uppercase tracking-widest text-text-secondary hover:text-white-color transition-colors">
                                    Отмена
                                </Link>
                                <button disabled={processing} className="theme-button style-1 !h-[52px] min-w-[200px]">
                                    <span data-text={processing ? 'Сохранение...' : 'Сохранить'}>
                                        {processing ? 'Сохранение...' : 'Сохранить'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
