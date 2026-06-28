import { Bot } from 'lucide-react';

export default function ApplicationLogo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="w-12 h-12 bg-primary-color rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(223,255,0,0.3)]">
                <Bot className="w-7 h-7 text-black-color" />
            </div>
            <span className="text-2xl font-title tracking-tight text-white-color uppercase">
                Bot<span className="text-primary-color">Sync</span>
            </span>
        </div>
    );
}
