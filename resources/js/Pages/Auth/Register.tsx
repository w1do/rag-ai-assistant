import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Регистрация" />

            <div className="mb-8 text-center">
                <h1 className="text-2xl font-title text-white-color sm:text-3xl">Создать аккаунт</h1>
                <p className="mt-2 text-text-secondary-dark">Начните работу с BotSync прямо сейчас</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-75">
                    <InputLabel htmlFor="name" value="Имя" className="mb-2 ml-1" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="block w-full"
                        isFocused={true}
                        placeholder="Иван Иванов"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
                    <InputLabel htmlFor="email" value="Email" className="mb-2 ml-1" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full"
                        placeholder="example@mail.com"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
                    <InputLabel htmlFor="password" value="Пароль" className="mb-2 ml-1" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-500">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Подтвердите пароль"
                        className="mb-2 ml-1"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="block w-full"
                        placeholder="••••••••"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="pt-2 animate-in fade-in zoom-in duration-500 delay-700">
                    <PrimaryButton className="w-full" disabled={processing}>
                        Зарегистрироваться
                    </PrimaryButton>
                </div>

                <div className="mt-8 text-center text-sm text-text-secondary-dark animate-in fade-in duration-700 delay-1000">
                    Уже есть аккаунт?{' '}
                    <Link
                        href={route('login')}
                        className="font-medium text-primary-color hover:underline"
                    >
                        Войти
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
