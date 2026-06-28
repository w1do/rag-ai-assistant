import { SVGAttributes } from 'react';

export default function ApplicationLogo({ className }: { className?: string }) {
    return (
        <span className={`text-xl font-serif font-bold tracking-tight text-[#111111] ${className}`}>
            MANUFLEX
        </span>
    );
}
