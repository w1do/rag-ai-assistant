import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface Props {
    stats: {
        assistants_count: number;
        chats_count: number;
        articles_count: number;
    };
    recent_assistants: {
        id: number;
        name: string;
        status: string;
    }[];
}

export default function Dashboard({ stats, recent_assistants }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Панель управления
                </h2>
            }
        >
            <Head title="Панель управления" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-500 text-sm">Ассистенты</div>
                            <div className="text-3xl font-bold">{stats.assistants_count}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-500 text-sm">Всего диалогов</div>
                            <div className="text-3xl font-bold">{stats.chats_count}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-500 text-sm">Сгенерировано статей</div>
                            <div className="text-3xl font-bold">{stats.articles_count}</div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-bold mb-4">Последние ассистенты</h3>
                            {recent_assistants.length === 0 ? (
                                <p className="text-gray-500">У вас пока нет ассистентов.</p>
                            ) : (
                                <ul className="divide-y">
                                    {recent_assistants.map((assistant) => (
                                        <li key={assistant.id} className="py-4 flex justify-between items-center">
                                            <div>
                                                <div className="font-medium">{assistant.name}</div>
                                                <div className="text-sm text-gray-500">Статус: {assistant.status}</div>
                                            </div>
                                            <Link
                                                href={route('assistants.show', assistant.id)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Перейти
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
