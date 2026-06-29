import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Bot, MessageSquare, Sparkles, User, Calendar, Info, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import SectionHeader from '@/Components/UI/SectionHeader';

interface Message {
    id: number;
    question: string;
    answer: string;
    created_at: string;
    user?: {
        name: string;
    };
}

interface Assistant {
    id: number;
    name: string;
    description: string | null;
}

interface Props {
    assistant: Assistant;
    history: Message[];
}

export default function AssistantChat({ assistant, history }: Props) {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState('О чем спрашивали последние 10 пользователей?');

    const fetchSummary = async () => {
        setLoading(true);
        try {
            const response = await axios.get(route('assistants.dialogues.summary', assistant.id));
            setSummary(response.data.summary);
        } catch (error) {
            console.error(error);
            setSummary('Ошибка при получении саммари.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Диалоги: ${assistant.name}`} />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <Breadcrumbs items={[
                        { label: 'Ассистенты', href: route('assistants.index') },
                        { label: assistant.name, href: route('assistants.show', assistant.id) },
                        { label: 'Диалоги' }
                    ]} />

                    <SectionHeader 
                        title="История диалогов" 
                        icon={MessageSquare}
                        className="!mb-10"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Список сообщений */}
                        <div className="lg:col-span-8 space-y-6">
                            {history.length === 0 ? (
                                <div className="bg-background-one border border-border-color-one rounded-three p-12 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-extra-color text-text-secondary">
                                        <MessageSquare size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white-color font-title uppercase">Нет диалогов</h3>
                                    <p className="mt-2 text-text-secondary">Пока никто не общался с этим ассистентом.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {history.map((msg) => (
                                        <div key={msg.id} className="space-y-4">
                                            {/* Сообщение пользователя */}
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] bg-extra-color text-text-secondary border border-border-color-one">
                                                    <User size={20} />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white-color">
                                                            {msg.user?.name || 'Пользователь'}
                                                        </span>
                                                        <span className="text-[9px] text-text-secondary flex items-center gap-1">
                                                            <Calendar size={10} />
                                                            {new Date(msg.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="bg-extra-color border border-border-color-one rounded-three p-4 text-sm text-text-secondary leading-relaxed">
                                                        {msg.question}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ответ ассистента */}
                                            <div className="flex items-start gap-4 pl-8 sm:pl-12">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] bg-primary-color text-black-color shadow-lg shadow-primary-color/20">
                                                    <Bot size={20} />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary-color">
                                                            {assistant.name}
                                                        </span>
                                                    </div>
                                                    <div className="bg-background-one border border-primary-color/20 rounded-three p-4 text-sm text-white-color leading-relaxed shadow-sm">
                                                        {msg.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Боковая панель с саммари */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-background-one border border-border-color-one rounded-three p-6 sticky top-24">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-[2px] bg-primary-color/10 text-primary-color">
                                        <Sparkles size={18} />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-tight text-white-color font-title">Аналитика диалогов</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                                            Промпт для анализа
                                        </label>
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            className="w-full bg-extra-color border border-border-color-one text-white-color rounded-[2px] p-4 text-sm focus:border-primary-color focus:ring-primary-color min-h-[100px] resize-none"
                                            placeholder="Введите промпт..."
                                        />
                                    </div>

                                    <button
                                        onClick={fetchSummary}
                                        disabled={loading || history.length === 0}
                                        className="theme-button style-1 w-full !h-[48px]"
                                    >
                                        <span data-text="Показать саммари">Показать саммари</span>
                                        <i>{loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}</i>
                                    </button>

                                    {summary && (
                                        <div className="mt-6 p-4 bg-primary-color/5 border border-primary-color/20 rounded-three animate-in fade-in slide-in-from-top-4">
                                            <div className="flex items-center gap-2 mb-2 text-primary-color">
                                                <Info size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Результат анализа</span>
                                            </div>
                                            <p className="text-sm text-white-color leading-relaxed">
                                                {summary}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {!summary && !loading && history.length > 0 && (
                                        <p className="text-[11px] text-text-secondary italic text-center">
                                            Нажмите на кнопку выше, чтобы проанализировать последние 10 вопросов пользователей.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
