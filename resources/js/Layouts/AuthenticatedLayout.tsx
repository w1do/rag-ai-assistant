import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import MegaMenu from '@/Components/MegaMenu';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Tooltip from '@/Components/Tooltip';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Link, usePage, useForm } from '@inertiajs/react';
import {
    Activity,
    Bot,
    ChevronDown,
    CreditCard,
    LayoutDashboard,
    Link2,
    LogOut,
    Menu,
    MessagesSquare,
    Plus,
    User,
    Users,
    X,
} from 'lucide-react';
import { FormEvent, PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    
    const [showingTopUpModal, setShowingTopUpModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
    });

    const submitTopUp = (e: FormEvent) => {
        e.preventDefault();
        post(route('billing.top-up'), {
            onSuccess: () => {
                setShowingTopUpModal(false);
                reset();
            },
        });
    };

    return (
        <div className="min-h-screen bg-body-color">
            <nav className="relative border-b border-border-color-one bg-background-one">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center group">
                                    <div className="w-8 h-8 bg-primary-color rounded flex items-center justify-center mr-2">
                                        <div className="w-4 h-4 bg-black-color rounded-sm transform rotate-45 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-primary-color rounded-full animate-pulse" />
                                        </div>
                                    </div>
                                    <span className="text-xl font-title tracking-tight text-white-color uppercase">
                                        Bot<span className="text-primary-color">Sync</span>
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Панель управления
                                </NavLink>
                                <NavLink
                                    href={route('assistants.index')}
                                    active={route().current('assistants.*')}
                                >
                                    <Bot className="mr-2 h-4 w-4" />
                                    Ассистенты
                                </NavLink>
                                <NavLink
                                    href={route('connectors.index')}
                                    active={route().current('connectors.*')}
                                >
                                    <Link2 className="mr-2 h-4 w-4" />
                                    Коннекторы
                                </NavLink>
                                <NavLink
                                    href={route('tariffs')}
                                    active={route().current('tariffs')}
                                >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Тарифы
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            {/* Balance Section */}
                            <div className="flex items-center gap-3 mr-4 px-3 py-1.5 rounded-lg bg-extra-color border border-border-color-one">
                                <div className="text-sm font-semibold text-white-color whitespace-nowrap">
                                    {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(user.balance || 0)}
                                </div>
                                <div className="w-px h-4 bg-border-color-one" />
                                <button 
                                    onClick={() => setShowingTopUpModal(true)}
                                    className="flex items-center gap-1.5 text-xs font-bold text-primary-color hover:text-white-color transition-colors uppercase tracking-wider"
                                >
                                    <Plus className="w-3 h-3" />
                                    Пополнить
                                </button>
                            </div>

                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-extra-color px-3 py-2 text-sm font-medium leading-4 text-white-color transition duration-150 ease-in-out hover:text-primary-color focus:outline-none"
                                            >
                                                {user.name}

                                                <ChevronDown className="-me-0.5 ms-2 h-4 w-4" />
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content contentClasses="py-1 bg-extra-color border border-border-color-one">
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="flex items-center text-white-color hover:bg-background-one"
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            Профиль
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center text-white-color hover:bg-background-one"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Выйти
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-white-color transition duration-150 ease-in-out hover:bg-extra-color hover:text-primary-color focus:outline-none"
                            >
                                {showingNavigationDropdown ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden bg-background-one border-t border-border-color-one'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            className="flex items-center text-white-color"
                        >
                            <LayoutDashboard className="mr-3 h-5 w-5" />
                            Панель управления
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('assistants.index')}
                            active={route().current('assistants.*')}
                            className="flex items-center text-white-color"
                        >
                            <Bot className="mr-3 h-5 w-5" />
                            Ассистенты
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('connectors.index')}
                            active={route().current('connectors.*')}
                            className="flex items-center text-white-color"
                        >
                            <Link2 className="mr-3 h-5 w-5" />
                            Коннекторы
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('tariffs')}
                            active={route().current('tariffs')}
                            className="flex items-center text-white-color"
                        >
                            <CreditCard className="mr-3 h-5 w-5" />
                            Тарифы
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-border-color-one pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-semibold text-white-color">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-text-secondary">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink
                                href={route('profile.edit')}
                                className="flex items-center text-white-color"
                            >
                                <User className="mr-3 h-5 w-5" />
                                Профиль
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="flex items-center text-white-color"
                            >
                                <LogOut className="mr-3 h-5 w-5" />
                                Выйти
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-background-one border-b border-border-color-one">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="text-white-color">{children}</main>

            <Modal show={showingTopUpModal} onClose={() => setShowingTopUpModal(false)} maxWidth="md">
                <form onSubmit={submitTopUp} className="p-6">
                    <h2 className="text-lg font-title text-white-color mb-4">
                        Пополнение баланса
                    </h2>

                    <div className="mb-4">
                        <InputLabel htmlFor="amount" value="Сумма пополнения (₽)" className="text-white-color" />
                        <TextInput
                            id="amount"
                            type="number"
                            name="amount"
                            value={data.amount}
                            className="mt-1 block w-full bg-extra-color border-border-color-one text-white-color"
                            placeholder="Например, 100"
                            onChange={(e) => setData('amount', e.target.value)}
                            required
                        />
                        <InputError message={errors.amount} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton 
                            onClick={() => setShowingTopUpModal(false)}
                            className="bg-extra-color border-border-color-one text-white-color"
                        >
                            Отмена
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="bg-primary-color text-black-color hover:bg-white-color">
                            Пополнить
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
