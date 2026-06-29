import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen bg-body-color grid-bg">
            {/* Left side: Image/Branding */}
            <div className="relative hidden w-0 flex-1 lg:block">
                <div className="absolute inset-0 bg-primary-color/5">
                    {/* Abstract background pattern or grid */}
                    <div className="absolute inset-0" style={{ 
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(223, 255, 0, 0.1) 1px, transparent 0)',
                        backgroundSize: '24px 24px'
                    }}></div>
                </div>
                
                {/* Decorative glowing elements */}
                <div className="pointer-events-none absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-primary-color/10 blur-[120px]"></div>
                <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-primary-color/5 blur-[100px]"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
                    <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <Link href="/">
                            <ApplicationLogo className="h-24 w-auto mb-12 transition-transform hover:scale-105" />
                        </Link>
                        <h2 className="text-4xl font-title max-w-lg leading-tight">
                            Управляйте своими AI-ассистентами в едином интерфейсе
                        </h2>
                        <p className="mt-6 text-xl text-text-secondary-dark max-w-md">
                            Профессиональная платформа для синхронизации и мониторинга ваших ботов.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side: Form */}
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-md lg:w-96 animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="lg:hidden mb-12 flex justify-center">
                        <Link href="/">
                            <ApplicationLogo className="h-16 w-auto" />
                        </Link>
                    </div>

                    <div className="overflow-hidden bg-background-one/80 p-8 shadow-2xl backdrop-blur-md border border-border-color-one rounded-one">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
