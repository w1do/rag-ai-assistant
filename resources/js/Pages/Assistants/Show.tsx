import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { ChangeEvent, useEffect, useState } from 'react';

import ReactMarkdown from 'react-markdown';

interface Chunk {
    id: number;
    content: string;
}

interface Knowledge {
    id: number;
    type: 'document' | 'voice' | 'website';
    name: string | null;
    url: string | null;
    path: string | null;
    content: string | null;
    status: string;
    metadata: any;
}

interface Assistant {
    id: number;
    name: string;
    description: string | null;
    status: string;
    style: string;
    brand_name: string | null;
    phone: string | null;
    social: Record<string, string> | null;
    fallback: string | null;
    chunks: Chunk[];
    knowledge: Knowledge[];
}

interface Props {
    assistant: Assistant;
}

export default function Show({ assistant }: Props) {
    const [activeTab, setActiveTab] = useState<'document' | 'voice' | 'website'>('document');

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const isProcessing = assistant.status !== 'ready' && assistant.status !== 'error' 
            || (assistant.knowledge || []).some(k => k.status === 'processing' || k.status === 'pending');

        if (isProcessing) {
            interval = setInterval(() => {
                router.reload({ only: ['assistant'], preserveScroll: true });
            }, 3000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [assistant.status, assistant.knowledge]);

    const docForm = useForm({
        document: null as File | null,
    });

    const audioForm = useForm({
        audio: null as File | null,
    });

    const urlForm = useForm({
        url: '',
    });

    const uploadDoc = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            docForm.setData('document', e.target.files[0]);
            docForm.post(route('assistants.upload-document', assistant.id), {
                forceFormData: true,
            });
        }
    };

    const uploadAudio = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            audioForm.setData('audio', e.target.files[0]);
            audioForm.post(route('assistants.upload-audio', assistant.id), {
                forceFormData: true,
            });
        }
    };

    const submitUrl = (e: React.FormEvent) => {
        e.preventDefault();
        urlForm.post(route('assistants.add-url', assistant.id), {
            onSuccess: () => {
                urlForm.reset();
            }
        });
    };

    const deleteKnowledge = (knowledgeId: number) => {
        if (confirm('Вы уверены, что хотите удалить этот источник знаний и все связанные данные?')) {
            router.delete(route('assistants.knowledge.destroy', [assistant.id, knowledgeId]));
        }
    };

    const deleteAssistant = () => {
        if (confirm('Вы уверены, что хотите полностью удалить этого ассистента и все связанные данные?')) {
            router.delete(route('assistants.destroy', assistant.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Ассистент: {assistant.name}
                    </h2>
                    <div className="flex items-center space-x-3">
                        <Link href={route('assistants.edit', assistant.id)}>
                            <SecondaryButton>Редактировать</SecondaryButton>
                        </Link>
                        <Link href={route('assistants.chat', assistant.id)}>
                            <PrimaryButton>Начать чат</PrimaryButton>
                        </Link>
                        <button 
                            onClick={deleteAssistant}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                            title="Удалить ассистента"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Ассистент: ${assistant.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-bold mb-4">Описание</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {assistant.description || 'Описание отсутствует.'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex border-b mb-6">
                                        <button
                                            onClick={() => setActiveTab('document')}
                                            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                                                activeTab === 'document'
                                                    ? 'border-indigo-500 text-indigo-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            Документы
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('voice')}
                                            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                                                activeTab === 'voice'
                                                    ? 'border-indigo-500 text-indigo-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            Голосовые
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('website')}
                                            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                                                activeTab === 'website'
                                                    ? 'border-indigo-500 text-indigo-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            Веб-сайты
                                        </button>
                                    </div>

                                    {activeTab === 'document' && (
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
                                                <div>
                                                    <h4 className="font-medium">Загрузить PDF / Документ</h4>
                                                    <p className="text-sm text-gray-500">Добавьте документы для обучения ассистента</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <label className="cursor-pointer">
                                                        <PrimaryButton as="span" disabled={docForm.processing}>
                                                            {docForm.processing ? 'Загрузка...' : 'Загрузить'}
                                                        </PrimaryButton>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept=".pdf,.docx,.txt"
                                                            onChange={uploadDoc}
                                                            disabled={docForm.processing}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'voice' && (
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
                                                <div>
                                                    <h4 className="font-medium">Голосовое сообщение</h4>
                                                    <p className="text-sm text-gray-500">Загрузите аудио для транскрипции</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <label className="cursor-pointer">
                                                        <PrimaryButton as="span" disabled={audioForm.processing}>
                                                            {audioForm.processing ? 'Загрузка...' : 'Загрузить'}
                                                        </PrimaryButton>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="audio/*"
                                                            onChange={uploadAudio}
                                                            disabled={audioForm.processing}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'website' && (
                                        <div className="space-y-6">
                                            <div className="p-4 border rounded-lg bg-gray-50">
                                                <h4 className="font-medium">Анализ сайта</h4>
                                                <p className="text-sm text-gray-500">Введите URL для анализа и обучения</p>
                                                <form onSubmit={submitUrl} className="mt-2 flex space-x-2">
                                                    <input
                                                        type="url"
                                                        value={urlForm.data.url}
                                                        onChange={(e) => urlForm.setData('url', e.target.value)}
                                                        className="flex-grow text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                        placeholder="https://example.com"
                                                        required
                                                    />
                                                    <PrimaryButton disabled={urlForm.processing}>
                                                        {urlForm.processing ? '...' : 'Добавить'}
                                                    </PrimaryButton>
                                                </form>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-8 space-y-4">
                                        <h3 className="text-md font-bold text-gray-700">Список источников ({(assistant.knowledge || []).filter(k => k.type === activeTab).length})</h3>
                                        
                                        {(assistant.knowledge || []).filter(k => k.type === activeTab).length === 0 ? (
                                            <p className="text-gray-500 text-sm">Источников этого типа пока нет.</p>
                                        ) : (
                                            <div className="space-y-4">
                                                {(assistant.knowledge || []).filter(k => k.type === activeTab).map((item) => (
                                                    <div key={item.id} className="p-4 border rounded-lg bg-white shadow-sm">
                                                        <div className="flex justify-between items-start">
                                                            <div className="overflow-hidden">
                                                                <h4 className="font-bold text-sm text-gray-900 truncate">
                                                                    {item.name || item.url || 'Безымянный источник'}
                                                                </h4>
                                                                {item.url && (
                                                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:text-indigo-800 truncate block">
                                                                        {item.url}
                                                                    </a>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center space-x-2 shrink-0">
                                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                                                    item.status === 'ready' ? 'bg-green-100 text-green-800' : 
                                                                    item.status === 'error' ? 'bg-red-100 text-red-800' :
                                                                    item.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                    {item.status === 'processing' ? 'В обработке' : 
                                                                     item.status === 'ready' ? 'Готово' : 
                                                                     item.status === 'pending' ? 'В очереди' :
                                                                     item.status === 'error' ? 'Ошибка' : item.status}
                                                                </span>
                                                                
                                                                <button 
                                                                    onClick={() => deleteKnowledge(item.id)}
                                                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                                    title="Удалить"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {item.content && (
                                                            <details className="mt-2">
                                                                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">Показать содержимое</summary>
                                                                <div className="mt-2 p-3 bg-gray-50 rounded text-xs prose prose-sm max-w-none max-h-60 overflow-y-auto border border-gray-100">
                                                                    <ReactMarkdown>{item.content}</ReactMarkdown>
                                                                </div>
                                                            </details>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-bold mb-4">Настройки ассистента</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Стиль общения</p>
                                            <p className="text-sm font-medium">
                                                {assistant.style === 'business' ? 'Деловой' :
                                                 assistant.style === 'commercial' ? 'Коммерческий' :
                                                 assistant.style === 'rude' ? 'Грубый' :
                                                 assistant.style === 'positive' ? 'Позитивный' : assistant.style}
                                            </p>
                                        </div>
                                        {assistant.brand_name && (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-bold">Бренд</p>
                                                <p className="text-sm font-medium">{assistant.brand_name}</p>
                                            </div>
                                        )}
                                        {assistant.phone && (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-bold">Телефон</p>
                                                <p className="text-sm font-medium">{assistant.phone}</p>
                                            </div>
                                        )}
                                        {assistant.social && Object.entries(assistant.social).some(([_, v]) => v) && (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-bold">Социальные сети</p>
                                                <div className="text-sm font-medium">
                                                    {Object.entries(assistant.social).map(([key, value]) => (
                                                        value && <div key={key}><span className="capitalize">{key}</span>: {value}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {assistant.fallback && (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-bold">Fallback</p>
                                                <p className="text-sm font-medium italic">"{assistant.fallback}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-bold mb-4">Статус ассистента</h3>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${
                                            assistant.status === 'ready' ? 'bg-green-500' : 'bg-yellow-500'
                                        }`} />
                                        <span className="capitalize">{assistant.status}</span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-sm text-gray-500">Всего чанков: {(assistant.chunks || []).length}</p>
                                        <p className="text-sm text-gray-500">Источников знаний: {(assistant.knowledge || []).length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
