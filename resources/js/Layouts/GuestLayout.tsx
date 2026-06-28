import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-body-color pt-6 sm:justify-center sm:pt-0">
            <div className="mb-8">
                <Link href="/">
                    <ApplicationLogo />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-background-one px-8 py-10 shadow-xl border border-border-color-one sm:max-w-md sm:rounded-three">
                {children}
            </div>
        </div>
    );
}
