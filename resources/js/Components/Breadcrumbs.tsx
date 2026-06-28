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
        <nav className="flex mb-10 overflow-x-auto pb-2 custom-scrollbar" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 whitespace-nowrap">
                <li className="inline-flex items-center">
                    <Link
                        href={route('dashboard')}
                        className="inline-flex items-center text-[10px] font-title uppercase tracking-widest text-text-secondary-dark hover:text-primary-color transition-all duration-300 group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-extra-color border border-border-color-one flex items-center justify-center mr-3 group-hover:border-primary-color/50 transition-colors">
                            <Home className="w-3.5 h-3.5" />
                        </div>
                        Главная
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <ChevronRight className="w-4 h-4 text-border-color-one mx-2 opacity-50" />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="text-[10px] font-title uppercase tracking-widest text-text-secondary-dark hover:text-primary-color transition-all duration-300"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-[10px] font-title uppercase tracking-widest text-white-color bg-primary-rgb-12 px-3 py-1.5 rounded-md border border-primary-color/20">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
