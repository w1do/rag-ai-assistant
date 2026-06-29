import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
    type?: AlertType;
    title?: string;
    children: ReactNode;
    onClose?: () => void;
    className?: string;
}

export default function Alert({
    type = 'info',
    title,
    children,
    onClose,
    className,
}: AlertProps) {
    const icons = {
        success: <CheckCircle className="h-5 w-5 text-primary-color" />,
        error: <XCircle className="h-5 w-5 text-red-500" />,
        warning: <AlertCircle className="h-5 w-5 text-warning" />,
        info: <Info className="h-5 w-5 text-blue-400" />,
    };

    const styles = {
        success: 'border-primary-color/20 bg-primary-color/5',
        error: 'border-red-500/20 bg-red-500/5',
        warning: 'border-warning/20 bg-warning/5',
        info: 'border-blue-400/20 bg-blue-400/5',
    };

    return (
        <div
            className={cn(
                'relative flex w-full gap-4 rounded-two border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2',
                styles[type],
                className
            )}
        >
            <div className="shrink-0">{icons[type]}</div>
            <div className="flex-1">
                {title && (
                    <h3 className="mb-1 font-title text-sm font-medium text-white-color">
                        {title}
                    </h3>
                )}
                <div className="text-sm text-text-secondary-dark">{children}</div>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="shrink-0 text-text-secondary-dark hover:text-white-color transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
            
            {/* Gradient glow effect */}
            <div className={cn(
                "absolute inset-0 -z-10 rounded-two opacity-20 blur-xl transition-opacity group-hover:opacity-40",
                type === 'success' ? "bg-primary-color/20" : 
                type === 'error' ? "bg-red-500/20" : 
                type === 'warning' ? "bg-warning/20" : "bg-blue-400/20"
            )}></div>
        </div>
    );
}
