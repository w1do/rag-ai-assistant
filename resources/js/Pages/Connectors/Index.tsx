import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import { useState } from 'react';
import { MessageSquare, Share2, Zap, Globe } from 'lucide-react';

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
    telegram: Share2,
    max: Zap,
    vc: Globe,
};

function ConnectorCard({ connector, onConnect }: { connector: Connector; onConnect: (connector: Connector) => void }) {
    const Icon = iconMap[connector.icon.toLowerCase()] || MessageSquare;
    const isSoon = connector.status === 'soon';

    return (
        <div className={`relative flex flex-col overflow-hidden rounded-[20px] border p-7 shadow-md transition-all duration-300 group ${
            isSoon 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-white border-gray-200 hover:scale-[1.02] hover:shadow-lg'
        }`}>
            {!isSoon && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br from-[#151B27] via-[#C8A645] to-[#0C1019]" />
            )}
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-300 ${
                        isSoon ? 'bg-gray-200 text-gray-400' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                    }`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                            isSoon ? 'text-gray-400' : 'text-gray-900'
                        }`}>
                            {connector.name}
                        </h3>
                        {isSoon ? (
                            <span className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                                В разработке
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                                Новое
                            </span>
                        )}
                    </div>
                </div>
                
                <p className={`mt-4 text-sm line-clamp-2 min-h-[40px] transition-colors duration-300 ${
                    isSoon ? 'text-gray-400' : 'text-gray-500'
                }`}>
                    {connector.description}
                </p>

                {!isSoon && connector.assistants.length > 0 && (
                    <div className="mt-4">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider transition-colors duration-300">Подключенные ассистенты:</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {connector.assistants.map(assistant => (
                                <span key={assistant.id} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 transition-colors duration-300">
                                    {assistant.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-6">
                    <PrimaryButton 
                        className={`w-full justify-center transition-all duration-300 ${
                            isSoon 
                                ? 'bg-gray-100 text-gray-400 border-transparent shadow-none hover:bg-gray-100 cursor-not-allowed' 
                                : ''
                        }`} 
                        onClick={() => !isSoon && onConnect(connector)}
                        disabled={isSoon}
                    >
                        {isSoon ? 'Скоро' : 'Подключить ассистента'}
                    </PrimaryButton>
                </div>
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Коннекторы
                </h2>
            }
        >
            <Head title="Коннекторы" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {connectors.map((connector) => (
                            <ConnectorCard 
                                key={connector.id} 
                                connector={connector} 
                                onConnect={openModal}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <Modal show={selectedConnector !== null} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Подключить ассистента к {selectedConnector?.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Выберите ассистента, который будет выполнять публикации через этот коннектор.
                    </p>

                    <div className="mt-6">
                        <label htmlFor="assistant_id" className="block text-sm font-medium text-gray-700">
                            Ассистент
                        </label>
                        <select
                            id="assistant_id"
                            name="assistant_id"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={data.assistant_id}
                            onChange={(e) => setData('assistant_id', e.target.value)}
                            required
                        >
                            <option value="">Выберите ассистента</option>
                            {assistants.map((assistant) => (
                                <option key={assistant.id} value={assistant.id}>
                                    {assistant.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton type="button" onClick={closeModal}>Отмена</SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Подключение...' : 'Подключить'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
