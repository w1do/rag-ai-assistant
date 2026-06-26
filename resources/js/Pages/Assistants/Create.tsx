import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { FormEventHandler, ReactNode } from 'react';

/**
 * Единые классы для текстовых полей, textarea и select формы.
 *
 * Обеспечивают одинаковый паддинг, скругление, тень и состояния фокуса
 * у всех элементов ввода, чтобы форма выглядела целостно.
 */
const fieldClass =
    'block w-full rounded-md border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500';

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
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                {description && (
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{description}</p>
                )}
            </div>
            <div className="space-y-5">{children}</div>
        </section>
    );
}

/**
 * Страница создания нового ассистента.
 *
 * Содержит форму с едиными отступами полей, сгруппированную по секциям,
 * и боковую панель с инструкциями и блоком обращения в поддержку.
 */
export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        style: 'business',
        brand_name: '',
        phone: '',
        social: { telegram: '', vk: '' },
        fallback: '',
        system: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('assistants.store'));
    };

    /**
     * Обновляет одну из соцсетей в данных формы, сохраняя остальные.
     *
     * @param key Ключ соцсети (`telegram` или `vk`).
     * @param value Новое значение поля.
     */
    const handleSocialChange = (key: string, value: string) => {
        setData('social', {
            ...data.social,
            [key]: value,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Создать ассистента
                    </h2>
                    <Link
                        href={route('assistants.index')}
                        className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
                    >
                        ← К списку
                    </Link>
                </div>
            }
        >
            <Head title="Создать ассистента" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Форма */}
                        <form onSubmit={submit} className="space-y-6 lg:col-span-2">
                            <FormSection
                                title="Основная информация"
                                description="Имя ассистента и описание компании, которое задаёт контекст для ответов."
                            >
                                <div>
                                    <InputLabel htmlFor="name" value="Имя ассистента" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1.5 block w-full px-3 py-2 text-sm"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Описание / информация о компании" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className={`mt-1.5 ${fieldClass}`}
                                        rows={4}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Краткое описание вашей компании для контекста ассистента"
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>
                            </FormSection>

                            <FormSection
                                title="Стиль и бренд"
                                description="Как ассистент общается и от чьего имени представляется пользователям."
                            >
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="style" value="Стиль общения" />
                                        <select
                                            id="style"
                                            name="style"
                                            value={data.style}
                                            className={`mt-1.5 ${fieldClass}`}
                                            onChange={(e) => setData('style', e.target.value)}
                                        >
                                            <option value="business">Деловой</option>
                                            <option value="commercial">Коммерческий</option>
                                            <option value="rude">Грубый</option>
                                            <option value="positive">Позитивный</option>
                                        </select>
                                        <InputError message={errors.style} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="brand_name" value="Имя бренда" />
                                        <TextInput
                                            id="brand_name"
                                            type="text"
                                            name="brand_name"
                                            value={data.brand_name}
                                            className="mt-1.5 block w-full px-3 py-2 text-sm"
                                            onChange={(e) => setData('brand_name', e.target.value)}
                                        />
                                        <InputError message={errors.brand_name} className="mt-2" />
                                    </div>
                                </div>
                            </FormSection>

                            <FormSection
                                title="Контакты"
                                description="Контактные данные, которые ассистент сможет предложить клиентам."
                            >
                                <div>
                                    <InputLabel htmlFor="phone" value="Номер телефона" />
                                    <TextInput
                                        id="phone"
                                        type="text"
                                        name="phone"
                                        value={data.phone}
                                        className="mt-1.5 block w-full px-3 py-2 text-sm"
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+7 (___) ___-__-__"
                                    />
                                    <InputError message={errors.phone} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel value="Социальные сети" />
                                    <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <TextInput
                                            type="text"
                                            value={data.social.telegram}
                                            className="block w-full px-3 py-2 text-sm"
                                            onChange={(e) => handleSocialChange('telegram', e.target.value)}
                                            placeholder="Telegram: @username"
                                        />
                                        <TextInput
                                            type="text"
                                            value={data.social.vk}
                                            className="block w-full px-3 py-2 text-sm"
                                            onChange={(e) => handleSocialChange('vk', e.target.value)}
                                            placeholder="VK: vk.com/id"
                                        />
                                    </div>
                                    <InputError message={errors.social} className="mt-2" />
                                </div>
                            </FormSection>

                            <FormSection
                                title="Поведение ассистента"
                                description="Тонкая настройка ответов: запасной ответ и системная инструкция."
                            >
                                <div>
                                    <InputLabel htmlFor="fallback" value="Сообщение при отсутствии ответа (Fallback)" />
                                    <textarea
                                        id="fallback"
                                        name="fallback"
                                        value={data.fallback}
                                        className={`mt-1.5 ${fieldClass}`}
                                        rows={3}
                                        onChange={(e) => setData('fallback', e.target.value)}
                                        placeholder="Что ответить, если ассистент не знает ответа?"
                                    />
                                    <InputError message={errors.fallback} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="system" value="Системный промпт" />
                                    <textarea
                                        id="system"
                                        name="system"
                                        value={data.system}
                                        className={`mt-1.5 ${fieldClass}`}
                                        rows={5}
                                        onChange={(e) => setData('system', e.target.value)}
                                        placeholder="Системная инструкция для ассистента. Ассистент отвечает только по базе знаний."
                                    />
                                    <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                                        Системный промпт задаёт поведение ассистента. Ассистент отвечает на вопросы строго по базе знаний (Qdrant), ничего лишнего.
                                    </p>
                                    <InputError message={errors.system} className="mt-2" />
                                </div>
                            </FormSection>

                            <div className="flex items-center justify-end gap-3">
                                <Link
                                    href={route('assistants.index')}
                                    className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
                                >
                                    Отмена
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Создание...' : 'Создать ассистента'}
                                </PrimaryButton>
                            </div>
                        </form>

                        {/* Сайдбар с инструкциями */}
                        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                    <h3 className="text-sm font-semibold text-gray-900">Как создать ассистента</h3>
                                </div>
                                <ol className="mt-4 space-y-4">
                                    {[
                                        {
                                            title: 'Заполните основную информацию',
                                            text: 'Укажите имя ассистента и описание компании — это контекст для ответов.',
                                        },
                                        {
                                            title: 'Выберите стиль общения',
                                            text: 'Стиль и имя бренда определяют тон ответов клиентам.',
                                        },
                                        {
                                            title: 'Добавьте контакты',
                                            text: 'Телефон и соцсети, которые ассистент сможет предложить.',
                                        },
                                        {
                                            title: 'Настройте поведение',
                                            text: 'Задайте fallback-ответ и системный промпт для точных ответов.',
                                        },
                                    ].map((step, index) => (
                                        <li key={index} className="flex gap-3">
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                                                {index + 1}
                                            </span>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-900">{step.title}</p>
                                                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{step.text}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </section>

                            {/* Box-сообщение о поддержке */}
                            <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
                                <div className="flex items-start gap-3">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a9 9 0 010-12.728m0 0L3 3m2.464 2.464l2.829 2.829" />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-amber-900">Возникли проблемы?</p>
                                        <p className="mt-1 text-xs leading-relaxed text-amber-800">
                                            Если что-то не работает или нужна помощь с настройкой — обратитесь к менеджеру на главной странице.
                                        </p>
                                        <Link
                                            href="/dashboard"
                                            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-900 underline-offset-2 hover:underline"
                                        >
                                            Перейти к менеджеру
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
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
