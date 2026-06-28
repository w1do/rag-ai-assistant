import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active?: boolean }) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-primary-color bg-primary-color/10 text-primary-color focus:border-primary-color focus:bg-primary-color/20 focus:text-primary-color'
                    : 'border-transparent text-text-secondary hover:border-border-color-one hover:bg-background-one hover:text-white-color focus:border-border-color-one focus:bg-background-one focus:text-white-color'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
