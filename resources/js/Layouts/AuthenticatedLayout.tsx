import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import MegaMenu from '@/Components/MegaMenu';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Tooltip from '@/Components/Tooltip';
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Bot,
    CreditCard,
    LayoutDashboard,
    Link2,
    LogOut,
    MessagesSquare,
    User,
    Users,
} from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

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
                                    className="text-white-color hover:text-primary-color"
                                >
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Панель управления
                                </NavLink>
                                <NavLink
                                    href={route('assistants.index')}
                                    active={route().current('assistants.*')}
                                    className="text-white-color hover:text-primary-color"
                                >
                                    <Bot className="mr-2 h-4 w-4" />
                                    Ассистенты
                                </NavLink>
                                <NavLink
                                    href={route('connectors.index')}
                                    active={route().current('connectors.*')}
                                    className="text-white-color hover:text-primary-color"
                                >
                                    <Link2 className="mr-2 h-4 w-4" />
                                    Коннекторы
                                </NavLink>
                                <NavLink
                                    href={route('tariffs')}
                                    active={route().current('tariffs')}
                                    className="text-white-color hover:text-primary-color"
                                >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Тарифы
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-extra-color px-3 py-2 text-sm font-medium leading-4 text-white-color transition duration-150 ease-in-out hover:text-primary-color focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
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
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
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
        </div>
    );
}
