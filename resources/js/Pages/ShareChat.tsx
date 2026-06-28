import { Head } from '@inertiajs/react';
import ReactMarkdown from 'react-markdown';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { Bot, MoreVertical, Paperclip, Search, SendHorizontal } from 'lucide-react';
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
        <div className="flex h-screen flex-col bg-background-dark text-text-primary-dark font-sans">
            <Head title={`Чат: ${title}`} />

            {/* Шапка */}
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 glass px-4 py-3 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] gold-gradient text-base font-bold uppercase text-background-dark shadow-lg shadow-secondary/20">
                            {(title || 'A').charAt(0)}
                        </div>
                        <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-background-dark bg-green-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-text-primary-dark">{title}</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-text-secondary-dark">
                            Ассистент онлайн
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="rounded-lg p-2 text-text-secondary-dark transition-colors hover:bg-white/5 hover:text-text-primary-dark">
                        <Search className="h-5 w-5" />
                    </button>
                    <button className="rounded-lg p-2 text-text-secondary-dark transition-colors hover:bg-white/5 hover:text-text-primary-dark">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* Лента сообщений */}
            <div ref={scrollRef} className="flex-grow space-y-6 overflow-y-auto px-4 py-6 custom-scrollbar">
                {assistant.welcome_message && (
                    <div className="flex justify-start animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="flex max-w-[85%] gap-3">
                            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary border border-secondary/20">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div className="rounded-[20px] rounded-tl-sm glass px-4 py-3 text-sm text-text-primary-dark shadow-xl border-white/10">
                                <div className="prose prose-sm max-w-none prose-invert">
                                    <ReactMarkdown
                                        components={{
                                            h3: ({ node, ...props }) => <h3 className="mb-2 mt-3 text-base font-bold text-text-primary-dark" {...props} />,
                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed text-text-primary-dark/90" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="mb-2 list-disc pl-5 space-y-1 text-text-primary-dark/80" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="mb-2 list-decimal pl-5 space-y-1 text-text-primary-dark/80" {...props} />,
                                            li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="font-bold text-secondary" {...props} />,
                                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-secondary/30 pl-4 italic text-text-secondary-dark" {...props} />,
                                        }}
                                    >
                                        {assistant.welcome_message}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {messages.length === 0 && !assistant.welcome_message && (
                    <div className="py-10 text-center text-sm text-text-secondary-dark">
                        {assistant.description || 'Здравствуйте! Чем я могу вам помочь?'}
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Вопрос пользователя */}
                        <div className="flex justify-end">
                            <div className="flex max-w-[85%] items-end gap-2">
                                <div className="rounded-[20px] rounded-tr-sm bg-secondary px-4 py-3 text-sm font-medium text-background-dark shadow-lg shadow-secondary/10 selection:bg-background-dark/20">
                                    {msg.question}
                                </div>
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-text-secondary-dark uppercase border border-white/5">
                                    Я
                                </div>
                            </div>
                        </div>

                        {/* Ответ ассистента */}
                        <div className="flex justify-start">
                            <div className="flex max-w-[85%] gap-3">
                                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary border border-secondary/20">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div className="rounded-[20px] rounded-tl-sm glass px-4 py-3 text-sm text-text-primary-dark shadow-xl border-white/10">
                                    <div className="prose prose-sm max-w-none prose-invert">
                                        <ReactMarkdown
                                            components={{
                                                h3: ({ node, ...props }) => <h3 className="mb-2 mt-3 text-base font-bold text-text-primary-dark" {...props} />,
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed text-text-primary-dark/90" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="mb-2 list-disc pl-5 space-y-1 text-text-primary-dark/80" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="mb-2 list-decimal pl-5 space-y-1 text-text-primary-dark/80" {...props} />,
                                                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="font-bold text-secondary" {...props} />,
                                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-secondary/30 pl-4 italic text-text-secondary-dark" {...props} />,
                                            }}
                                        >
                                            {msg.answer}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {processing && (
                    <div className="flex justify-start">
                        <div className="animate-pulse rounded-[20px] rounded-bl-sm glass px-4 py-2 text-sm text-text-secondary-dark border-white/5">
                            Neural Engine обработка...
                        </div>
                    </div>
                )}

                {error && (
                    <div className="text-center text-xs text-error font-medium">{error}</div>
                )}
            </div>

            {/* Поле ввода */}
            <div className="border-t border-white/5 glass p-4 shadow-2xl">
                {assistant.actions && assistant.actions.length > 0 && messages.length === 0 && (
                    <div className="mb-4 flex flex-wrap justify-center gap-2">
                        {assistant.actions.filter(a => a.trim() !== '').map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => sendMessage(action)}
                                disabled={processing}
                                className="rounded-full glass px-4 py-2 text-xs font-medium text-text-secondary-dark border-white/5 hover:border-secondary hover:text-text-primary-dark transition-all shadow-sm disabled:opacity-50"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                )}
                <form onSubmit={submit} className="relative flex items-center gap-3">
                    <div className="relative flex-grow group">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Введите ваш запрос..."
                            disabled={processing}
                            className="w-full rounded-xl bg-background-dark/50 border-white/10 py-3.5 pl-4 pr-12 text-sm text-text-primary-dark transition-all focus:border-secondary/50 focus:ring-secondary/20 disabled:opacity-50 placeholder:text-text-secondary-dark/50"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                             <button
                                type="button"
                                className="rounded-lg p-1.5 text-text-secondary-dark hover:bg-white/5 hover:text-text-primary-dark transition-colors"
                            >
                                <Paperclip className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={processing || question.trim() === ''}
                        className={cn(
                            "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 shadow-lg active:scale-95 disabled:scale-100 disabled:opacity-30 disabled:grayscale",
                            question.trim() !== '' ? "gold-gradient text-background-dark shadow-secondary/20" : "bg-white/5 text-text-secondary-dark shadow-none"
                        )}
                        aria-label="Отправить"
                    >
                        <SendHorizontal className={cn("h-5 w-5 transition-transform", question.trim() !== '' && "translate-x-0.5 -translate-y-0.5")} />
                    </button>
                </form>
                <p className="mt-3 text-center text-[10px] text-text-secondary-dark/60">
                    Powered by <span className="font-bold text-secondary">NeuralFlow Engine</span> • Industrial Grade RAG
                </p>
            </div>
        </div>
    );
}
