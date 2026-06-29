import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Select from '@/Components/Select';
import InputHint from '@/Components/InputHint';
import Breadcrumbs from '@/Components/Breadcrumbs';
import SectionHeader from '@/Components/UI/SectionHeader';
import { Plus, Trash2, Settings, Phone, Zap, ArrowRight, LifeBuoy, Image as ImageIcon, Pencil, Sparkles } from 'lucide-react';
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
    avatar: string | null;
    background_image: string | null;
}

interface Props {
    assistant: Assistant;
}

type TabKey = 'general' | 'contacts' | 'behavior' | 'appearance';

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
        key: 'appearance',
        label: 'Фото и стиль',
        hint: 'Аватар и фон бота',
        icon: <ImageIcon className="h-4 w-4" />,
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
    'block w-full rounded-[2px] border-border-color-one bg-extra-color px-4 py-3 text-sm text-white-color shadow-sm transition-all focus:border-primary-color focus:ring-primary-color placeholder:text-text-secondary/50';

/**
 * Карточка-секция формы с заголовком и описанием.
 *
 * Группирует логически связанные поля и задаёт единые отступы между ними.
 *
 * @param title Заголовок секции.
 * @param description Краткое пояснение к секции.
 * @param children Поля ввода, относящиеся к секции.
 */
function FormSection({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section className="bg-background-one border border-border-color-one rounded-three p-5 sm:p-8 shadow-sm transition-all duration-500 hover:border-primary-color/30">
            <div className="mb-6">
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-white-color font-title">{title}</h3>
                {description && (
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
                )}
            </div>
            <div className="space-y-6">{children}</div>
        </section>
    );
}

const inputClass = 'mt-1.5 block w-full bg-extra-color border-border-color-one text-white-color rounded-[2px] px-4 py-3 text-sm';

const inlineInputClass = 'block w-full bg-extra-color border-border-color-one text-white-color rounded-[2px] px-4 py-3 text-sm';

const helpClass = 'mt-1.5 text-xs leading-relaxed text-gray-400';

export default function Edit({ assistant }: Props) {
    const [activeTab, setActiveTab] = useState<TabKey>('general');

    const { data, setData, post, processing, errors, isDirty } = useForm({
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
        avatar: null as File | null,
        background_image: null as File | null,
        _method: 'PATCH',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('assistants.update', assistant.id), {
            forceFormData: true,
        });
    };

    const handleSocialChange = (key: string, value: string) => {
        setData('social', {
            ...data.social,
            [key]: value,
        });
    };

    const errorsByTab: Record<TabKey, string[]> = {
        general: ['name', 'description', 'style', 'brand_name'],
        appearance: ['avatar', 'background_image'],
        contacts: ['phone', 'social'],
        behavior: ['fallback', 'welcome_message', 'system', 'actions'],
    };

    const tabHasError = (tab: TabKey) =>
        errorsByTab[tab].some((field) => Boolean((errors as Record<string, string>)[field]));

    return (
        <AuthenticatedLayout
        >
            <Head title={`Редактировать ${assistant.name}`} />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <Breadcrumbs items={[
                        { label: 'Ассистенты', href: route('assistants.index') },
                        { label: assistant.name, href: route('assistants.show', assistant.id) },
                        { label: 'Редактирование' }
                    ]} />

                    <SectionHeader 
                        title="Редактирование" 
                        icon={Pencil}
                        href={route('assistants.show', assistant.id)}
                        linkText="Назад"
                        linkIcon={ArrowRight}
                        className="!mb-10"
                    />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        {/* Форма и Табы */}
                        <div className="lg:col-span-3">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Превью ассистента */}
                                <div className="rounded-three border border-border-color-one bg-background-one p-5 shadow-sm relative overflow-hidden">
                                    {/* Фоновое изображение (превью) */}
                                    {(data.background_image || assistant.background_image) && (
                                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                                            <img 
                                                src={data.background_image ? URL.createObjectURL(data.background_image) : assistant.background_image} 
                                                alt="" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[2px] bg-primary-color text-xl font-bold uppercase text-black-color shadow-lg shadow-primary-color/20 overflow-hidden">
                                            {data.avatar ? (
                                                <img src={URL.createObjectURL(data.avatar)} alt="" className="w-full h-full object-cover" />
                                            ) : assistant.avatar ? (
                                                <img src={assistant.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                (data.name || 'A').charAt(0)
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-lg font-bold uppercase tracking-tight text-white-color font-title">
                                                {data.name || 'Без названия'}
                                            </p>
                                            <p className="truncate text-sm text-text-secondary">
                                                {data.description || 'Описание не задано'}
                                            </p>
                                        </div>
                                        <span className="hidden shrink-0 rounded-[2px] bg-primary-color/10 border border-primary-color/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-color sm:inline">
                                            {STYLE_LABELS[data.style] || data.style}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
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
                                                        className={`flex w-full items-center gap-3 rounded-[2px] px-4 py-3 text-left transition-all duration-300 ${
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
                                                            <span className={`h-2 w-2 shrink-0 rounded-[1px] ${isActive ? 'bg-black-color' : 'bg-red-500 animate-pulse'}`} />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </nav>

                                    {/* Контент таба */}
                                    <div className="md:col-span-8 lg:col-span-9">
                                        {activeTab === 'general' && (
                                            <div className="space-y-6">
                                                <FormSection
                                                    title="Основная информация"
                                                    description="Имя ассистента и информация о компании."
                                                >
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
                                                        <InputHint message="Название ассистента." />
                                                        <InputError message={errors.name} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <InputLabel htmlFor="description" value="Описание / Информация" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />
                                                        <textarea
                                                            id="description"
                                                            name="description"
                                                            value={data.description || ''}
                                                            className={`mt-1.5 ${fieldClass}`}
                                                            rows={4}
                                                            onChange={(e) => setData('description', e.target.value)}
                                                            placeholder="Краткое описание вашей компании для контекста ассистента"
                                                        />
                                                        <InputHint message="Контекстная информация для ИИ." />
                                                        <InputError message={errors.description} className="mt-2" />
                                                    </div>
                                                </FormSection>

                                                <FormSection
                                                    title="Стиль и бренд"
                                                    description="Настройки тона общения и идентификации бренда."
                                                >
                                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                        <div>
                                                            <InputLabel htmlFor="style" value="Стиль общения" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />
                                                            <Select
                                                                id="style"
                                                                name="style"
                                                                value={data.style}
                                                                onChange={(e) => setData('style', e.target.value)}
                                                            >
                                                                <option value="business" className="bg-background-one">Деловой</option>
                                                                <option value="commercial" className="bg-background-one">Коммерческий</option>
                                                                <option value="rude" className="bg-background-one">Грубый</option>
                                                                <option value="positive" className="bg-background-one">Позитивный</option>
                                                            </Select>
                                                            <InputHint message="Тональность ответов." />
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
                                                            <InputHint message="Название вашей компании или продукта." />
                                                            <InputError message={errors.brand_name} className="mt-2" />
                                                        </div>
                                                    </div>
                                                </FormSection>
                                            </div>
                                        )}

                                        {activeTab === 'appearance' && (
                                            <div className="space-y-6">
                                                <FormSection
                                                    title="Фото и стиль"
                                                    description="Настройте внешний вид вашего ассистента."
                                                >
                                                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                                        {/* Аватар */}
                                                        <div>
                                                            <InputLabel value="Аватар ассистента" className="text-xs text-text-secondary uppercase tracking-widest mb-4" />
                                                            <div className="flex flex-col items-center gap-4">
                                                                <div className="relative group">
                                                                    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-border-color-one bg-extra-color flex items-center justify-center overflow-hidden">
                                                                        {data.avatar ? (
                                                                            <img src={URL.createObjectURL(data.avatar)} alt="Preview" className="w-full h-full object-cover" />
                                                                        ) : assistant.avatar ? (
                                                                            <img src={assistant.avatar} alt="Current" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <ImageIcon className="w-12 h-12 text-text-secondary" />
                                                                        )}
                                                                    </div>
                                                                    <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                                                                        <span className="text-white text-xs font-bold uppercase">Изменить</span>
                                                                    </label>
                                                                    <input
                                                                        id="avatar-upload"
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => setData('avatar', e.target.files?.[0] || null)}
                                                                    />
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="text-[10px] text-text-secondary uppercase tracking-widest">JPG, PNG до 2MB</p>
                                                                    <InputError message={errors.avatar} className="mt-2" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Фон */}
                                                        <div>
                                                            <InputLabel value="Фоновое изображение" className="text-xs text-text-secondary uppercase tracking-widest mb-4" />
                                                            <div className="flex flex-col items-center gap-4">
                                                                <div className="relative group w-full">
                                                                    <div className="w-full h-32 rounded-2xl border-2 border-dashed border-border-color-one bg-extra-color flex items-center justify-center overflow-hidden">
                                                                        {data.background_image ? (
                                                                            <img src={URL.createObjectURL(data.background_image)} alt="Preview" className="w-full h-full object-cover" />
                                                                        ) : assistant.background_image ? (
                                                                            <img src={assistant.background_image} alt="Current" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <ImageIcon className="w-12 h-12 text-text-secondary" />
                                                                        )}
                                                                    </div>
                                                                    <label htmlFor="bg-upload" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                                                                        <span className="text-white text-xs font-bold uppercase">Изменить</span>
                                                                    </label>
                                                                    <input
                                                                        id="bg-upload"
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => setData('background_image', e.target.files?.[0] || null)}
                                                                    />
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="text-[10px] text-text-secondary uppercase tracking-widest">JPG, PNG до 5MB</p>
                                                                    <InputError message={errors.background_image} className="mt-2" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </FormSection>
                                            </div>
                                        )}

                                        {activeTab === 'contacts' && (
                                            <div className="space-y-6">
                                                <FormSection
                                                    title="Контакты"
                                                    description="Данные для связи, которые может использовать ассистент."
                                                >
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
                                                        <InputHint message="Контактный номер для связи." />
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
                                                                <InputHint message="@username вашего аккаунта." />
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
                                                                <InputHint message="Ссылка на страницу или сообщество." />
                                                            </div>
                                                        </div>
                                                        <InputError message={errors.social} className="mt-2" />
                                                    </div>
                                                </FormSection>
                                            </div>
                                        )}

                                        {activeTab === 'behavior' && (
                                            <div className="space-y-6">
                                                <FormSection
                                                    title="Поведение"
                                                    description="Настройки приветствия и логики ответов."
                                                >
                                                    <div>
                                                        <InputLabel htmlFor="welcome_message" value="Приветствие" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />
                                                        <textarea
                                                            id="welcome_message"
                                                            name="welcome_message"
                                                            value={data.welcome_message || ''}
                                                            className={`mt-1.5 ${fieldClass}`}
                                                            rows={3}
                                                            onChange={(e) => setData('welcome_message', e.target.value)}
                                                            placeholder="Это сообщение будет первым в каждом чате"
                                                        />
                                                        <InputHint message="Текст приветствия в начале чата." />
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
                                                                        className="flex-grow bg-extra-color border-border-color-one text-white-color rounded-[2px] px-4 py-3"
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
                                                        <InputHint message="Кнопки с готовыми вопросами." />
                                                        <InputError message={errors.actions} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <InputLabel htmlFor="fallback" value="Сообщение Fallback" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />
                                                        <textarea
                                                            id="fallback"
                                                            name="fallback"
                                                            value={data.fallback || ''}
                                                            className={`mt-1.5 ${fieldClass}`}
                                                            rows={3}
                                                            onChange={(e) => setData('fallback', e.target.value)}
                                                            placeholder="Что ответить, если ассистент не знает ответа?"
                                                        />
                                                        <InputHint message="Ответ при неопределенности." />
                                                        <InputError message={errors.fallback} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <InputLabel htmlFor="system" value="Системный промпт" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />
                                                        <textarea
                                                            id="system"
                                                            name="system"
                                                            value={data.system || ''}
                                                            className={`mt-1.5 ${fieldClass}`}
                                                            rows={5}
                                                            onChange={(e) => setData('system', e.target.value)}
                                                            placeholder="Системная инструкция для ассистента."
                                                        />
                                                        <InputHint message="Глобальные правила поведения ассистента." />
                                                        <InputError message={errors.system} className="mt-2" />
                                                    </div>
                                                </FormSection>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Панель сохранения */}
                                <div className="sticky bottom-6 flex items-center justify-between gap-4 rounded-three border border-border-color-one bg-background-one/90 px-4 sm:px-6 py-3 sm:py-4 shadow-xl backdrop-blur-md z-10">
                                    <p className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-text-secondary">
                                        <span
                                            className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-[1px] ${
                                                isDirty ? 'bg-amber-400 animate-pulse' : 'bg-primary-color'
                                            }`}
                                        />
                                        <span className="hidden xs:inline">{isDirty ? 'Есть изменения' : 'Сохранено'}</span>
                                        <span className="xs:hidden">{isDirty ? 'Изм.' : 'Ок'}</span>
                                    </p>
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <Link href={route('assistants.show', assistant.id)} className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-text-secondary hover:text-white-color transition-colors">
                                            Отмена
                                        </Link>
                                        <button disabled={processing} className="theme-button style-1 !h-[44px] sm:!h-[52px] min-w-[120px] sm:min-w-[200px] text-[10px] sm:text-sm">
                                            <span data-text={processing ? 'Сохранение...' : 'Сохранить'}>
                                                {processing ? 'Сохранение...' : 'Сохранить'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Сайдбар с инструкциями */}
                        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                            <section className="bg-background-one border border-border-color-one rounded-three p-6 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-[2px] bg-primary-color/10 text-primary-color">
                                        <Settings size={20} />
                                    </span>
                                    <h3 className="text-sm font-bold uppercase tracking-tight text-white-color font-title">Редактирование</h3>
                                </div>
                                <ol className="mt-6 space-y-6">
                                    {[
                                        {
                                            title: 'Основные данные',
                                            text: 'Обновите имя и описание, чтобы изменить контекст ответов ассистента.',
                                        },
                                        {
                                            title: 'Контакты',
                                            text: 'Актуализируйте телефон и социальные сети для связи с клиентами.',
                                        },
                                        {
                                            title: 'Поведение',
                                            text: 'Настройте приветствие и системные инструкции для лучшей работы ИИ.',
                                        },
                                        {
                                            title: 'Сохранение',
                                            text: 'Не забудьте нажать кнопку «Сохранить» после внесения всех изменений.',
                                        },
                                    ].map((step, index) => (
                                        <li key={index} className="flex gap-4">
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[2px] bg-primary-color text-[11px] font-bold text-black-color">
                                                {index + 1}
                                            </span>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-white-color">{step.title}</p>
                                                <p className="mt-1 text-xs leading-relaxed text-text-secondary">{step.text}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </section>

                            <section className="bg-primary-color/5 border border-primary-color/20 rounded-three p-6">
                                <div className="flex items-start gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] bg-primary-color text-black-color">
                                        <LifeBuoy className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-tight text-white-color font-title">Нужна помощь?</p>
                                        <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                                            Если возникли вопросы по настройке поведения — обратитесь в нашу поддержку.
                                        </p>
                                        <Link
                                            href={route('dashboard')}
                                            className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-color hover:text-white-color transition-colors"
                                        >
                                            Поддержка
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        </aside>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
