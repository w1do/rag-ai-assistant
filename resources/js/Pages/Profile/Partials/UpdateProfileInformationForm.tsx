import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import InputHint from '@/Components/InputHint';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-title uppercase tracking-tight text-white-color">
                    Информация профиля
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                    Обновите информацию профиля вашей учетной записи и адрес электронной почты.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Имя" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full text-primary-color border-primary-color/20 focus:border-primary-color"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                        placeholder="Введите ваше полное имя (например: Александр)"
                    />

                    <InputHint message="Имя будет отображаться в вашем профиле и сообщениях." />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-xs text-text-secondary uppercase tracking-widest mb-2" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full text-primary-color border-primary-color/20 focus:border-primary-color"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        placeholder="укажите актуальный email: example@mail.ru"
                    />

                    <InputHint message="Используется для входа и системных уведомлений." />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Сохранить</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-text-secondary">
                            Сохранено.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
