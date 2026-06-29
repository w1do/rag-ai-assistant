import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import Alert from '@/Components/Alert';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Вход" />

            <div className="mb-8 text-center">
                <h1 className="text-2xl font-title text-white-color sm:text-3xl">С возвращением!</h1>
                <p className="mt-2 text-text-secondary-dark">Войдите в свой аккаунт, чтобы продолжить</p>
            </div>

            {status && (
                <Alert type="success" className="mb-6">
                    {status}
                </Alert>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
                    <InputLabel htmlFor="email" value="Email" className="mb-2 ml-1" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full"
                        isFocused={true}
                        placeholder="example@mail.com"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
                    <div className="flex items-center justify-between mb-2 ml-1">
                        <InputLabel htmlFor="password" value="Пароль" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-primary-color hover:text-white-color transition-colors"
                            >
                                Забыли пароль?
                            </Link>
                        )}
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between animate-in fade-in duration-500 delay-500">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                        />
                        <span className="ms-2 text-sm text-text-secondary-dark group-hover:text-white-color transition-colors">
                            Запомнить меня
                        </span>
                    </label>
                </div>

                <div className="pt-2 animate-in fade-in zoom-in duration-500 delay-700">
                    <PrimaryButton className="w-full" disabled={processing}>
                        Войти в систему
                    </PrimaryButton>
                </div>

                <div className="mt-8 text-center text-sm text-text-secondary-dark animate-in fade-in duration-700 delay-1000">
                    Нет аккаунта?{' '}
                    <Link
                        href={route('register')}
                        className="font-medium text-primary-color hover:underline"
                    >
                        Зарегистрироваться
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
