import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputHint from '@/Components/InputHint';
import Breadcrumbs from '@/Components/Breadcrumbs';
import Tips from '@/Components/Tips';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { Mic, MicOff, Link2, Upload, Code, MessageSquare, Trash2, Pencil, ArrowRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Краткое представление ассистента для списка на странице обзора.
 */
interface Assistant {
    id: number;
    name: string;
    description: string;
    status: string;
    created_at: string;
}

interface Props {
    assistants: Assistant[];
}

/**
 * Возвращает человекочитаемую подпись и цветовую схему бейджа статуса ассистента.
 *
 * @param status Сырое значение статуса ассистента из базы данных.
 * @return Объект с подписью, классами фона/текста и цветом индикатора.
 */
function statusMeta(status: string): {
    label: string;
    badge: string;
    dot: string;
} {
    switch (status) {
        case 'ready':
            return {
                label: 'Готов к работе',
                badge: 'bg-primary-color/10 text-primary-color border border-primary-color/20',
                dot: 'bg-primary-color',
            };
        case 'error':
            return {
                label: 'Ошибка',
                badge: 'bg-red-500/10 text-red-500 border border-red-500/20',
                dot: 'bg-red-500',
            };
        case 'processing':
            return {
                label: 'Обработка',
                badge: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
                dot: 'bg-blue-500',
            };
        default:
            return {
                label: 'Черновик',
                badge: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
                dot: 'bg-amber-500',
            };
    }
}

/**
 * Строка-карточка одного ассистента в списке.
 *
 * Содержит аватар, краткую информацию, статус, бейджи и набор действий:
 * запись с микрофона, добавление ссылки через модальное окно, загрузку
 * документа, переход в чат и получение кода для встраивания виджета на сайт.
 */
function AssistantCard({ assistant }: { assistant: Assistant }) {
    const [showEmbed, setShowEmbed] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const docForm = useForm<{ document: File | null }>({ document: null });
    const audioForm = useForm<{ audio: File | null }>({ audio: null });
    const urlForm = useForm({ url: '' });

    const meta = statusMeta(assistant.status);

    const embedCode = `<script
  src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget.js"
  data-assistant-id="${assistant.id}"
  data-position="bottom-right"
  async>
</script>`;

    const deleteAssistant = () => {
        if (confirm('Вы уверены, что хотите удалить этого ассистента и все связанные данные из базы знаний?')) {
            router.delete(route('assistants.destroy', assistant.id));
        }
    };

    const onPickDocument = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        docForm.setData('document', file);
        docForm.post(route('assistants.upload-document', assistant.id), {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => docForm.reset(),
        });
    };

    const submitUrl = (e: FormEvent) => {
        e.preventDefault();
        urlForm.post(route('assistants.add-url', assistant.id), {
            preserveScroll: true,
            onSuccess: () => {
                urlForm.reset();
                setShowLinkModal(false);
            },
        });
    };

    const toggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            audioChunksRef.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
                audioForm.setData('audio', file);
                audioForm.post(route('assistants.upload-audio', assistant.id), {
                    forceFormData: true,
                    preserveScroll: true,
                    onFinish: () => audioForm.reset(),
                });
                stream.getTracks().forEach((track) => track.stop());
                setIsRecording(false);
            };

            mediaRecorderRef.current = recorder;
            recorder.start();
            setIsRecording(true);
        } catch {
            alert('Не удалось получить доступ к микрофону. Проверьте разрешения браузера.');
        }
    };

    const copyEmbed = async () => {
        try {
            await navigator.clipboard.writeText(embedCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div className="pricing-item group flex h-full flex-col">
            <div className="pricing-top relative">
                <div className="mb-4 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider ${meta.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${meta.dot} animate-pulse`} />
                        {meta.label}
                    </span>
                    <span className="text-[9px] sm:text-[11px] font-bold text-text-secondary">
                        ID: {assistant.id}
                    </span>
                </div>
                
                <div className="mx-auto mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-[2px] bg-primary-color text-lg sm:text-2xl font-bold text-black-color shadow-lg shadow-primary-color/20">
                    {(assistant.name || 'A').charAt(0).toUpperCase()}
                </div>
                
                <h3 className="mb-2 truncate text-sm sm:text-xl font-bold text-white-color group-hover:text-primary-color transition-colors">
                    {assistant.name}
                </h3>
                
                <p className="line-clamp-2 min-h-[32px] sm:min-h-[40px] text-xs sm:text-sm leading-relaxed text-text-secondary">
                    {assistant.description || 'Описание не задано — добавьте источники знаний, чтобы обучить ассистента.'}
                </p>
            </div>

            <div className="flex flex-grow flex-col p-4 sm:p-6">
                <div className="mb-6 grid grid-cols-4 gap-1.5 sm:gap-2">
                    <button
                        type="button"
                        onClick={toggleRecording}
                        title={isRecording ? 'Остановить запись' : 'Записать голосовое сообщение'}
                        className={cn(
                            "flex h-9 sm:h-10 items-center justify-center rounded-[2px] border transition-all duration-300",
                            isRecording
                                ? "border-red-500 bg-red-500/10 text-red-500 animate-pulse"
                                : "border-border-color-one bg-extra-color text-white-color hover:border-primary-color hover:text-primary-color"
                        )}
                    >
                        {isRecording ? <MicOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Mic size={16} className="sm:w-[18px] sm:h-[18px]" />}
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowLinkModal(true)}
                        title="Добавить ссылку на сайт"
                        className="flex h-9 sm:h-10 items-center justify-center rounded-[2px] border border-border-color-one bg-extra-color text-white-color transition-all duration-300 hover:border-primary-color hover:text-primary-color"
                    >
                        <Link2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={docForm.processing}
                        title="Загрузить документ"
                        className="flex h-9 sm:h-10 items-center justify-center rounded-[2px] border border-border-color-one bg-extra-color text-white-color transition-all duration-300 hover:border-primary-color hover:text-primary-color disabled:opacity-50"
                    >
                        <Upload size={16} className={cn("sm:w-[18px] sm:h-[18px]", docForm.processing && "animate-bounce")} />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                        onChange={onPickDocument}
                    />

                    <button
                        type="button"
                        onClick={() => setShowEmbed(true)}
                        title="Встроить на сайт"
                        className="flex h-9 sm:h-10 items-center justify-center rounded-[2px] border border-border-color-one bg-extra-color text-white-color transition-all duration-300 hover:border-primary-color hover:text-primary-color"
                    >
                        <Code size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                </div>

                <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('share-chat.show', assistant.id)}
                            className="theme-button style-1 flex-grow !h-[40px] sm:!h-[44px] text-[9px] sm:text-sm"
                        >
                            <span data-text="Открыть чат">Открыть чат</span>
                            <i><MessageSquare size={14} /></i>
                        </Link>
                        <Link
                            href={route('assistants.show', assistant.id)}
                            className="theme-button style-2 w-[40px] sm:w-[44px] !h-[40px] sm:!h-[44px] !px-0"
                            title="Обзор"
                        >
                            <span data-text="?"><ArrowRight size={16} /></span>
                        </Link>
                    </div>

                    <div className="flex items-center justify-between border-t border-border-color-one pt-3">
                        <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-text-secondary">
                            Создан: {assistant.created_at}
                        </div>
                        <div className="flex items-center gap-1">
                            <Link
                                href={route('assistants.edit', assistant.id)}
                                className="p-2 text-text-secondary hover:text-primary-color transition-colors"
                                title="Редактировать"
                            >
                                <Pencil size={14} />
                            </Link>
                            <button
                                type="button"
                                onClick={deleteAssistant}
                                className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                                title="Удалить"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальные окна остаются почти такими же, но стилизуем их */}
            <Modal show={showLinkModal} onClose={() => setShowLinkModal(false)} maxWidth="lg">
                <form onSubmit={submitUrl} className="bg-background-one p-6 text-white-color">
                    <h3 className="text-xl font-bold uppercase tracking-tight font-title">Добавить ссылку</h3>
                    <p className="mt-2 text-sm text-text-secondary">
                        Укажите URL — ассистент проанализирует страницу и добавит её в базу знаний.
                    </p>
                    <div className="mt-6">
                        <InputLabel htmlFor={`url-${assistant.id}`} value="Адрес страницы" className="text-xs text-text-secondary uppercase tracking-widest" />
                        <TextInput
                            id={`url-${assistant.id}`}
                            type="url"
                            value={urlForm.data.url}
                            onChange={(e) => urlForm.setData('url', e.target.value)}
                            className="mt-2 block w-full bg-extra-color border-border-color-one text-white-color"
                            placeholder="https://example.com"
                            required
                        />
                        <InputHint message="Укажите URL — ассистент проанализирует страницу и добавит её в базу знаний." />
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={() => setShowLinkModal(false)}
                            className="theme-button style-2 !h-[44px]"
                        >
                            <span data-text="Отмена">Отмена</span>
                        </button>
                        <button 
                            disabled={urlForm.processing}
                            className="theme-button style-1 !h-[44px]"
                        >
                            <span data-text={urlForm.processing ? 'Добавление...' : 'Добавить'}>
                                {urlForm.processing ? 'Добавление...' : 'Добавить'}
                            </span>
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal show={showEmbed} onClose={() => setShowEmbed(false)} maxWidth="xl">
                <div className="bg-background-one p-6 text-white-color">
                    <h3 className="text-xl font-bold uppercase tracking-tight font-title">Встроить на сайт</h3>
                    <p className="mt-2 text-sm text-text-secondary">
                        Скопируйте код и вставьте его перед закрывающим тегом <code className="rounded bg-extra-color px-1 text-primary-color">&lt;/body&gt;</code>.
                    </p>
                    <div className="mt-6 overflow-hidden rounded-[2px] border border-border-color-one bg-black-color">
                        <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-primary-color/80">
                            <code>{embedCode}</code>
                        </pre>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={() => setShowEmbed(false)}
                            className="theme-button style-2 !h-[44px]"
                        >
                            <span data-text="Закрыть">Закрыть</span>
                        </button>
                        <button 
                            type="button" 
                            onClick={copyEmbed}
                            className="theme-button style-1 !h-[44px]"
                        >
                            <span data-text={copied ? 'Скопировано!' : 'Скопировать код'}>
                                {copied ? 'Скопировано!' : 'Скопировать код'}
                            </span>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

/**
 * Страница со списком всех ассистентов пользователя.
 *
 * Ассистенты выводятся в виде сетки карточек, каждая из которых
 * содержит расширенную информацию и действия над ассистентом.
 */
export default function Index({ assistants }: Props) {
    const assistantTips = [
        'Создавайте разных ассистентов для разных задач: продажи, поддержка, база знаний.',
        'Используйте иконку микрофона, чтобы быстро добавить голосовые инструкции.',
        'Вы всегда можете отредактировать промпт ассистента в разделе правки.',
    ];

    return (
        <AuthenticatedLayout
        >
            <Head title="Ассистенты" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <Breadcrumbs items={[{ label: 'Ассистенты' }]} />

                    <Tips tips={assistantTips} />

                    <div className="flex items-center justify-between mb-6 sm:mb-10">
                        <h2 className="text-lg sm:text-2xl font-bold uppercase tracking-tight text-white-color font-title">
                            Ассистенты
                        </h2>
                        <Link href={route('assistants.create')} className="theme-button style-1 !h-[40px] sm:!h-[52px] text-[9px] sm:text-sm">
                            <span data-text="Добавить">Добавить</span>
                            <i><Plus size={16} /></i>
                        </Link>
                    </div>

                    {assistants.length === 0 ? (
                        <div className="pricing-item px-6 py-20 text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2px] bg-extra-color text-primary-color">
                                <Plus size={40} />
                            </div>
                            <h3 className="mb-2 text-xl sm:text-2xl font-bold text-white-color font-title uppercase">Пусто</h3>
                            <p className="mb-8 text-text-secondary">У вас пока нет созданных ассистентов.</p>
                            <Link href={route('assistants.create')} className="theme-button style-1">
                                <span data-text="Создать первого ассистента">Создать первого ассистента</span>
                                <i><ArrowRight size={16} /></i>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {assistants.map((assistant) => (
                                <AssistantCard key={assistant.id} assistant={assistant} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
