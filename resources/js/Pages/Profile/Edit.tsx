import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { useState } from 'react';
import { User, Lock, AlertTriangle } from 'lucide-react';

type TabKey = 'profile' | 'password' | 'danger';

const TABS: { key: TabKey; label: string; icon: any }[] = [
    { key: 'profile', label: 'Профиль', icon: <User className="w-5 h-5" /> },
    { key: 'password', label: 'Безопасность', icon: <Lock className="w-5 h-5" /> },
    { key: 'danger', label: 'Удаление', icon: <AlertTriangle className="w-5 h-5" /> },
];

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const [activeTab, setActiveTab] = useState<TabKey>('profile');

    return (
        <AuthenticatedLayout>
            <Head title="Профиль" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <Breadcrumbs items={[{ label: 'Профиль' }]} />

                    <div className="mb-10">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-white-color font-title">
                            Настройки <span className="text-primary-color">профиля</span>
                        </h2>
                        <p className="mt-2 text-sm text-text-secondary">
                            Управляйте вашими персональными данными и настройками безопасности.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        {/* Sidebar Tabs */}
                        <div className="lg:col-span-1">
                            <nav className="flex flex-col gap-2 p-2 bg-background-one border border-border-color-one rounded-three shadow-sm">
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
                        </div>

                        {/* Content area */}
                        <div className="lg:col-span-3">
                            <div className="pricing-item p-6 sm:p-10 transition-all duration-500">
                                {activeTab === 'profile' && (
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-2xl"
                                    />
                                )}

                                {activeTab === 'password' && (
                                    <UpdatePasswordForm className="max-w-2xl" />
                                )}

                                {activeTab === 'danger' && (
                                    <div className="border-red-500/10">
                                        <DeleteUserForm className="max-w-2xl" />
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
