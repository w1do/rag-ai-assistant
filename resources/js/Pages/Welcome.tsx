import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import ReactMarkdown from 'react-markdown';
import {
    Check,
    Rocket,
    Calendar,
    Crown,
    MessageSquare,
    Mic,
    FileText,
    Globe,
    ArrowRight,
    Loader2,
    Menu,
    X,
    Zap,
    User,
    Bot
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import FAQ from '@/Components/FAQ';
import UseCases from '@/Components/UseCases';
import SetupProcess from '@/Components/SetupProcess';
import TechStack from '@/Components/TechStack';
import DataSync from '@/Components/DataSync';
import Header from '@/Components/Header';
import Hero from '@/Components/Hero';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface Tariff {
    name: string;
    price: number;
    period: string;
    description: string;
    features: string[];
    icon: any;
    highlighted: boolean;
}

/**
 * Страница приветствия (Landing Page).
 *
 * Содержит Hero-секцию, демо-чат, информацию о способах обучения бота,
 * тарифные планы, CTA и подвал.
 *
 * @param props Свойства страницы, включая данные авторизации.
 */
export default function Welcome({
    auth,
    demoWelcomeMessage,
    demoActions,
}: PageProps<{ demoWelcomeMessage?: string | null; demoActions?: string[] | null }>) {
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: demoWelcomeMessage || 'Привет! Я ваш AI-ассистент, обученный на базе знаний этого проекта. Спросите меня о чем угодно!'
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToBottom = (smooth = true) => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async (e?: React.FormEvent, text?: string) => {
        e?.preventDefault();
        const messageToSend = text || chatInput.trim();
        if (!messageToSend || isLoading) return;

        setChatInput('');
        setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
        setIsLoading(true);

        try {
            const history: { question: string; answer: string }[] = [];
            let currentPair: { question?: string; answer?: string } = {};

            messages.forEach((m) => {
                if (m.role === 'user') {
                    currentPair.question = m.content;
                } else if (m.role === 'assistant' && currentPair.question) {
                    currentPair.answer = m.content;
                    history.push(currentPair as { question: string; answer: string });
                    currentPair = {};
                }
            });

            const response = await axios.post('/share-chat/2/message', {
                question: messageToSend,
                history: history.slice(-5),
            });

            setMessages(prev => [...prev, { role: 'assistant', content: response.data.answer }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Извините, произошла ошибка при получении ответа. Попробуйте позже.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const tariffs: Tariff[] = [
        {
            name: 'Пробный',
            price: 50,
            period: 'за 1 день',
            description: 'Попробуйте бота на один день.',
            features: [
                'Доступ к боту на 1 день',
                'Подключение к базе знаний',
                'Базовая поддержка',
            ],
            icon: Rocket,
            highlighted: false,
        },
        {
            name: 'Ежемесячный',
            price: 1950,
            period: 'в месяц',
            description: 'Оптимальный выбор для постоянной работы.',
            features: [
                'Безлимитная работа бота',
                'Подключение к базе знаний',
                'Приоритетная поддержка',
                'Регулярные обновления',
            ],
            icon: Calendar,
            highlighted: true,
        },
        {
            name: 'Годовой',
            price: 22000,
            period: 'в год',
            description: 'Максимальная выгода при оплате на год.',
            features: [
                'Безлимитная работа бота',
                'Подключение к базе знаний',
                'Премиум поддержка',
                'Экономия по сравнению с помесячной оплатой',
            ],
            icon: Crown,
            highlighted: false,
        },
    ];

    const hints = demoActions && demoActions.length > 0
        ? demoActions.filter(a => a.trim() !== '')
        : [
            "Как обучить бота?",
            "Какие форматы документов поддерживаются?",
            "Как встроить чат на сайт?"
        ];

    return (
        <div className="min-h-screen bg-background-dark text-text-primary-dark font-sans selection:bg-secondary/30 selection:text-text-primary-dark">
            <Head>
                <title>NeuralFlow — Industrial RAG & AI Orchestration</title>
                <meta name="description" content="Deploy advanced RAG pipelines and autonomous agents with industrial precision." />
            </Head>

            <Header auth={auth} />

            <main>
                <Hero />

                {/* Test Chat Section */}
                <section id="demo" className="py-24 bg-surface-dark/50">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-serif text-text-primary-dark sm:text-5xl mb-12">
                            Interactive Core <span className="text-secondary">Preview</span>
                        </h2>
                        <div className="relative rounded-2xl glass p-7 min-h-[400px] flex flex-col shadow-2xl border-white/5">
                            <div
                                ref={chatContainerRef}
                                className="flex flex-col gap-4 flex-1 overflow-y-auto mb-4 max-h-[500px] pr-2 custom-scrollbar"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl gold-gradient text-background-dark mb-6 shrink-0 shadow-lg shadow-secondary/20 mx-auto">
                                    <MessageSquare className="h-6 w-6" />
                                </div>

                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                    >
                                        <div className={`flex max-w-[85%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                                                msg.role === 'user'
                                                    ? 'bg-white/10 text-text-secondary-dark border-white/5'
                                                    : 'bg-secondary/10 text-secondary border-secondary/20'
                                            }`}>
                                                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                                            </div>
                                            <div className={`p-4 rounded-2xl text-sm sm:text-base text-left border shadow-xl ${
                                                msg.role === 'user'
                                                    ? 'bg-secondary text-background-dark border-secondary rounded-tr-none font-medium'
                                                    : 'glass text-text-primary-dark border-white/10 rounded-tl-none'
                                            }`}>
                                                {msg.role === 'user' ? (
                                                    msg.content
                                                ) : (
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
                                                            {msg.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="glass text-text-secondary-dark p-4 rounded-2xl rounded-tl-none border-white/5 flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                                            <span className="text-sm">Neural Engine processing...</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-4 border-t border-white/5">
                                <form onSubmit={handleSendMessage} className="relative group flex gap-3">
                                    <div className="relative flex-grow">
                                        <input
                                            id="2"
                                            type="text"
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            placeholder="Введите ваш запрос..."
                                            className="w-full rounded-xl bg-background-dark/50 border-white/10 py-4 pl-4 pr-12 text-text-primary-dark focus:border-secondary focus:ring-secondary shadow-sm transition-all placeholder:text-text-secondary-dark/50"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !chatInput.trim()}
                                        className="h-14 w-14 shrink-0 flex items-center justify-center rounded-xl gold-gradient text-background-dark hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-secondary/20"
                                    >
                                        <ArrowRight className="h-6 w-6" />
                                    </button>
                                </form>
                                <div className="mt-4 flex flex-wrap justify-center gap-2">
                                    {hints.map((hint) => (
                                        <button
                                            key={hint}
                                            onClick={() => handleSendMessage(undefined, hint)}
                                            className="rounded-full glass px-4 py-1.5 text-xs font-medium text-text-secondary-dark border-white/5 hover:border-secondary hover:text-text-primary-dark transition-all shadow-sm"
                                            disabled={isLoading}
                                        >
                                            {hint}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-background-dark overflow-hidden">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
                            <div>
                                <h2 className="text-3xl font-serif text-text-primary-dark sm:text-5xl">
                                    Industrial Knowledge <span className="text-secondary">Synthesis</span>
                                </h2>
                                <p className="mt-6 text-lg leading-8 text-text-secondary-dark">
                                    Our Neural Engine orchestrates data from diverse industrial sources, creating a unified knowledge graph for precise RAG operations.
                                </p>
                                <dl className="mt-10 space-y-8">
                                    <div className="relative pl-16">
                                        <dt className="text-base font-bold leading-7 text-text-primary-dark">
                                            <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl gold-gradient text-background-dark shadow-lg shadow-secondary/20">
                                                <Globe className="h-6 w-6" />
                                            </div>
                                            Network Scanning
                                        </dt>
                                        <dd className="mt-2 text-base leading-7 text-text-secondary-dark">
                                            Autonomous discovery and indexing of technical documentation and internal networks.
                                        </dd>
                                    </div>
                                    <div className="relative pl-16">
                                        <dt className="text-base font-bold leading-7 text-text-primary-dark">
                                            <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl glass text-secondary border-white/10">
                                                <Mic className="h-6 w-6" />
                                            </div>
                                            Voice Protocols
                                        </dt>
                                        <dd className="mt-2 text-base leading-7 text-text-secondary-dark">
                                            Real-time transcription and semantic analysis of industrial voice logs.
                                        </dd>
                                    </div>
                                    <div className="relative pl-16">
                                        <dt className="text-base font-bold leading-7 text-text-primary-dark">
                                            <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl glass text-secondary border-white/10">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            Vault Indexing
                                        </dt>
                                        <dd className="mt-2 text-base leading-7 text-text-secondary-dark">
                                            Secure ingestion of complex technical formats (PDF, CAD metadata, Schematics).
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                            <div className="relative">
                                <div className="aspect-square rounded-2xl glass flex items-center justify-center p-8 border-white/5">
                                     <div className="grid grid-cols-2 gap-4 w-full">
                                         <div className="h-32 glass rounded-2xl shadow-sm border-white/5 p-4 flex flex-col justify-between group hover:border-secondary/30 transition-colors">
                                             <FileText className="text-secondary h-8 w-8" />
                                             <span className="text-[10px] font-bold text-text-secondary-dark uppercase tracking-widest">Vault</span>
                                         </div>
                                         <div className="h-32 gold-gradient rounded-2xl shadow-lg p-4 flex flex-col justify-between text-background-dark translate-y-8">
                                             <Globe className="h-8 w-8" />
                                             <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Network</span>
                                         </div>
                                         <div className="h-32 glass rounded-2xl shadow-sm border-white/5 p-4 flex flex-col justify-between -translate-y-4 group hover:border-secondary/30 transition-colors">
                                             <Mic className="text-secondary h-8 w-8" />
                                             <span className="text-[10px] font-bold text-text-secondary-dark uppercase tracking-widest">Voice</span>
                                         </div>
                                         <div className="h-32 glass rounded-2xl shadow-sm border-white/5 p-4 flex flex-col justify-between translate-y-4 group hover:border-secondary/30 transition-colors">
                                             <MessageSquare className="text-secondary h-8 w-8" />
                                             <span className="text-[10px] font-bold text-text-secondary-dark uppercase tracking-widest">Sync</span>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <DataSync />

                <TechStack />

                <SetupProcess />

                <UseCases />

                {/* Tariffs Section */}
                <section id="pricing" className="py-24 bg-surface-dark/30">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-serif text-text-primary-dark sm:text-5xl">Neural <span className="text-secondary">Subscription</span> Nodes</h2>
                            <p className="mt-4 text-lg text-text-secondary-dark">Scale your intelligence with industrial-grade protocols.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {tariffs.map((tariff) => {
                                const Icon = tariff.icon;
                                return (
                                    <div
                                        key={tariff.name}
                                        className={`relative flex flex-col rounded-2xl glass p-7 transition-all duration-300 hover:scale-[1.02] group overflow-hidden ${
                                            tariff.highlighted
                                                ? 'ring-2 ring-secondary border-transparent scale-105 z-10'
                                                : 'border-white/5'
                                        }`}
                                    >
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 gold-gradient" />
                                        <div className="relative z-10 flex flex-col h-full">
                                        {tariff.highlighted && (
                                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full gold-gradient px-4 py-1 text-[10px] font-bold text-background-dark uppercase tracking-widest z-20">
                                                Optimized
                                            </span>
                                        )}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className={`p-3 rounded-xl ${tariff.highlighted ? 'gold-gradient text-background-dark' : 'glass text-secondary border-white/10'}`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-text-primary-dark">{tariff.name}</h3>
                                        </div>
                                        <div className="mb-6">
                                            <span className="text-4xl font-serif text-text-primary-dark">{tariff.price} ₽</span>
                                            <span className="text-text-secondary-dark ml-2">/{tariff.period.includes('день') ? 'day' : tariff.period.includes('месяц') ? 'month' : 'year'}</span>
                                        </div>
                                        <p className="text-sm text-text-secondary-dark mb-8">{tariff.description}</p>
                                        <ul className="space-y-4 mb-10 flex-1">
                                            {tariff.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-3 text-sm text-text-secondary-dark">
                                                    <Check className="h-5 w-5 text-secondary shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            className={`w-full py-4 rounded-xl font-bold transition-all active:scale-95 ${
                                                tariff.highlighted
                                                    ? 'gold-gradient text-background-dark shadow-lg shadow-secondary/20'
                                                    : 'glass text-text-primary-dark hover:bg-white/5 border-white/10'
                                            }`}
                                        >
                                            Initialize Node
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        </div>
                    </div>
                </section>

                <FAQ />

                {/* CTA Section */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="relative isolate overflow-hidden bg-surface-dark px-6 py-24 shadow-2xl rounded-2xl sm:px-24 xl:py-32 border border-white/5">
                            <h2 className="mx-auto max-w-2xl text-center text-3xl font-serif text-text-primary-dark sm:text-5xl">
                                Ready to Orchestrate <br /> <span className="text-secondary">Intelligence?</span>
                            </h2>
                            <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-8 text-text-secondary-dark">
                                Deploy your first Neural Agent in less than 5 minutes. No complex configuration required.
                            </p>
                            <div className="mt-10 flex justify-center gap-x-6 relative z-10">
                                <Link
                                    href={route('register')}
                                    className="rounded-xl gold-gradient px-8 py-4 text-lg font-bold text-background-dark shadow-xl transition-all hover:scale-105 active:scale-95"
                                >
                                    Initialise System
                                </Link>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
                                <div className="absolute top-0 left-0 w-full h-full bg-secondary/5 blur-[120px] rounded-full" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-background-dark border-t border-white/5 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center shadow-md">
                                <Zap className="text-background-dark w-5 h-5 fill-background-dark" />
                            </div>
                            <span className="text-lg font-serif tracking-tight text-text-primary-dark">NeuralFlow</span>
                        </div>
                        <p className="text-sm text-text-secondary-dark">
                            &copy; {new Date().getFullYear()} NeuralFlow Engine. Industrial Grade Intelligence.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-text-secondary-dark hover:text-secondary transition-colors">
                                <Globe className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-text-secondary-dark hover:text-secondary transition-colors">
                                <MessageSquare className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
