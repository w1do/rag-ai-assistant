import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout
        >
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

                    <div className="space-y-8">
                        <div className="pricing-item p-6 sm:p-10">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-2xl"
                            />
                        </div>

                        <div className="pricing-item p-6 sm:p-10">
                            <UpdatePasswordForm className="max-w-2xl" />
                        </div>

                        <div className="pricing-item p-6 sm:p-10 border-red-500/20">
                            <DeleteUserForm className="max-w-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
