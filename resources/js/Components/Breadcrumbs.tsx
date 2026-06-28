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
        <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                    <Link
                        href={route('dashboard')}
                        className="inline-flex items-center text-sm font-medium text-text-secondary-dark hover:text-primary-color transition-colors"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Главная
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            <ChevronRight className="w-4 h-4 text-border-color-one mx-1" />
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="ml-1 text-sm font-medium text-text-secondary-dark hover:text-primary-color transition-colors md:ml-2"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="ml-1 text-sm font-medium text-white-color md:ml-2">
                                    {item.label}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
