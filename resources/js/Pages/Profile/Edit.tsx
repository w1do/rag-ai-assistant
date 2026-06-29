import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { useState } from 'react';
import SectionHeader from '@/Components/UI/SectionHeader';
import { User, Lock, AlertTriangle, Settings } from 'lucide-react';
import Tips from '@/Components/Tips';

type TabKey = 'profile' | 'password' | 'danger';

const TABS: { key: TabKey; label: string; icon: any; tips: string[] }[] = [
    { 
        key: 'profile', 
        label: 'Профиль', 
        icon: <User className="w-5 h-5" />,
        tips: [
            "Используйте ваше реальное имя, чтобы коллеги могли вас узнать.",
            "Актуальный email важен для получения уведомлений и восстановления доступа."
        ]
    },
    { 
        key: 'password', 
        label: 'Безопасность', 
        icon: <Lock className="w-5 h-5" />,
        tips: [
            "Надежный пароль содержит не менее 12 символов, включая цифры и спецсимволы.",
            "Меняйте пароль раз в несколько месяцев для повышения безопасности."
        ]
    },
    { 
        key: 'danger', 
        label: 'Удаление', 
        icon: <AlertTriangle className="w-5 h-5" />,
        tips: [
            "Удаление аккаунта необратимо. Все ваши данные будут стерты навсегда.",
            "Если вы просто хотите отдохнуть, попробуйте временно выйти из системы."
        ]
    },
];

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const [activeTab, setActiveTab] = useState<TabKey>('profile');

    const activeTabData = TABS.find(t => t.key === activeTab);

    return (
        <AuthenticatedLayout>
            <Head title="Профиль" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <Breadcrumbs items={[{ label: 'Профиль' }]} />

                    <SectionHeader 
                        title="Настройки профиля" 
                        icon={Settings}
                    />
                    <p className="mt-2 text-sm text-text-secondary mb-10 -mt-6">
                        Управляйте вашими персональными данными и настройками безопасности.
                    </p>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        {/* Sidebar Tabs */}
                        <div className="lg:col-span-1">
                            <nav className="flex flex-col gap-2 p-2 bg-background-one border border-border-color-one rounded-three shadow-sm mb-8">
                                {TABS.map((tab) => {
                                    const isActive = activeTab === tab.key;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-left ${
                                                isActive
                                                    ? 'bg-primary-color text-black-color font-bold shadow-[0_0_15px_rgba(223,255,0,0.3)]'
                                                    : 'text-white-color hover:bg-white/5'
                                            }`}
                                        >
                                            <span className={isActive ? 'text-black-color' : 'text-primary-color'}>
                                                {tab.icon}
                                            </span>
                                            <span className="text-sm uppercase tracking-wider font-title">
                                                {tab.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </nav>

                            {activeTabData && (
                                <Tips tips={activeTabData.tips} />
                            )}
                        </div>

                        {/* Content area */}
                        <div className="lg:col-span-3">
                            <div className="pricing-item p-6 sm:p-10 transition-all duration-500">
                                {activeTab === 'profile' && (
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="w-full"
                                    />
                                )}

                                {activeTab === 'password' && (
                                    <UpdatePasswordForm className="w-full" />
                                )}

                                {activeTab === 'danger' && (
                                    <div className="border-red-500/10 w-full">
                                        <DeleteUserForm className="w-full" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
