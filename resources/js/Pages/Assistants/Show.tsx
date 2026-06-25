import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { ChangeEvent, useEffect } from 'react';

interface Chunk {
    id: number;
    content: string;
}

interface Article {
    id: number;
    url: string;
    status: string;
}

interface Assistant {
    id: number;
    name: string;
    description: string;
    status: string;
    chunks: Chunk[];
    articles: Article[];
}

interface Props {
    assistant: Assistant;
}

export default function Show({ assistant }: Props) {
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (assistant.status !== 'ready' && assistant.status !== 'error') {
            interval = setInterval(() => {
                router.reload({ only: ['assistant'] });
            }, 3000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [assistant.status]);

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
                onSuccess: () => {
                    alert('Документ загружен и обрабатывается');
                }
            });
        }
    };

    const uploadAudio = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            audioForm.setData('audio', e.target.files[0]);
            audioForm.post(route('assistants.upload-audio', assistant.id), {
                forceFormData: true,
                onSuccess: () => {
                    alert('Аудио загружено и транскрибируется');
                }
            });
        }
    };

    const submitUrl = (e: React.FormEvent) => {
        e.preventDefault();
        urlForm.post(route('assistants.add-url', assistant.id), {
            onSuccess: () => {
                alert('URL добавлен и обрабатывается');
                urlForm.reset();
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Ассистент: {assistant.name}
                    </h2>
                    <div className="flex space-x-2">
                        <Link href={route('assistants.edit', assistant.id)}>
                            <SecondaryButton>Редактировать</SecondaryButton>
                        </Link>
                        <Link href={route('assistants.chat', assistant.id)}>
                            <PrimaryButton>Начать чат</PrimaryButton>
                        </Link>
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
                                    <h3 className="text-lg font-bold mb-4">Сгенерированные статьи</h3>
                                    {assistant.articles.length === 0 ? (
                                        <p className="text-gray-500">Статей пока нет. Добавьте URL конкурента для генерации.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {assistant.articles.map((article) => (
                                                <div key={article.id} className="p-4 border rounded-lg">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-bold">{article.title || 'Обработка...'}</h4>
                                                            <p className="text-xs text-gray-500">{article.url}</p>
                                                        </div>
                                                        <span className={`text-xs px-2 py-1 rounded ${
                                                            article.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {article.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-bold mb-4">Источники знаний</h3>
                                    <div className="space-y-4">
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
                                        <div className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
                                            <div className="flex-grow">
                                                <h4 className="font-medium">Анализ сайта</h4>
                                                <p className="text-sm text-gray-500">Введите URL конкурента для анализа</p>
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
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
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
                                        <p className="text-sm text-gray-500">Чанков: {assistant.chunks.length}</p>
                                        <p className="text-sm text-gray-500">Статей: {assistant.articles.length}</p>
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
