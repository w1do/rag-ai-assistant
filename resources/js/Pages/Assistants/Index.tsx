import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

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

export default function Index({ assistants }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
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
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {assistants.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">У вас пока нет ассистентов.</p>
                                    <Link href={route('assistants.create')} className="text-indigo-600 hover:text-indigo-900">
                                        Создайте своего первого ассистента
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {assistants.map((assistant) => (
                                        <div key={assistant.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <h3 className="text-lg font-bold mb-2">{assistant.name}</h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {assistant.description || 'Нет описания'}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <span className={`text-xs px-2 py-1 rounded ${
                                                    assistant.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {assistant.status}
                                                </span>
                                                <Link
                                                    href={route('assistants.show', assistant.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                                >
                                                    Управлять
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
