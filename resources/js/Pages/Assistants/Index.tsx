import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { Mic, MicOff, Link2, Upload, Code, MessageSquare, Trash2 } from 'lucide-react';

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
                badge: 'bg-green-50 text-green-700',
                dot: 'bg-green-500',
            };
        case 'error':
            return {
                label: 'Ошибка',
                badge: 'bg-red-50 text-red-700',
                dot: 'bg-red-500',
            };
        case 'processing':
            return {
                label: 'Обработка',
                badge: 'bg-blue-50 text-blue-700',
                dot: 'bg-blue-500',
            };
        default:
            return {
                label: 'Черновик',
                badge: 'bg-amber-50 text-amber-700',
                dot: 'bg-amber-400',
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
function AssistantRow({ assistant }: { assistant: Assistant }) {
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
        <div className="px-6 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Левая часть: аватар и информация */}
                <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold uppercase text-white">
                        {(assistant.name || 'A').charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href={route('assistants.show', assistant.id)}
                                className="truncate text-sm font-semibold text-gray-900 hover:text-indigo-600"
                            >
                                {assistant.name}
                            </Link>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${meta.badge}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                                {meta.label}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                                #{assistant.id}
                            </span>
                        </div>
                        <p className="mt-1 line-clamp-2 max-w-2xl text-xs leading-relaxed text-gray-500">
                            {assistant.description || 'Описание не задано — добавьте источники знаний, чтобы обучить ассистента.'}
                        </p>
                        <p className="mt-1.5 text-xs text-gray-400">
                            Создан: {assistant.created_at}
                        </p>
                    </div>
                </div>

                {/* Правая часть: действия */}
                <div className="flex flex-wrap items-center gap-2 lg:shrink-0 lg:justify-end">
                    {/* Запись с микрофона */}
                    <button
                        type="button"
                        onClick={toggleRecording}
                        title={isRecording ? 'Остановить запись' : 'Записать голосовое сообщение'}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
                            isRecording
                                ? 'animate-pulse border-red-200 bg-red-50 text-red-600'
                                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>

                    {/* Добавить ссылку (модальное окно) */}
                    <button
                        type="button"
                        onClick={() => setShowLinkModal(true)}
                        title="Добавить ссылку на сайт"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50"
                    >
                        <Link2 className="h-4 w-4" />
                    </button>

                    {/* Загрузить документ */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={docForm.processing}
                        title="Загрузить документ"
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50 ${docForm.processing ? 'animate-pulse' : ''}`}
                    >
                        <Upload className="h-4 w-4" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                        onChange={onPickDocument}
                    />

                    {/* Встроить на сайт */}
                    <button
                        type="button"
                        onClick={() => setShowEmbed(true)}
                        title="Встроить на сайт"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50"
                    >
                        <Code className="h-4 w-4" />
                    </button>

                    {/* Перейти в чат */}
                    <Link
                        href={route('assistants.chat', assistant.id)}
                        title="Перейти в чат"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-indigo-600 text-white transition-colors hover:bg-indigo-700"
                    >
                        <MessageSquare className="h-4 w-4" />
                    </Link>

                    {/* Удалить */}
                    <button
                        type="button"
                        onClick={deleteAssistant}
                        title="Удалить ассистента"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Модальное окно вставки ссылки */}
            <Modal show={showLinkModal} onClose={() => setShowLinkModal(false)} maxWidth="lg">
                <form onSubmit={submitUrl} className="p-6">
                    <h3 className="text-sm font-semibold text-gray-900">Добавить ссылку на сайт</h3>
                    <p className="mt-1 text-xs text-gray-500">
                        Укажите URL — ассистент проанализирует страницу и добавит её в базу знаний.
                    </p>
                    <div className="mt-4">
                        <InputLabel htmlFor={`url-${assistant.id}`} value="Адрес страницы" className="text-xs" />
                        <TextInput
                            id={`url-${assistant.id}`}
                            type="url"
                            value={urlForm.data.url}
                            onChange={(e) => urlForm.setData('url', e.target.value)}
                            className="mt-1.5 block w-full text-sm"
                            placeholder="https://example.com"
                            required
                        />
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                        <SecondaryButton type="button" onClick={() => setShowLinkModal(false)}>
                            Отмена
                        </SecondaryButton>
                        <PrimaryButton disabled={urlForm.processing}>
                            {urlForm.processing ? 'Добавление...' : 'Добавить'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Модальное окно кода для встраивания */}
            <Modal show={showEmbed} onClose={() => setShowEmbed(false)} maxWidth="xl">
                <div className="p-6">
                    <h3 className="text-sm font-semibold text-gray-900">Встроить виджет на сайт</h3>
                    <p className="mt-1 text-xs text-gray-500">
                        Скопируйте код и вставьте его перед закрывающим тегом <code className="rounded bg-gray-100 px-1">&lt;/body&gt;</code>.
                        Виджет ассистента появится в правом нижнем углу страницы.
                    </p>
                    <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                        <pre className="overflow-x-auto bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
                            <code>{embedCode}</code>
                        </pre>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                        <SecondaryButton type="button" onClick={() => setShowEmbed(false)}>
                            Закрыть
                        </SecondaryButton>
                        <PrimaryButton type="button" onClick={copyEmbed}>
                            {copied ? 'Скопировано!' : 'Скопировать код'}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

/**
 * Страница со списком всех ассистентов пользователя.
 *
 * Ассистенты выводятся вертикальным списком, разделённым тонкими divider-ами,
 * вместо сеточной раскладки. Каждая строка содержит расширенную информацию
 * и действия над ассистентом.
 */
export default function Index({ assistants }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Ассистенты
                    </h2>
                    <Link href={route('assistants.create')}>
                        <PrimaryButton>Создать ассистента</PrimaryButton>
                    </Link>
                </div>
            }
        >
            <Head title="Ассистенты" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        {assistants.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <p className="mb-4 text-sm text-gray-500">У вас пока нет ассистентов.</p>
                                <Link href={route('assistants.create')} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                    Создайте своего первого ассистента
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {assistants.map((assistant) => (
                                    <AssistantRow key={assistant.id} assistant={assistant} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
