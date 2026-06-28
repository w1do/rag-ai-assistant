import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex mb-6 sm:mb-10 overflow-x-auto pb-2 custom-scrollbar" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 whitespace-nowrap">
                <li className="inline-flex items-center">
                    <Link
                        href={route('dashboard')}
                        className="inline-flex items-center text-[10px] font-title uppercase tracking-widest text-text-secondary-dark hover:text-primary-color transition-all duration-300 group"
                    >
                        <Home className="w-4 h-4 mr-2.5 transition-colors group-hover:text-primary-color" />
                        Главная
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <ChevronRight className="w-4 h-4 text-white-color mx-2 opacity-70" />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="text-[10px] font-title uppercase tracking-widest text-text-secondary-dark hover:text-primary-color transition-all duration-300"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-[10px] font-title uppercase tracking-widest text-primary-color">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
