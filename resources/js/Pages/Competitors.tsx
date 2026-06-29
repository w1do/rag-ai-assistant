import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Users, Wrench } from 'lucide-react';
import SectionHeader from '@/Components/UI/SectionHeader';
import Breadcrumbs from '@/Components/Breadcrumbs';

/**
 * Страница анализа конкурентов.
 *
 * Раздел предназначен для ввода до трёх конкурентов и сбора информации о них.
 * На текущем этапе отображает заглушку «В разработке».
 */
export default function Competitors() {
    return (
        <AuthenticatedLayout>
            <Head title="Конкуренты" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <Breadcrumbs items={[{ label: 'Конкуренты' }]} />
                    
                    <SectionHeader title="Конкуренты" icon={Users} />

                    <div className="flex flex-col items-center justify-center rounded-three border border-border-color-one bg-background-one px-7 py-20 text-center shadow-lg relative overflow-hidden group">
                        {/* Декоративные элементы фона */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-color/5 rounded-full blur-3xl group-hover:bg-primary-color/10 transition-all duration-700"></div>
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary-color/5 rounded-full blur-3xl group-hover:bg-primary-color/10 transition-all duration-700"></div>

                        <span className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-rgb-12 text-primary-color border border-primary-color/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                            <Users className="h-10 w-10" strokeWidth={2} />
                        </span>
                        
                        <h3 className="relative text-xl font-title text-white-color uppercase tracking-tight">
                            Анализ <span className="text-primary-color">конкурентов</span>
                        </h3>
                        
                        <p className="relative mt-4 max-w-md text-sm text-text-secondary leading-relaxed">
                            Здесь можно будет добавить до трёх конкурентов и собирать информацию о них автоматически. Мы работаем над алгоритмами сравнения цен и фич.
                        </p>
                        
                        <span className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-primary-color/10 px-4 py-1.5 text-xs font-bold text-primary-color border border-primary-color/20 uppercase tracking-widest">
                            <Wrench className="h-4 w-4" strokeWidth={2} />
                            В разработке
                        </span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
