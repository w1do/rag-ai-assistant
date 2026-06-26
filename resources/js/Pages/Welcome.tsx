import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Check, Rocket, Calendar, Crown, MessageSquare, Mic, FileText, Globe, ArrowRight, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import FAQ from '@/Components/FAQ';
import UseCases from '@/Components/UseCases';
import SetupProcess from '@/Components/SetupProcess';
import TechStack from '@/Components/TechStack';
import DataSync from '@/Components/DataSync';

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
    const chatContainerRef = useRef<HTMLDivElement>(null);

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
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Head>
                <title>BotSync — ИИ чат-боты для бизнеса и общения онлайн</title>
                <meta name="description" content="Обучите своего AI-ассистента за 5 минут. Чат с ИИ, нейросеть для бизнеса, RAG-системы и умные боты для общения онлайн бесплатно на русском." />
                <meta name="keywords" content="ии онлайн, чат ии, бот чат, искусственный интеллект онлайн, общение с ии, нейросеть чат, ии для бизнеса, rag системы, чат бот ии бесплатно" />
            </Head>

            {/* Header */}
            <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">BotSync</span>
                    </div>
                    <nav className="flex items-center gap-6">
                        <Link
                            href={route('chats.index')}
                            className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            Маркетплейс чатов
                        </Link>
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                Панель управления
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    Войти
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
                                >
                                    Начать бесплатно
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="pt-16">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-24 sm:py-32">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.50),white)]" />
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                            ИИ чат-боты для бизнеса: обучите своего ассистента за 5 минут
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                            Загружайте документы, отправляйте ссылки или записывайте голосовые сообщения. Ваш персональный бот с искусственным интеллектом будет знать всё о вашем бизнесе. Лучший ИИ чат для общения и решения задач.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href={route('register')}
                                className="rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
                            >
                                Создать ассистента
                            </Link>
                            <a href="#demo" className="text-lg font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
                                Попробовать демо <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Test Chat Section */}
                <section id="demo" className="py-24 bg-gray-50">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-12">
                            Попробуйте наш чат с ИИ онлайн бесплатно
                        </h2>
                        <div className="relative rounded-2xl bg-white p-6 shadow-2xl shadow-blue-100 border border-gray-100 min-h-[400px] flex flex-col">
                            <div 
                                ref={chatContainerRef}
                                className="flex flex-col gap-4 flex-1 overflow-y-auto mb-4 max-h-[500px] pr-2 custom-scrollbar"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-2 shrink-0">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                
                                {messages.map((msg, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`p-4 rounded-2xl text-sm sm:text-base max-w-[85%] border ${
                                            msg.role === 'user' 
                                                ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                                                : 'bg-gray-50 text-gray-700 border-gray-100 rounded-tl-none'
                                        }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-50 text-gray-400 p-4 rounded-2xl rounded-tl-none border border-gray-100 flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span className="text-sm">Бот печатает...</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-50">
                                <form onSubmit={handleSendMessage} className="relative group">
                                    <input
                                        id="2"
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Введите ваш вопрос..."
                                        className="w-full rounded-xl border-gray-200 py-4 pl-4 pr-12 text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                                        disabled={isLoading}
                                    />
                                    <button 
                                        type="submit"
                                        disabled={isLoading || !chatInput.trim()}
                                        className="absolute right-2 top-2 bottom-2 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ArrowRight className="h-5 w-5" />
                                    </button>
                                </form>
                                <div className="mt-4 flex flex-wrap justify-center gap-2">
                                    {hints.map((hint) => (
                                        <button
                                            key={hint}
                                            onClick={() => handleSendMessage(undefined, hint)}
                                            className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
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
                <section className="py-24 bg-white overflow-hidden">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                    Обучайте своих чат-ботов на базе знаний RAG
                                </h2>
                                <p className="mt-6 text-lg leading-8 text-gray-600">
                                    Наш сервис использует современные RAG системы (Retrieval-Augmented Generation), позволяя быстро собрать базу знаний для вашего ИИ из любых источников. Идеально для бизнеса и автоматизации общения.
                                </p>
                                <dl className="mt-10 space-y-8">
                                    <div className="relative pl-16">
                                        <dt className="text-base font-semibold leading-7 text-gray-900">
                                            <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-100">
                                                <Globe className="h-6 w-6" />
                                            </div>
                                            Сайты конкурентов
                                        </dt>
                                        <dd className="mt-2 text-base leading-7 text-gray-600">
                                            Просто укажите URL, и наш бот проанализирует контент для ответов на вопросы.
                                        </dd>
                                    </div>
                                    <div className="relative pl-16">
                                        <dt className="text-base font-semibold leading-7 text-gray-900">
                                            <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-100">
                                                <Mic className="h-6 w-6" />
                                            </div>
                                            Голосовые сообщения
                                        </dt>
                                        <dd className="mt-2 text-base leading-7 text-gray-600">
                                            Наговорите инструкции голосом — система автоматически транскрибирует и запомнит информацию.
                                        </dd>
                                    </div>
                                    <div className="relative pl-16">
                                        <dt className="text-base font-semibold leading-7 text-gray-900">
                                            <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-100">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            Загрузка документов
                                        </dt>
                                        <dd className="mt-2 text-base leading-7 text-gray-600">
                                            PDF, Word, Excel — любые форматы документов станут частью интеллекта вашего ассистента.
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                            <div className="relative">
                                <div className="aspect-square rounded-3xl bg-blue-50 flex items-center justify-center p-8">
                                     <div className="grid grid-cols-2 gap-4 w-full">
                                         <div className="h-32 bg-white rounded-2xl shadow-sm border border-blue-100 p-4 flex flex-col justify-between">
                                             <FileText className="text-blue-600 h-8 w-8" />
                                             <span className="text-xs font-bold text-gray-400">DOCUMENTS</span>
                                         </div>
                                         <div className="h-32 bg-blue-600 rounded-2xl shadow-lg p-4 flex flex-col justify-between text-white translate-y-8">
                                             <Globe className="h-8 w-8" />
                                             <span className="text-xs font-bold opacity-80">URL SCANNER</span>
                                         </div>
                                         <div className="h-32 bg-white rounded-2xl shadow-sm border border-blue-100 p-4 flex flex-col justify-between -translate-y-4">
                                             <Mic className="text-blue-600 h-8 w-8" />
                                             <span className="text-xs font-bold text-gray-400">VOICE AI</span>
                                         </div>
                                         <div className="h-32 bg-white rounded-2xl shadow-sm border border-blue-100 p-4 flex flex-col justify-between translate-y-4">
                                             <MessageSquare className="text-blue-600 h-8 w-8" />
                                             <span className="text-xs font-bold text-gray-400">OMNICHANNEL</span>
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
                <section className="py-24 bg-gray-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Готовые тарифные планы</h2>
                            <p className="mt-4 text-lg text-gray-600">Выберите оптимальный вариант для вашего бизнеса</p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {tariffs.map((tariff) => {
                                const Icon = tariff.icon;
                                return (
                                    <div
                                        key={tariff.name}
                                        className={`relative flex flex-col rounded-3xl bg-white p-8 shadow-xl transition-all hover:-translate-y-2 ${
                                            tariff.highlighted
                                                ? 'ring-2 ring-blue-600 border-transparent scale-105 z-10'
                                                : 'border border-gray-100'
                                        }`}
                                    >
                                        {tariff.highlighted && (
                                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white uppercase tracking-widest">
                                                Популярный
                                            </span>
                                        )}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className={`p-3 rounded-2xl ${tariff.highlighted ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">{tariff.name}</h3>
                                        </div>
                                        <div className="mb-6">
                                            <span className="text-4xl font-extrabold text-gray-900">{tariff.price} ₽</span>
                                            <span className="text-gray-500 ml-2">{tariff.period}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-8">{tariff.description}</p>
                                        <ul className="space-y-4 mb-10 flex-1">
                                            {tariff.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-3 text-sm text-gray-600">
                                                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            className={`w-full py-4 rounded-xl font-bold transition-all active:scale-95 ${
                                                tariff.highlighted
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                                                    : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                        >
                                            Выбрать тариф
                                        </button>
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
                        <div className="relative isolate overflow-hidden bg-blue-600 px-6 py-24 shadow-2xl rounded-3xl sm:px-24 xl:py-32">
                            <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Создайте своего ассистент-бота уже через 5 минут
                            </h2>
                            <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-8 text-blue-100">
                                Он уже готов отвечать на ваши вопросы и помогать вашим клиентам. Начните прямо сейчас.
                            </p>
                            <div className="mt-10 flex justify-center gap-x-6">
                                <Link
                                    href={route('register')}
                                    className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-xl transition-all hover:bg-blue-50 hover:scale-105 active:scale-95"
                                >
                                    Попробовать бесплатно
                                </Link>
                            </div>
                            <svg
                                viewBox="0 0 1024 1024"
                                className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
                                aria-hidden="true"
                            >
                                <circle cx="512" cy="512" r="512" fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)" fillOpacity="0.7" />
                                <defs>
                                    <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                                        <stop stopColor="#7775D6" />
                                        <stop offset={1} stopColor="#E935C1" />
                                    </radialGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-gray-900">BotSync</span>
                        </div>
                        <p className="text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} BotSync. Все права защищены.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                <Globe className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                <MessageSquare className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
