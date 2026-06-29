import React from 'react';
import { Megaphone, ExternalLink } from 'lucide-react';

export default function GradientAlert() {
    return (
        <div className="relative group overflow-hidden rounded-one p-[1px] transition-all duration-500 hover:shadow-[0_0_20px_rgba(223,255,0,0.15)] wow fadeInUp">
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-primary-color),#ffffff,var(--color-primary-color))] bg-[length:200%_100%] animate-[shimmer_3s_infinite_linear]"></div>
            
            {/* Content Container */}
            <div className="relative bg-background-one rounded-[1px] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-rgb-12 flex items-center justify-center text-primary-color">
                        <Megaphone className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-white-color font-medium leading-relaxed">
                            Оставайтесь всегда на связи с нами, следите за новостями проекта и создавайте ИИ-ботов эффективней! Ссылка на группу ВК: <a href="https://vk.com/botsync" target="_blank" rel="noopener noreferrer" className="text-primary-color hover:underline">botsync</a>
                        </p>
                    </div>
                </div>
                
                <a 
                    href="https://vk.com/botsync" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-2 px-6 py-2 rounded-full bg-primary-color text-black-color font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                >
                    Группа ВК BotSync
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
}
