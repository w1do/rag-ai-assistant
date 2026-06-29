import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import Alert from '@/Components/Alert';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Восстановление пароля" />

            <div className="mb-8 text-center">
                <h1 className="text-2xl font-title text-white-color sm:text-3xl">Забыли пароль?</h1>
                <p className="mt-2 text-text-secondary-dark leading-relaxed">
                    Введите ваш Email, и мы отправим ссылку для сброса пароля.
                </p>
            </div>

            {status && (
                <Alert type="success" className="mb-6">
                    {status}
                </Alert>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full"
                        isFocused={true}
                        placeholder="example@mail.com"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="pt-2 animate-in fade-in zoom-in duration-500 delay-300">
                    <PrimaryButton className="w-full" disabled={processing}>
                        Отправить ссылку
                    </PrimaryButton>
                </div>

                <div className="mt-8 text-center text-sm text-text-secondary-dark animate-in fade-in duration-700 delay-500">
                    <Link
                        href={route('login')}
                        className="font-medium text-primary-color hover:underline"
                    >
                        Вернуться ко входу
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
