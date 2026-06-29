import { type LucideIcon, HelpCircle } from 'lucide-react';

interface FaqItem {
    question: string;
    answer: string;
    icon?: LucideIcon;
}

interface Props {
    items: FaqItem[];
    className?: string;
}

function FaqCard({ item }: { item: FaqItem }) {
    const Icon = item.icon ?? HelpCircle;

    return (
        <div className="flex gap-5 bg-background-one border border-border-color-one rounded-three p-6">
            <div className="shrink-0">
                <div className="w-12 h-12 bg-primary-rgb-12 border border-primary-color rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary-color" />
                </div>
            </div>
            <div>
                <h4 className="font-title text-white-color text-base mb-2 leading-snug">
                    {item.question}
                </h4>
                <p className="text-text-secondary-dark text-sm leading-relaxed">
                    {item.answer}
                </p>
            </div>
        </div>
    );
}

export default function Faq({ items, className = '' }: Props) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
            {items.map((item, index) => (
                <FaqCard key={index} item={item} />
            ))}
        </div>
    );
}
