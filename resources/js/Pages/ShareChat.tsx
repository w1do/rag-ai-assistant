import { Head } from '@inertiajs/react';
import Markdown from 'react-markdown';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import * as Lucide from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Одна реплика беседы в публичном чате (вопрос пользователя и ответ ассистента).
 */
interface Message {
    question: string;
    answer: string;
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

            const data: { answer: string } = await response.json();

            setMessages((prev) => [
                ...prev,
                { question: trimmed, answer: data.answer },
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
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-base font-bold uppercase text-white shadow-md shadow-indigo-100">
                            {(title || 'A').charAt(0)}
                        </div>
                        <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900">{title}</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                            Ассистент онлайн
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                        <Lucide.Search className="h-5 w-5" />
                    </button>
                    <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                        <Lucide.MoreVertical className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* Лента сообщений */}
            <div ref={scrollRef} className="flex-grow space-y-6 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-gray-200">
                {assistant.welcome_message && (
                    <div className="flex justify-start animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="flex max-w-[85%] gap-2">
                            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                <Lucide.Bot className="h-5 w-5" />
                            </div>
                            <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm text-gray-800 shadow-sm ring-1 ring-gray-100">
                                <div className="prose prose-sm max-w-none prose-indigo">
                                    <Markdown
                                        components={{
                                            h3: ({...props}) => <h3 className="mb-2 mt-3 text-base font-bold text-gray-900" {...props} />,
                                            p: ({...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                                            ul: ({...props}) => <ul className="mb-2 list-disc pl-5 space-y-1" {...props} />,
                                            ol: ({...props}) => <ol className="mb-2 list-decimal pl-5 space-y-1" {...props} />,
                                            li: ({...props}) => <li className="leading-relaxed" {...props} />,
                                            strong: ({...props}) => <strong className="font-semibold text-indigo-700" {...props} />,
                                            blockquote: ({...props}) => <blockquote className="border-l-4 border-indigo-200 pl-4 italic text-gray-600" {...props} />,
                                        }}
                                    >
                                        {assistant.welcome_message}
                                    </Markdown>
                                </div>
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
                    <div key={idx} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Вопрос пользователя */}
                        <div className="flex justify-end">
                            <div className="flex max-w-[85%] items-end gap-2">
                                <div className="rounded-2xl rounded-tr-sm bg-indigo-600 px-4 py-3 text-sm text-white shadow-md shadow-indigo-100 selection:bg-indigo-300">
                                    {msg.question}
                                </div>
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-500 uppercase">
                                    Я
                                </div>
                            </div>
                        </div>

                        {/* Ответ ассистента */}
                        <div className="flex justify-start">
                            <div className="flex max-w-[85%] gap-2">
                                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                    <Lucide.Bot className="h-5 w-5" />
                                </div>
                                <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm text-gray-800 shadow-sm ring-1 ring-gray-100">
                                    <div className="prose prose-sm max-w-none prose-indigo">
                                        <Markdown
                                            components={{
                                                h3: ({...props}) => <h3 className="mb-2 mt-3 text-base font-bold text-gray-900" {...props} />,
                                                p: ({...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                                                ul: ({...props}) => <ul className="mb-2 list-disc pl-5 space-y-1" {...props} />,
                                                ol: ({...props}) => <ol className="mb-2 list-decimal pl-5 space-y-1" {...props} />,
                                                li: ({...props}) => <li className="leading-relaxed" {...props} />,
                                                strong: ({...props}) => <strong className="font-semibold text-indigo-700" {...props} />,
                                                blockquote: ({...props}) => <blockquote className="border-l-4 border-indigo-200 pl-4 italic text-gray-600" {...props} />,
                                            }}
                                        >
                                            {msg.answer}
                                        </Markdown>
                                    </div>
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
            <div className="border-t border-gray-200 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {assistant.actions && assistant.actions.length > 0 && messages.length === 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {assistant.actions.filter(a => a.trim() !== '').map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => sendMessage(action)}
                                disabled={processing}
                                className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-2 text-xs font-semibold text-indigo-700 transition-all hover:bg-indigo-100 hover:shadow-sm disabled:opacity-50"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                )}
                <form onSubmit={submit} className="relative flex items-center gap-2">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Напишите сообщение..."
                            disabled={processing}
                            className="w-full rounded-2xl border-gray-200 bg-gray-50 py-3 pl-4 pr-12 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                             <button
                                type="button"
                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                            >
                                <Lucide.Paperclip className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={processing || question.trim() === ''}
                        className={cn(
                            "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 shadow-lg active:scale-95 disabled:scale-100 disabled:opacity-50",
                            question.trim() !== '' ? "bg-indigo-600 text-white shadow-indigo-200" : "bg-gray-100 text-gray-400 shadow-none"
                        )}
                        aria-label="Отправить"
                    >
                        <Lucide.SendHorizontal className={cn("h-5 w-5 transition-transform", question.trim() !== '' && "translate-x-0.5 -translate-y-0.5")} />
                    </button>
                </form>
                <p className="mt-2 text-center text-[10px] text-gray-400">
                    Работает на базе <a href="https://botsync.ru" className="font-semibold text-indigo-500">BotSync AI</a>
                </p>
            </div>
        </div>
    );
}
