import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import Tips from '@/Components/Tips';
import VoiceRecorder from '@/Components/VoiceRecorder';
import InputHint from '@/Components/InputHint';
import LimitReachedCard from '@/Components/LimitReachedCard';
import { ChangeEvent, useEffect, useState, FormEvent } from 'react';
import { Bot, MessageSquare, Pencil, Trash2, FileText, Mic, Globe, Code, Plus, ArrowRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Chunk {
    id: number;
    content: string;
}

interface Knowledge {
    id: number;
    type: 'document' | 'voice' | 'website' | 'api';
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
    const { auth } = usePage().props as any;
    const plan = auth.plan;
    const isStarter = plan?.slug === 'start';
    const websiteLimit = plan?.limits?.links_count ?? 3;
    const voiceLimit = plan?.limits?.voice_count ?? 1;

    const [activeTab, setActiveTab] = useState<'document' | 'voice' | 'website' | 'api'>(isStarter ? 'website' : 'document');

    const websiteCount = (assistant.knowledge || []).filter(k => k.type === 'website').length;
    const voiceCount = (assistant.knowledge || []).filter(k => k.type === 'voice').length;

    const canAddWebsite = websiteLimit === -1 || websiteCount < websiteLimit;
    const canAddVoice = voiceLimit === -1 || voiceCount < voiceLimit;

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

    const handleVoiceRecording = (blob: Blob) => {
        const extension = blob.type.includes('mp4') ? 'm4a' : (blob.type.includes('webm') ? 'webm' : 'mp3');
        const file = new File([blob], `recording.${extension}`, { type: blob.type });
        audioForm.setData('audio', file);
        audioForm.post(route('assistants.upload-audio', assistant.id), {
            forceFormData: true,
        });
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

    const assistantTips = [
        'Загрузите PDF или DOCX файлы, чтобы ассистент мог отвечать на вопросы по вашим документам.',
        'Добавьте ссылку на ваш сайт, и ассистент автоматически проанализирует его содержимое.',
        'Протестируйте ассистента в чате, прежде чем встраивать его на сайт.',
    ];

    return (
        <AuthenticatedLayout
        >
            <Head title={`Ассистент: ${assistant.name}`} />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <Breadcrumbs items={[
                        { label: 'Ассистенты', href: route('assistants.index') },
                        { label: assistant.name }
                    ]} />

                    <Tips tips={assistantTips} />

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[2px] bg-primary-color text-black-color shadow-lg shadow-primary-color/20">
                                <Bot size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold uppercase tracking-tight text-white-color font-title">
                                    {assistant.name}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`inline-flex items-center gap-1.5 rounded-[2px] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                        assistant.status === 'ready' ? 'bg-primary-color/10 text-primary-color border border-primary-color/20' : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                                    }`}>
                                        <span className={`h-1.5 w-1.5 rounded-[1px] ${
                                            assistant.status === 'ready' ? 'bg-primary-color' : 'bg-amber-400'
                                        } ${assistant.status !== 'ready' ? 'animate-pulse' : ''}`} />
                                        {assistant.status}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                                        ID: {assistant.id}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href={route('assistants.edit', assistant.id)} className="theme-button style-2 !h-[48px]">
                                <span data-text="Правка">Правка</span>
                                <i><Pencil size={14} /></i>
                            </Link>
                            <Link href={route('share-chat.show', assistant.id)} className="theme-button style-1 !h-[48px]">
                                <span data-text="Чат">Чат</span>
                                <i><MessageSquare size={14} /></i>
                            </Link>
                            <button 
                                onClick={deleteAssistant}
                                className="p-3 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-[2px] transition-all"
                                title="Удалить ассистента"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-8 space-y-8">
                            <div className="bg-background-one border border-border-color-one rounded-three p-6 shadow-sm">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-[2px] bg-primary-color/10 text-primary-color">
                                        <FileText size={18} />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-tight text-white-color font-title">Описание ассистента</h3>
                                </div>
                                {assistant.description ? (
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                                        {assistant.description}
                                    </p>
                                ) : (
                                    <p className="text-sm italic text-text-secondary opacity-50">Описание не задано — добавьте контекст, чтобы ассистент лучше понимал ваши задачи.</p>
                                )}
                            </div>

                            <div className="bg-background-one border border-border-color-one rounded-three overflow-hidden shadow-sm">
                                <div className="p-6">
                                    <div className="flex border-b border-border-color-one mb-8 overflow-x-auto no-scrollbar">
                                        {[
                                            { id: 'document', label: 'Документы', icon: <FileText size={16} /> },
                                            { id: 'voice', label: 'Голосовые', icon: <Mic size={16} /> },
                                            { id: 'website', label: 'Сайты', icon: <Globe size={16} /> },
                                            { id: 'api', label: 'API', icon: <Code size={16} /> },
                                        ].map((tab) => {
                                            const isBlocked = isStarter && (tab.id === 'document' || tab.id === 'api');
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => !isBlocked && setActiveTab(tab.id as any)}
                                                    className={cn(
                                                        "flex items-center gap-2 px-6 py-4 font-bold text-xs uppercase tracking-widest transition-all border-b-2 relative -mb-px whitespace-nowrap",
                                                        activeTab === tab.id
                                                            ? "border-primary-color text-primary-color"
                                                            : "border-transparent text-text-secondary hover:text-white-color hover:border-white-color/20",
                                                        isBlocked && "opacity-50 cursor-not-allowed"
                                                    )}
                                                >
                                                    {tab.icon}
                                                    {tab.label}
                                                    {isBlocked && <span className="text-[8px] bg-amber-400 text-black px-1 rounded-[1px] ml-1">PRO</span>}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="min-h-[200px]">
                                        {isStarter && (activeTab === 'document' || activeTab === 'api') ? (
                                            <div className="py-10">
                                                <LimitReachedCard 
                                                    title="Доступно только в PRO" 
                                                    description="Загрузка документов и использование API доступны только в более продвинутых тарифах. Обновите подписку, чтобы расширить возможности вашего ассистента."
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                {activeTab === 'document' && (
                                            <div className="space-y-6">
                                                <div className="flex flex-col sm:flex-row justify-between items-center p-6 border border-border-color-one rounded-[2px] bg-extra-color gap-4">
                                                    <div>
                                                        <h4 className="font-bold text-white-color uppercase tracking-tight">Загрузить документ</h4>
                                                        <p className="text-sm text-text-secondary">Поддерживаются PDF, DOCX, TXT</p>
                                                    </div>
                                                    <label className="theme-button style-1 !h-[48px] cursor-pointer min-w-[160px]">
                                                        <span data-text={docForm.processing ? 'Загрузка...' : 'Загрузить'}>
                                                            {docForm.processing ? 'Загрузка...' : 'Загрузить'}
                                                        </span>
                                                        <i><Plus size={16} /></i>
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
                                        )}

                                        {activeTab === 'voice' && (
                                            <div className="space-y-6">
                                                {!canAddVoice ? (
                                                    <LimitReachedCard 
                                                        title="Лимит аудио исчерпан" 
                                                        description={`Вы использовали лимит голосовых сообщений (${voiceLimit}) для тарифа "${plan?.name}". Обновите тариф, чтобы загружать больше голосовых данных.`}
                                                        buttonText="Расширить лимиты"
                                                    />
                                                ) : (
                                                    <>
                                                        <VoiceRecorder 
                                                            onRecordingComplete={handleVoiceRecording} 
                                                            isUploading={audioForm.processing}
                                                        />

                                                        <div className="flex flex-col sm:flex-row justify-between items-center p-6 border border-border-color-one rounded-[2px] bg-extra-color gap-4">
                                                            <div>
                                                                <h4 className="font-bold text-white-color uppercase tracking-tight">Или загрузите файл</h4>
                                                                <p className="text-sm text-text-secondary">Поддерживаются MP3, WAV, M4A</p>
                                                            </div>
                                                            <label className="theme-button style-1 !h-[48px] cursor-pointer min-w-[160px]">
                                                                <span data-text={audioForm.processing ? 'Загрузка...' : 'Загрузить'}>
                                                                    {audioForm.processing ? 'Загрузка...' : 'Загрузить'}
                                                                </span>
                                                                <i><Mic size={16} /></i>
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="audio/*"
                                                                    onChange={uploadAudio}
                                                                    disabled={audioForm.processing}
                                                                />
                                                            </label>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'website' && (
                                            <div className="space-y-6">
                                                {!canAddWebsite ? (
                                                    <LimitReachedCard 
                                                        title="Лимит ссылок исчерпан" 
                                                        description={`Вы добавили максимально доступное количество ссылок (${websiteLimit}) для тарифа "${plan?.name}". Перейдите на тариф PRO для безлимитного анализа сайтов.`}
                                                        buttonText="Расширить лимиты"
                                                    />
                                                ) : (
                                                    <div className="p-6 border border-border-color-one rounded-[2px] bg-extra-color">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h4 className="font-bold text-white-color uppercase tracking-tight">Анализ сайта</h4>
                                                                <p className="text-sm text-text-secondary">Укажите URL для обучения ассистента</p>
                                                            </div>
                                                            {isStarter && (
                                                                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                                                                    Лимит: {websiteCount} / {websiteLimit}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <form onSubmit={submitUrl} className="flex flex-col gap-2">
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="url"
                                                                    value={urlForm.data.url}
                                                                    onChange={(e) => urlForm.setData('url', e.target.value)}
                                                                    className="flex-grow bg-background-one border-border-color-one text-white-color rounded-[2px] px-4 py-3 text-sm focus:border-primary-color focus:ring-primary-color"
                                                                    placeholder="https://example.com"
                                                                    required
                                                                />
                                                                <button disabled={urlForm.processing} className="theme-button style-1 !h-[48px] !w-[48px] !p-0">
                                                                    <span data-text="+"><Plus size={18} /></span>
                                                                </button>
                                                            </div>
                                                            <InputHint message="Укажите URL — ассистент проанализирует страницу и добавит её в базу знаний." />
                                                        </form>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'api' && (
                                            <div className="space-y-6">
                                                <div className="p-6 border border-border-color-one rounded-[2px] bg-extra-color">
                                                    <h4 className="font-bold text-white-color uppercase tracking-tight mb-2">Интеграция через API</h4>
                                                    <p className="text-sm text-text-secondary mb-6">Отправляйте данные для обучения напрямую через эндпоинт.</p>
                                                    
                                                    <div className="space-y-6">
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Эндпоинт (POST)</label>
                                                            <div className="flex items-center gap-3 bg-black-color rounded-[2px] p-3 border border-border-color-one">
                                                                <code className="text-xs font-mono text-primary-color flex-1 break-all">
                                                                    {typeof window !== 'undefined' ? window.location.origin : ''}/api/v1/callback
                                                                </code>
                                                                <button 
                                                                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/api/v1/callback`)}
                                                                    className="text-text-secondary hover:text-white-color p-2 transition-colors"
                                                                    title="Копировать"
                                                                >
                                                                    <Code size={16} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Пример FAQ</label>
                                                                <div className="bg-black-color rounded-[2px] p-4 border border-border-color-one overflow-x-auto">
                                                                    <pre className="text-[11px] font-mono text-primary-color/70">
                                                                    {`{
  "assistant_id": ${assistant.id},
  "name": "FAQ База",
  "chunks": [
    {
      "question": "Как?",
      "answer": "Так!"
    }
  ]
}`}
                                                                    </pre>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Пример данных</label>
                                                                <div className="bg-black-color rounded-[2px] p-4 border border-border-color-one overflow-x-auto">
                                                                    <pre className="text-[11px] font-mono text-primary-color/70">
                                                                    {`{
  "assistant_id": ${assistant.id},
  "name": "Каталог",
  "chunks": [
    {
      "title": "Товар",
      "price": "100$"
    }
  ]
}`}
                                                                    </pre>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                            </>
                                        )}

                                        <div className="mt-10">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-sm font-bold uppercase tracking-widest text-white-color">Список источников</h3>
                                                <span className="bg-primary-color text-black-color text-[10px] font-bold px-2 py-0.5 rounded-[1px]">
                                                    {(assistant.knowledge || []).filter(k => k.type === activeTab).length}
                                                </span>
                                            </div>
                                            
                                            {(assistant.knowledge || []).filter(k => k.type === activeTab).length === 0 ? (
                                                <div className="text-center py-12 border-2 border-dashed border-border-color-one rounded-[2px]">
                                                    <p className="text-text-secondary text-sm">Источников этого типа пока нет.</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-4">
                                                    {(assistant.knowledge || []).filter(k => k.type === activeTab).map((item) => (
                                                        <div key={item.id} className="p-5 bg-extra-color border border-border-color-one rounded-[2px] hover:border-primary-color/30 transition-all group">
                                                            <div className="flex justify-between items-start gap-4">
                                                                <div className="overflow-hidden">
                                                                    <h4 className="font-bold text-white-color truncate group-hover:text-primary-color transition-colors">
                                                                        {item.name || item.url || 'Безымянный источник'}
                                                                    </h4>
                                                                    {item.url && (
                                                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary-color hover:text-white-color mt-1 transition-colors">
                                                                            <Globe size={12} />
                                                                            {item.url}
                                                                            <ExternalLink size={10} />
                                                                        </a>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-3 shrink-0">
                                                                    <span className={cn(
                                                                        "text-[10px] px-2.5 py-0.5 rounded-[1px] font-bold uppercase tracking-wider border",
                                                                        item.status === 'ready' ? 'bg-primary-color/10 text-primary-color border-primary-color/20' : 
                                                                        item.status === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                        'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse'
                                                                    )}>
                                                                        {item.status}
                                                                    </span>
                                                                    
                                                                    <button 
                                                                        onClick={() => deleteKnowledge(item.id)}
                                                                        className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                                                                        title="Удалить"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {item.status === 'error' && item.metadata?.error && (
                                                                <div className="mt-3 text-[11px] text-red-400 bg-red-500/10 p-3 rounded-[2px] border border-red-500/20 font-mono">
                                                                    <strong>Error:</strong> {item.metadata.error}
                                                                </div>
                                                            )}

                                                            {item.content && (
                                                                <details className="mt-4 group/details">
                                                                    <summary className="text-xs font-bold uppercase tracking-widest text-text-secondary cursor-pointer hover:text-primary-color transition-colors list-none flex items-center gap-2">
                                                                        <div className="w-4 h-4 rounded-[1px] bg-border-color-one flex items-center justify-center group-hover/details:bg-primary-color group-hover/details:text-black-color transition-all">
                                                                            <Plus size={10} className="group-open/details:rotate-45 transition-transform" />
                                                                        </div>
                                                                        Контент
                                                                    </summary>
                                                                    <div className="mt-3 p-4 bg-black-color rounded-[2px] text-[13px] text-text-secondary leading-relaxed max-h-60 overflow-y-auto border border-border-color-one custom-scrollbar">
                                                                        {item.content}
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
                        </div>

                        <div className="md:col-span-4 space-y-8">
                            <div className="bg-background-one border border-border-color-one rounded-three p-6 shadow-sm">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-color/10 text-primary-color">
                                        <Bot size={18} />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-tight text-white-color font-title">Параметры</h3>
                                </div>
                                <dl className="space-y-4">
                                    <div className="flex items-center justify-between gap-4 py-2 border-b border-border-color-one/50">
                                        <dt className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">Стиль</dt>
                                        <dd>
                                            <span className="inline-flex rounded-[1px] bg-primary-color/10 border border-primary-color/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-color">
                                                {assistant.style}
                                            </span>
                                        </dd>
                                    </div>
                                    {assistant.brand_name && (
                                        <div className="flex items-center justify-between gap-4 py-2 border-b border-border-color-one/50">
                                            <dt className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">Бренд</dt>
                                            <dd className="text-sm font-bold text-white-color">{assistant.brand_name}</dd>
                                        </div>
                                    )}
                                    {assistant.phone && (
                                        <div className="flex items-center justify-between gap-4 py-2 border-b border-border-color-one/50">
                                            <dt className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">Телефон</dt>
                                            <dd className="text-sm font-bold text-white-color">{assistant.phone}</dd>
                                        </div>
                                    )}
                                    {assistant.social && Object.entries(assistant.social).some(([_, v]) => v) && (
                                        <div className="space-y-2 py-2">
                                            <dt className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">Соцсети</dt>
                                            <dd className="grid grid-cols-1 gap-2">
                                                {Object.entries(assistant.social).map(([key, value]) => (
                                                    value && (
                                                        <div key={key} className="flex items-center justify-between bg-extra-color p-2 rounded-[2px] border border-border-color-one">
                                                            <span className="text-[10px] uppercase font-bold text-text-secondary">{key}</span>
                                                            <span className="text-xs font-bold text-white-color truncate max-w-[150px]">{value}</span>
                                                        </div>
                                                    )
                                                ))}
                                            </dd>
                                        </div>
                                    )}
                                    {assistant.fallback && (
                                        <div className="py-2">
                                            <dt className="mb-2 text-[11px] font-bold uppercase tracking-widest text-text-secondary">Fallback ответ</dt>
                                            <dd className="rounded-[2px] bg-extra-color border border-border-color-one px-4 py-3 text-sm italic text-text-secondary leading-relaxed">
                                                "{assistant.fallback}"
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            <div className="bg-background-one border border-border-color-one rounded-three p-6 shadow-sm">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-color/10 text-primary-color">
                                        <Code size={18} />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-tight text-white-color font-title">Статистика</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-extra-color border border-border-color-one rounded-[2px] p-4 text-center">
                                        <p className="text-2xl font-bold text-white-color font-title">{(assistant.chunks || []).length}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mt-1">Чанков</p>
                                    </div>
                                    <div className="bg-extra-color border border-border-color-one rounded-[2px] p-4 text-center">
                                        <p className="text-2xl font-bold text-white-color font-title">{(assistant.knowledge || []).length}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mt-1">Источников</p>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-border-color-one">
                                    <Link 
                                        href={route('share-chat.show', assistant.id)}
                                        className="theme-button style-1 w-full"
                                    >
                                        <span data-text="Тестировать">Тестировать</span>
                                        <i><ArrowRight size={14} /></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
