import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Bot, Briefcase, MessageSquare, Users, Zap, Search, ArrowRight, Filter } from 'lucide-react';
import React, { useState, useMemo } from 'react';

interface Assistant {
    id: number;
    name: string;
    description: string | null;
    category: string;
    welcome_message: string | null;
}

/**
 * Страница маркетплейса чатов.
 * 
 * Отображает список всех доступных ИИ-ассистентов с фильтрацией по категориям.
 */
export default function Index({ auth, assistants = [] }: PageProps<{ assistants: Assistant[] }>) {
    const [selectedCategory, setSelectedCategory] = useState('Все');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['Все', 'ИИ чаты', 'Общение', 'Бизнес', 'RAG'];

    const filteredAssistants = useMemo(() => {
        return (assistants || []).filter(assistant => {
            const matchesCategory = selectedCategory === 'Все' || assistant.category === selectedCategory;
            const matchesSearch = assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 (assistant.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
            return matchesCategory && matchesSearch;
        });
    }, [assistants, selectedCategory, searchQuery]);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'ИИ чаты': return Bot;
            case 'Общение': return Users;
            case 'Бизнес': return Briefcase;
            case 'RAG': return Zap;
            default: return MessageSquare;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Head>
                <title>Маркетплейс ИИ чатов — BotSync</title>
                <meta name="description" content="Каталог лучших ИИ чатов для бизнеса, общения и RAG систем. Найдите подходящего ассистента или создайте своего." />
                <meta name="keywords" content="маркетплейс чатов, ии чаты, чат для бизнеса, общение с ии, каталог нейросетей, rag чат" />
            </Head>

            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                                <MessageSquare className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900">BotSync</span>
                        </Link>
                    </div>
                    <nav className="flex items-center gap-6">
                        <Link
                            href={route('chats.index')}
                            className="text-sm font-semibold text-blue-600 transition-colors"
                        >
                            Маркетплейс чатов
                        </Link>
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                Панель управления
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                Войти
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        Маркетплейс ИИ чатов
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                        Исследуйте разнообразие интеллектуальных ассистентов, адаптированных под ваши задачи: от простого общения до сложных бизнес-решений.
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => {
                            const IconComponent = getCategoryIcon(category);
                            return (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                                        selectedCategory === category
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400 hover:text-blue-600'
                                    }`}
                                >
                                    {category !== 'Все' && <IconComponent className="h-5 w-5" />}
                                    {category}
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Поиск ассистентов..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border-gray-200 py-3 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        />
                    </div>
                </div>

                {/* Assistants Grid */}
                {filteredAssistants.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredAssistants.map((assistant) => {
                            const IconComponent = getCategoryIcon(assistant.category);
                            return (
                                <div
                                    key={assistant.id}
                                    className="group relative flex flex-col rounded-[20px] bg-white p-7 shadow-md border border-gray-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg overflow-hidden"
                                >
                                    {/* Hover Gradient Background (3 colors as per cards.md) */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br from-[#151B27] via-[#C8A645] to-[#0C1019]" />
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="mb-6 flex items-center justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <IconComponent className="h-6 w-6" />
                                            </div>
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                                                {assistant.category}
                                            </span>
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold text-gray-900">{assistant.name}</h3>
                                        <p className="mb-8 text-sm text-gray-600 line-clamp-3 flex-1">
                                            {assistant.description || 'Интеллектуальный помощник, готовый ответить на ваши вопросы и помочь в решении повседневных задач.'}
                                        </p>
                                        <div className="mt-auto">
                                            <Link
                                                href={route('share-chat.show', assistant.id)}
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 py-3 text-sm font-bold text-gray-900 transition-all group-hover:bg-blue-600 group-hover:text-white"
                                            >
                                                Открыть чат
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-24 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                            <Filter className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Ничего не найдено</h3>
                        <p className="text-gray-500">Попробуйте изменить параметры фильтрации или поисковый запрос.</p>
                    </div>
                )}
            </main>

            {/* CTA Section */}
            <section className="py-24 bg-white border-t border-gray-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Не нашли подходящего помощника?
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                        Создайте своего собственного ИИ-ассистента за считанные минуты. Обучите его на своих данных и сделайте доступным для других.
                    </p>
                    <div className="mt-10">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
                        >
                            Создать своего бота
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} BotSync. Маркетплейс ИИ чатов для бизнеса и общения.
                    </p>
                </div>
            </footer>
        </div>
    );
}