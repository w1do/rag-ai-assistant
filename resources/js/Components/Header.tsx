import { Link } from '@inertiajs/react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface Props {
    auth: {
        user: any;
    };
}

export default function Header({ auth }: Props) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header 
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                isScrolled ? "bg-body-color/80 backdrop-blur-md py-3 border-b border-border-color-one" : "bg-transparent py-6"
            )}
        >
            <div className="max-w-[1320px] mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary-color rounded-lg flex items-center justify-center transition-all">
                        <div className="w-6 h-6 bg-black-color rounded-sm transform rotate-45 flex items-center justify-center">
                           <div className="w-3 h-3 bg-primary-color rounded-full animate-pulse" />
                        </div>
                    </div>
                    <span className="text-2xl font-title tracking-tight text-white-color uppercase">
                        Bot<span className="text-primary-color">Sync</span>
                    </span>
                </Link>

                {/* Navigation - Desktop */}
                <nav className="hidden md:flex items-center gap-10">
                    <Link href="#solutions" className="text-[16px] font-semibold text-white-color hover:text-primary-color transition-colors">Solutions</Link>
                    <Link href="#network" className="text-[16px] font-semibold text-white-color hover:text-primary-color transition-colors">Network</Link>
                    <Link href="#vault" className="text-[16px] font-semibold text-white-color hover:text-primary-color transition-colors">Vault</Link>
                    <Link href="#api" className="text-[16px] font-semibold text-white-color hover:text-primary-color transition-colors">API</Link>
                </nav>

                {/* Action */}
                <div className="flex items-center gap-4">
                    {auth.user ? (
                        <Link 
                            href={route('dashboard')}
                            className="theme-button style-1 h-[48px]"
                        >
                            <span data-text="Dashboard">Dashboard</span>
                            <i className="fa-solid fa-arrow-right"><ArrowRight size={14} /></i>
                        </Link>
                    ) : (
                        <Link 
                            href={route('login')}
                            className="theme-button style-1 h-[48px]"
                        >
                            <span data-text="Connect Node">Connect Node</span>
                            <i className="fa-solid fa-arrow-right"><ArrowRight size={14} /></i>
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-white-color"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-extra-color border-b border-border-color-one p-6 animate-in slide-in-from-top duration-300">
                    <nav className="flex flex-col gap-6">
                        <Link href="#solutions" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-white-color">Solutions</Link>
                        <Link href="#network" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-white-color">Network</Link>
                        <Link href="#vault" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-white-color">Vault</Link>
                        <Link href="#api" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-white-color">API</Link>
                        {!auth.user && (
                            <Link 
                                href={route('login')} 
                                onClick={() => setMobileMenuOpen(false)}
                                className="theme-button style-1 w-full"
                            >
                                <span data-text="Connect Node">Connect Node</span>
                                <i className="fa-solid fa-arrow-right"><ArrowRight size={14} /></i>
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
