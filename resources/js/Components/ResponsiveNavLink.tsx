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
                    ? 'border-[#C8A645] bg-[#C8A645]/10 text-[#111111] focus:border-[#C8A645] focus:bg-[#C8A645]/20 focus:text-[#111111]'
                    : 'border-transparent text-[#5C5C5C] hover:border-gray-300 hover:bg-gray-50 hover:text-[#111111] focus:border-gray-300 focus:bg-gray-50 focus:text-[#111111]'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
