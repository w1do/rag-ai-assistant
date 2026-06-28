import { Lightbulb } from 'lucide-react';

interface TipsProps {
    title?: string;
    tips: string[];
}

export default function Tips({ title = 'Полезные советы', tips }: TipsProps) {
    return (
        <div className="bg-background-one border border-border-color-one rounded-three p-6 mb-8 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br from-primary-color to-white-color" />
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary-rgb-12 p-2.5 rounded-xl border border-primary-color/20">
                        <Lightbulb className="w-5 h-5 text-primary-color" />
                    </div>
                    <h3 className="text-white-color font-title text-lg">{title}</h3>
                </div>
                <ul className="space-y-3">
                    {tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3 text-text-secondary-dark text-sm leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-color mt-1.5 shrink-0 shadow-[0_0_8px_rgba(223,255,0,0.5)]" />
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
