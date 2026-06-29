import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import Alert from '@/Components/Alert';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Подтверждение Email" />

            <div className="mb-8 text-center">
                <h1 className="text-2xl font-title text-white-color sm:text-3xl">Подтвердите Email</h1>
                <p className="mt-2 text-text-secondary-dark leading-relaxed text-sm">
                    Спасибо за регистрацию! Пожалуйста, подтвердите ваш адрес электронной почты, перейдя по ссылке, которую мы только что отправили вам. Если вы не получили письмо, мы с радостью отправим вам новое.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <Alert type="success" className="mb-6">
                    Новая ссылка для подтверждения была отправлена на адрес электронной почты, указанный вами при регистрации.
                </Alert>
            )}

            <form onSubmit={submit}>
                <div className="mt-8 flex flex-col items-center gap-4 animate-in fade-in duration-700">
                    <PrimaryButton disabled={processing} className="w-full">
                        Отправить письмо повторно
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm text-text-secondary-dark hover:text-white-color transition-colors"
                    >
                        Выйти из системы
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
