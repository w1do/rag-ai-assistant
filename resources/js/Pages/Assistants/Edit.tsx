import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { FormEventHandler } from 'react';

interface Assistant {
    id: number;
    name: string;
    description: string | null;
    style: string;
    brand_name: string | null;
    phone: string | null;
    social: Record<string, string> | null;
    fallback: string | null;
    system: string | null;
}

interface Props {
    assistant: Assistant;
}

export default function Edit({ assistant }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: assistant.name || '',
        description: assistant.description || '',
        style: assistant.style || 'business',
        brand_name: assistant.brand_name || '',
        phone: assistant.phone || '',
        social: assistant.social || { telegram: '', vk: '' },
        fallback: assistant.fallback || '',
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Редактировать ассистента: {assistant.name}
                </h2>
            }
        >
            <Head title={`Редактировать ${assistant.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="max-w-2xl space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Имя ассистента" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Описание / Информация о компании" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description || ''}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={4}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Краткое описание вашей компании для контекста ассистента"
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="style" value="Стиль общения" />
                                        <select
                                            id="style"
                                            name="style"
                                            value={data.style}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
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
                                            value={data.brand_name || ''}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('brand_name', e.target.value)}
                                        />
                                        <InputError message={errors.brand_name} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="phone" value="Номер телефона" />
                                        <TextInput
                                            id="phone"
                                            type="text"
                                            name="phone"
                                            value={data.phone || ''}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                        <InputError message={errors.phone} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel value="Социальные сети" />
                                        <div className="space-y-2 mt-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-500 w-20">Telegram:</span>
                                                <TextInput
                                                    type="text"
                                                    value={data.social?.telegram || ''}
                                                    className="block w-full text-sm"
                                                    onChange={(e) => handleSocialChange('telegram', e.target.value)}
                                                    placeholder="@username"
                                                />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-500 w-20">VK:</span>
                                                <TextInput
                                                    type="text"
                                                    value={data.social?.vk || ''}
                                                    className="block w-full text-sm"
                                                    onChange={(e) => handleSocialChange('vk', e.target.value)}
                                                    placeholder="vk.com/id"
                                                />
                                            </div>
                                        </div>
                                        <InputError message={errors.social} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="fallback" value="Сообщение при отсутствии ответа (Fallback)" />
                                    <textarea
                                        id="fallback"
                                        name="fallback"
                                        value={data.fallback || ''}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={3}
                                        onChange={(e) => setData('fallback', e.target.value)}
                                        placeholder="Что ответить, если ассистент не знает ответа?"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Это сообщение будет отправлено пользователю, если ассистент не сможет найти ответ в базе знаний.
                                    </p>
                                    <InputError message={errors.fallback} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="system" value="Системный промпт" />
                                    <textarea
                                        id="system"
                                        name="system"
                                        value={data.system || ''}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={5}
                                        onChange={(e) => setData('system', e.target.value)}
                                        placeholder="Системная инструкция для ассистента. Ассистент отвечает только по базе знаний."
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Системный промпт задаёт поведение ассистента. Ассистент отвечает на вопросы строго по базе знаний (Qdrant), ничего лишнего.
                                    </p>
                                    <InputError message={errors.system} className="mt-2" />
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t">
                                    <PrimaryButton disabled={processing}>
                                        Сохранить изменения
                                    </PrimaryButton>
                                    
                                    {data.isDirty && (
                                        <p className="text-sm text-gray-600">Есть несохраненные изменения.</p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
