import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Подтверждение пароля" />

            <div className="mb-8 text-center">
                <h1 className="text-2xl font-title text-white-color sm:text-3xl">Безопасная зона</h1>
                <p className="mt-2 text-text-secondary-dark text-sm">
                    Пожалуйста, подтвердите ваш пароль перед продолжением.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
                    <InputLabel htmlFor="password" value="Пароль" className="mb-2 ml-1" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full"
                        isFocused={true}
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="pt-2 animate-in fade-in zoom-in duration-500 delay-300">
                    <PrimaryButton className="w-full" disabled={processing}>
                        Подтвердить
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
