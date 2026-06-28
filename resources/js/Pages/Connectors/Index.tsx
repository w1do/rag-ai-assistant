import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import Select from '@/Components/Select';
import { useState } from 'react';
import { MessageSquare, Share2, Zap, Globe, Send, ArrowRight, Loader2, CheckCircle2, Clock } from 'lucide-react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import Tips from '@/Components/Tips';
import FAQ from '@/Components/FAQ';

interface Assistant {
    id: number;
    name: string;
}

interface Connector {
    id: number;
    name: string;
    description: string;
    icon: string;
    status: string;
    assistants: Assistant[];
}

interface Props {
    connectors: Connector[];
    assistants: Assistant[];
}

const iconMap: Record<string, any> = {
    vk: MessageSquare,
    telegram: Send,
    max: Zap,
    vc: Globe,
};

function ConnectorCard({ connector, onConnect }: { connector: Connector; onConnect: (connector: Connector) => void }) {
    const Icon = iconMap[connector.icon.toLowerCase()] || MessageSquare;
    const isSoon = connector.status === 'soon';

    return (
        <div className={`pricing-item group flex flex-col ${isSoon ? 'opacity-75' : ''}`}>
            <div className="pricing-top">
                <div className="flex justify-center mb-6">
                    <div className={`w-[80px] h-[80px] border rounded-full flex items-center justify-center transition-all duration-500 ${
                        isSoon ? 'bg-extra-color-three border-extra-color-three text-text-secondary-dark' : 'bg-primary-rgb-12 border-primary-color text-primary-color group-hover:bg-primary-color group-hover:text-black-color'
                    }`}>
                        <Icon className="h-8 w-8" />
                    </div>
                </div>
                <div className="pricing-top-content">
                    <h3 className="text-xl font-title text-white-color">{connector.name}</h3>
                    {isSoon ? (
                        <span className="text-[10px] font-title px-3 py-0.5 rounded-full border border-text-secondary-dark/30 text-text-secondary-dark uppercase">
                            В разработке
                        </span>
                    ) : (
                        <span className="text-[10px] font-title px-3 py-0.5 rounded-full bg-primary-color text-black-color uppercase">
                            Активен
                        </span>
                    )}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <p className="text-sm text-text-secondary-dark leading-relaxed mb-6 line-clamp-2">
                    {connector.description}
                </p>

                {!isSoon && connector.assistants.length > 0 && (
                    <div className="mb-6">
                        <p className="text-[10px] font-title text-white-color uppercase mb-2">Подключено:</p>
                        <div className="flex flex-wrap gap-2">
                            {connector.assistants.map(assistant => (
                                <span key={assistant.id} className="inline-flex items-center rounded-full bg-extra-color-three px-2.5 py-0.5 text-[11px] text-white-color border border-border-color-one">
                                    {assistant.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-auto">
                    <button 
                        className={`theme-button w-full ${isSoon ? 'style-2 opacity-50 cursor-not-allowed' : 'style-1'}`}
                        onClick={() => !isSoon && onConnect(connector)}
                        disabled={isSoon}
                    >
                        <span data-text={isSoon ? 'Скоро' : 'Подключить'}>
                            {isSoon ? 'Скоро' : 'Подключить'}
                        </span>
                        {!isSoon && <ArrowRight className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ConnectorSidebar({ connectors }: { connectors: Connector[] }) {
    const activeCount = connectors.filter(c => c.status !== 'soon').length;
    const progress = Math.round((activeCount / connectors.length) * 100);

    const socialStatuses = [
        { name: 'Telegram', status: 'active', icon: Send },
        { name: 'VKontakte', status: 'maintenance', icon: MessageSquare },
        { name: 'VC.ru', status: 'active', icon: Globe },
        { name: 'WhatsApp', status: 'pending', icon: Share2 },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-background-one border border-border-color-one rounded-three p-6">
                <h4 className="text-lg font-title text-white-color mb-4">Статус <span className="text-primary-color">сетей</span></h4>
                <div className="space-y-4">
                    {socialStatuses.map((social) => (
                        <div key={social.name} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-extra-color border border-border-color-one text-text-secondary-dark group-hover:text-primary-color transition-colors">
                                    <social.icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm text-white-color">{social.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {social.status === 'active' && (
                                    <>
                                        <span className="text-[10px] text-success font-medium uppercase">Работает</span>
                                        <CheckCircle2 className="w-3 h-3 text-success" />
                                    </>
                                )}
                                {social.status === 'maintenance' && (
                                    <>
                                        <span className="text-[10px] text-warning font-medium uppercase">Техработы</span>
                                        <Clock className="w-3 h-3 text-warning" />
                                    </>
                                )}
                                {social.status === 'pending' && (
                                    <>
                                        <span className="text-[10px] text-text-secondary-dark font-medium uppercase">В очереди</span>
                                        <Loader2 className="w-3 h-3 text-text-secondary-dark animate-spin" />
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-background-one border border-border-color-one rounded-three p-6">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-title text-white-color uppercase">Готовность платформы</h4>
                    <span className="text-primary-color font-title text-sm">{progress}%</span>
                </div>
                <div className="w-full bg-extra-color-three rounded-full h-2 mb-4">
                    <div 
                        className="bg-primary-color h-2 rounded-full shadow-[0_0_10px_rgba(223,255,0,0.5)] transition-all duration-1000" 
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs text-text-secondary-dark leading-relaxed">
                    Мы постоянно работаем над расширением списка доступных каналов связи.
                </p>
            </div>

            <div className="bg-primary-rgb-12 border border-primary-color/20 rounded-three p-6 relative overflow-hidden group">
                <div className="absolute top-[-20px] right-[-20px] opacity-10 group-hover:rotate-12 transition-transform duration-700">
                    <Zap className="w-24 h-24 text-primary-color" />
                </div>
                <h4 className="text-lg font-title text-white-color mb-2">Обновление <span className="text-primary-color">системы</span></h4>
                <div className="flex items-center gap-2 text-text-secondary-dark text-sm mb-4">
                    <Loader2 className="w-4 h-4 animate-spin text-primary-color" />
                    <span>Синхронизация...</span>
                </div>
                <p className="text-xs text-text-secondary-dark">
                    Все коннекторы работают в режиме реального времени.
                </p>
            </div>
        </div>
    );
}

export default function Index({ connectors, assistants }: Props) {
    const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
    const { data, setData, post, processing, reset } = useForm({
        connector_id: '',
        assistant_id: '',
    });

    const openModal = (connector: Connector) => {
        setSelectedConnector(connector);
        setData('connector_id', connector.id.toString());
    };

    const closeModal = () => {
        setSelectedConnector(null);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('connectors.attach-assistant'), {
            onSuccess: () => closeModal(),
        });
    };

    const connectorTips = [
        'Подключите Telegram для быстрой связи с клиентами.',
        'Используйте ассистентов для автоматизации ответов в VK.',
        'Мониторинг VC поможет вовремя реагировать на упоминания бренда.',
    ];

    const connectorFaqs = [
        {
            question: "Как подключить новый канал?",
            answer: "Выберите нужный коннектор из списка и нажмите кнопку 'Подключить'. Следуйте инструкциям по авторизации."
        },
        {
            question: "Сколько ассистентов можно подключить?",
            answer: "Количество ассистентов зависит от вашего тарифного плана. Базовый тариф позволяет подключить до 3 ассистентов."
        },
        {
            question: "Какие данные собирает коннектор?",
            answer: "Коннектор собирает только те данные, которые необходимы для работы ассистента: сообщения, упоминания и комментарии."
        },
        {
            question: "Безопасно ли передавать ключи доступа?",
            answer: "Все ключи шифруются и хранятся в защищенном хранилище. Мы никогда не передаем ваши данные третьим лицам."
        }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Коннекторы" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <Breadcrumbs items={[{ label: 'Коннекторы' }]} />

                    <Tips tips={connectorTips} />

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                        <div className="lg:col-span-3">
                            <div className="mb-12">
                                <h3 className="text-3xl font-title text-white-color mb-4">
                                    Управляйте своими <span className="text-primary-color">коннекторами</span>
                                </h3>
                                <p className="text-text-secondary-dark max-w-2xl">
                                    Подключайте ассистентов к различным платформам для автоматизации взаимодействия с вашей аудиторией.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {connectors.map((connector) => (
                                    <ConnectorCard 
                                        key={connector.id} 
                                        connector={connector} 
                                        onConnect={openModal}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <ConnectorSidebar connectors={connectors} />
                        </div>
                    </div>

                    <FAQ 
                        items={connectorFaqs} 
                        title={<>Помощь по <span className="text-primary-color">коннекторам</span></>}
                        subtitle="Ответы на частые вопросы по работе с внешними платформами."
                    />
                </div>
            </div>

            <Modal show={selectedConnector !== null} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-8 bg-background-one border border-border-color-one rounded-three">
                    <h2 className="text-xl font-title text-white-color mb-2">
                        Подключить <span className="text-primary-color">ассистента</span>
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary-dark leading-relaxed">
                        Выберите ассистента, который будет работать через {selectedConnector?.name}.
                    </p>

                    <div className="mt-8">
                        <label htmlFor="assistant_id" className="block text-xs font-title text-white-color uppercase mb-2">
                            Ассистент
                        </label>
                        <Select
                            id="assistant_id"
                            name="assistant_id"
                            value={data.assistant_id}
                            onChange={(e) => setData('assistant_id', e.target.value)}
                            required
                        >
                            <option value="">Выберите ассистента</option>
                            {assistants.map((assistant) => (
                                <option key={assistant.id} value={assistant.id} className="bg-background-one">
                                    {assistant.name}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <button type="button" onClick={closeModal} className="theme-button style-2 flex-1">
                            <span data-text="Отмена">Отмена</span>
                        </button>
                        <button disabled={processing} className="theme-button style-1 flex-1">
                            <span data-text={processing ? 'Загрузка...' : 'Подключить'}>
                                {processing ? 'Загрузка...' : 'Подключить'}
                            </span>
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
