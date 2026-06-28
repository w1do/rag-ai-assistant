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
                    ? 'border-[#C8A645] text-[#111111] focus:border-[#C8A645]'
                    : 'border-transparent text-[#5C5C5C] hover:border-gray-300 hover:text-[#111111] focus:border-gray-300 focus:text-[#111111]') +
                className
            }
        >
            {children}
        </Link>
    );
}
