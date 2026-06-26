import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Markdown from 'react-markdown';
import { FormEventHandler, useEffect, useRef } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

interface Message {
    id: number;
    question: string;
    answer: string;
    sources: {
        content: string;
        sourceName: string;
        sourceType: string;
    }[];
    created_at: string;
}

interface Props {
    assistant: {
        id: number;
        name: string;
        welcome_message: string | null;
        actions: string[] | null;
    };
    history: Message[];
}

export default function Chat({ assistant, history }: Props) {
    const { data, setData, post, processing, reset } = useForm({
        question: '',
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const submit: FormEventHandler = (e) => {
        e?.preventDefault();
        sendMessage(data.question);
    };

    const sendMessage = (text: string) => {
        if (!text.trim() || processing) return;

        // Синхронизируем поле ввода если оно не совпадает (для клика по кнопке)
        if (text !== data.question) {
            setData('question', text);
        }

        // Мы используем объект данных вручную, чтобы не зависеть от асинхронности setData
        post(route('assistants.chat.store', assistant.id), {
            forceFormData: true, // На всякий случай
            onSuccess: () => reset('question'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Чат с {assistant.name}
                </h2>
            }
        >
            <Head title={`Чат: ${assistant.name}`} />

            <div className="py-12 h-[calc(100vh-64px)] overflow-hidden">
                <div className="mx-auto max-w-7xl h-full flex flex-col sm:px-6 lg:px-8">
                    <div className="bg-white flex-grow flex flex-col overflow-hidden shadow-sm sm:rounded-lg">
                        <div
                            ref={scrollRef}
                            className="flex-grow overflow-y-auto p-6 space-y-6"
                        >
                            {assistant.welcome_message && (
                                <div className="space-y-4">
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 text-gray-800 rounded-lg p-4 max-w-[80%]">
                                            <div className="prose prose-sm">
                                                <Markdown>{assistant.welcome_message}</Markdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {history.length === 0 && !assistant.welcome_message && (
                                <div className="text-center py-12 text-gray-500">
                                    Начните общение с ассистентом, задав первый вопрос.
                                </div>
                            )}

                            {history.map((msg) => (
                                <div key={msg.id} className="space-y-4">
                                    <div className="flex justify-end">
                                        <div className="bg-indigo-600 text-white rounded-lg p-4 max-w-[80%]">
                                            <p>{msg.question}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 text-gray-800 rounded-lg p-4 max-w-[80%]">
                                            <div className="prose prose-sm">
                                                <Markdown>{msg.answer}</Markdown>
                                            </div>
                                            {msg.sources && msg.sources.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <p className="text-xs font-bold text-gray-500 mb-2">Источники:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {msg.sources.map((source, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-[10px] bg-white border border-gray-300 px-2 py-1 rounded shadow-sm"
                                                                title={source.content}
                                                            >
                                                                {source.sourceName}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {processing && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 text-gray-800 rounded-lg p-4 animate-pulse">
                                        Ассистент думает...
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t">
                            {assistant.actions && assistant.actions.length > 0 && history.length === 0 && (
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {assistant.actions.filter(a => a.trim() !== '').map((action, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setData('question', action);
                                            }}
                                            disabled={processing}
                                            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100 disabled:opacity-50"
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <form onSubmit={submit} className="flex space-x-4">
                                <TextInput
                                    className="flex-grow"
                                    value={data.question}
                                    onChange={(e) => setData('question', e.target.value)}
                                    placeholder="Введите ваш вопрос..."
                                    disabled={processing}
                                    required
                                />
                                <PrimaryButton disabled={processing}>
                                    Отправить
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
