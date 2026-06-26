import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Users, Wrench } from 'lucide-react';

/**
 * Страница анализа конкурентов.
 *
 * Раздел предназначен для ввода до трёх конкурентов и сбора информации о них.
 * На текущем этапе отображает заглушку «В разработке».
 */
export default function Competitors() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Конкуренты
                </h2>
            }
        >
            <Head title="Конкуренты" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100">
                            <Users className="h-8 w-8" strokeWidth={2} />
                        </span>
                        <h3 className="mt-5 text-lg font-semibold text-gray-900">
                            Анализ конкурентов
                        </h3>
                        <p className="mt-2 max-w-md text-sm text-gray-500">
                            Здесь можно будет добавить до трёх конкурентов и
                            собирать информацию о них.
                        </p>
                        <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                            <Wrench className="h-4 w-4" strokeWidth={2} />
                            В разработке
                        </span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
