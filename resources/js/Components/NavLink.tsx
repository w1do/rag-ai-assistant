import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-primary-color text-primary-color focus:border-primary-color'
                    : 'border-transparent text-text-secondary hover:border-border-color-one hover:text-white-color focus:border-border-color-one focus:text-white-color') +
                className
            }
        >
            {children}
        </Link>
    );
}
