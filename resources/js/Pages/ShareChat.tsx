import { Head } from '@inertiajs/react';
import Markdown from 'react-markdown';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

/**
 * Источник знаний, использованный ассистентом при формировании ответа.
 */
interface Source {
    content: string;
    sourceName: string;
    sourceType: string;
}

/**
 * Одна реплика беседы в публичном чате (вопрос пользователя и ответ ассистента).
 */
interface Message {
    question: string;
    answer: string;
    sources?: Source[];
}

interface Props {
    assistant: {
        id: number;
        name: string;
        brand_name: string | null;
        description: string | null;
        welcome_message: string | null;
        actions: string[] | null;
    };
    initialMessages?: Message[];
    csrfToken: string;
}

/**
 * Standalone-страница общедоступного чата ассистента.
 *
 * Рендерится без авторизационного layout и предназначена для загрузки внутри
 * iframe встраиваемого виджета (`public/widget.js`). Общение с ассистентом
 * происходит через stateless JSON-эндпоинт: история беседы хранится только в
 * состоянии компонента и передаётся на сервер при каждом запросе.
 */
export default function ShareChat({ assistant, csrfToken, initialMessages = [] }: Props) {
    const title = assistant.brand_name || assistant.name;

    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [question, setQuestion] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, processing]);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        sendMessage(question);
    };

    const sendMessage = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || processing) {
            return;
        }

        setProcessing(true);
        setError(null);
        setQuestion('');

        try {
            const response = await fetch(`/share-chat/${assistant.id}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ question: trimmed }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data: { answer: string; sources: Source[] } = await response.json();

            setMessages((prev) => [
                ...prev,
                { question: trimmed, answer: data.answer, sources: data.sources },
            ]);
        } catch {
            setError('Не удалось получить ответ. Попробуйте ещё раз.');
            if (text === question) {
                setQuestion(trimmed);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex h-screen flex-col bg-gray-50">
            <Head title={`Чат: ${title}`} />

            {/* Шапка */}
            <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-base font-bold uppercase text-white">
                    {(title || 'A').charAt(0)}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{title}</p>
                    <p className="flex items-center gap-1 text-xs text-green-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Онлайн
                    </p>
                </div>
            </header>

            {/* Лента сообщений */}
            <div ref={scrollRef} className="flex-grow space-y-4 overflow-y-auto p-4">
                {assistant.welcome_message && (
                    <div className="flex justify-start">
                        <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-4 py-2 text-sm text-gray-800 shadow-sm">
                            <div className="prose prose-sm max-w-none">
                                <Markdown>{assistant.welcome_message}</Markdown>
                            </div>
                        </div>
                    </div>
                )}

                {messages.length === 0 && !assistant.welcome_message && (
                    <div className="py-10 text-center text-sm text-gray-500">
                        {assistant.description || 'Здравствуйте! Чем я могу вам помочь?'}
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className="space-y-3">
                        <div className="flex justify-end">
                            <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-indigo-600 px-4 py-2 text-sm text-white">
                                {msg.question}
                            </div>
                        </div>
                        <div className="flex justify-start">
                            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-4 py-2 text-sm text-gray-800 shadow-sm">
                                <div className="prose prose-sm max-w-none">
                                    <Markdown>{msg.answer}</Markdown>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {processing && (
                    <div className="flex justify-start">
                        <div className="animate-pulse rounded-2xl rounded-bl-sm bg-white px-4 py-2 text-sm text-gray-500 shadow-sm">
                            Печатает...
                        </div>
                    </div>
                )}

                {error && (
                    <div className="text-center text-xs text-red-600">{error}</div>
                )}
            </div>

            {/* Поле ввода */}
            <div className="border-t border-gray-200 bg-white p-3">
                {assistant.actions && assistant.actions.length > 0 && messages.length === 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {assistant.actions.filter(a => a.trim() !== '').map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => sendMessage(action)}
                                disabled={processing}
                                className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 disabled:opacity-50"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                )}
                <form onSubmit={submit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Введите сообщение..."
                        disabled={processing}
                        className="flex-grow rounded-full border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={processing || question.trim() === ''}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                        aria-label="Отправить"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
