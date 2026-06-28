import { Link } from '@inertiajs/react';
import { LayoutGrid, Zap, User, Menu, X } from 'lucide-react';
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
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
                isScrolled ? "glass mt-4 mx-6 rounded-xl py-3" : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(200,166,69,0.3)] group-hover:shadow-[0_0_30px_rgba(200,166,69,0.5)] transition-all">
                        <Zap className="text-background w-6 h-6 fill-background" />
                    </div>
                    <span className="text-2xl font-serif tracking-tight text-text-primary-dark">
                        Neural<span className="text-secondary">Flow</span>
                    </span>
                </Link>

                {/* Navigation - Desktop */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#solutions" className="text-sm font-medium text-text-secondary-dark hover:text-text-primary-dark transition-colors tracking-wide">Solutions</Link>
                    <Link href="#network" className="text-sm font-medium text-text-secondary-dark hover:text-text-primary-dark transition-colors tracking-wide">Network</Link>
                    <Link href="#vault" className="text-sm font-medium text-text-secondary-dark hover:text-text-primary-dark transition-colors tracking-wide">Vault</Link>
                    <Link href="#api" className="text-sm font-medium text-text-secondary-dark hover:text-text-primary-dark transition-colors tracking-wide">API</Link>
                </nav>

                {/* Status & Action */}
                <div className="flex items-center gap-4 lg:gap-6">
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-dark/50 border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_rgba(52,168,83,0.5)]" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-text-secondary-dark">
                            System: Operational
                        </span>
                    </div>

                    {auth.user ? (
                        <Link 
                            href={route('dashboard')}
                            className="hidden sm:flex items-center gap-2 bg-text-primary-dark text-background-dark px-5 py-2 rounded-full font-bold text-sm hover:bg-secondary transition-all hover:scale-105 active:scale-95"
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span>Dashboard</span>
                        </Link>
                    ) : (
                        <Link 
                            href={route('login')}
                            className="hidden sm:flex items-center gap-2 bg-text-primary-dark text-background-dark px-5 py-2 rounded-full font-bold text-sm hover:bg-secondary transition-all hover:scale-105 active:scale-95 animate-soft-pulse"
                        >
                            <User className="w-4 h-4" />
                            <span>Connect Node</span>
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 glass rounded-lg border-white/10 text-text-primary-dark"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 mt-4 mx-6 p-6 glass rounded-2xl border-white/10 animate-in slide-in-from-top duration-300">
                    <nav className="flex flex-col gap-6">
                        <Link href="#solutions" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-text-primary-dark">Solutions</Link>
                        <Link href="#network" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-text-primary-dark">Network</Link>
                        <Link href="#vault" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-text-primary-dark">Vault</Link>
                        <Link href="#api" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-text-primary-dark">API</Link>
                        <hr className="border-white/5" />
                        {!auth.user && (
                            <Link 
                                href={route('login')} 
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 gold-gradient text-background-dark py-4 rounded-xl font-bold"
                            >
                                <User className="w-5 h-5" />
                                Connect Node
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
