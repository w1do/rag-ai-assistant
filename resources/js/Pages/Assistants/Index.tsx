import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
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
    const deleteAssistant = (id: number) => {
        if (confirm('Вы уверены, что хотите удалить этого ассистента и все связанные данные из базы знаний?')) {
            router.delete(route('assistants.destroy', id));
        }
    };

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
                                        <div key={assistant.id} className="border rounded-xl p-6 hover:shadow-lg transition-all bg-white relative group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{assistant.name}</h3>
                                                <button 
                                                    onClick={() => deleteAssistant(assistant.id)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                                    title="Удалить ассистента"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                                                {assistant.description || 'Нет описания'}
                                            </p>
                                            <div className="flex justify-between items-center mt-auto">
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-2.5 h-2.5 rounded-full ${
                                                        assistant.status === 'ready' ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`} />
                                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        {assistant.status}
                                                    </span>
                                                </div>
                                                <Link
                                                    href={route('assistants.show', assistant.id)}
                                                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-bold"
                                                >
                                                    Управлять
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
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
