import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Activity, Wrench } from 'lucide-react';

/**
 * Страница мониторинга обучения базы знаний.
 *
 * Раздел предназначен для отслеживания процесса обучения базы знаний.
 * На текущем этапе отображает заглушку «В разработке».
 */
export default function Monitoring() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Мониторинг
                </h2>
            }
        >
            <Head title="Мониторинг" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center rounded-[20px] border border-gray-200 bg-white px-7 py-16 text-center shadow-md">
                        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100">
                            <Activity className="h-8 w-8" strokeWidth={2} />
                        </span>
                        <h3 className="mt-5 text-lg font-semibold text-gray-900">
                            Мониторинг обучения базы знаний
                        </h3>
                        <p className="mt-2 max-w-md text-sm text-gray-500">
                            Здесь будет отображаться процесс обучения вашей базы
                            знаний и его статус.
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
