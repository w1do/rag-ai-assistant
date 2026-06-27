import { ReactNode } from 'react';

interface TooltipProps {
    text: string;
    children: ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
    return (
        <div className="group relative inline-block w-full">
            {children}
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-50">
                <div className="rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-sm">
                    {text}
                    <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
            </div>
        </div>
    );
}
