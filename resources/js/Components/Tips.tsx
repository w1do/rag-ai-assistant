import { Lightbulb, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface TipsProps {
    title?: string;
    tips: string[];
}

export default function Tips({ title = 'Полезные советы', tips }: TipsProps) {
    return (
        <div className="mb-8 relative group">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="tips-swiper !pb-10"
            >
                {tips.map((tip, index) => (
                    <SwiperSlide key={index}>
                        <blockquote className="bg-background-one border-r-2 border-primary-color rounded-[5px] p-8 relative overflow-hidden flex flex-col min-h-[180px] justify-center">
                            {/* 3D Icon Effect */}
                            <div className="absolute top-4 right-8 opacity-10 pointer-events-none">
                                <div className="relative w-16 h-16 transform-gpu rotate-12 transition-transform duration-700 group-hover:rotate-0">
                                    <Quote className="w-16 h-16 text-primary-color absolute -top-1 -left-1 blur-[1px]" />
                                    <Quote className="w-16 h-16 text-white-color relative z-10" />
                                </div>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="relative group/icon">
                                        {/* 3D Lightbulb Effect */}
                                        <div className="w-10 h-10 bg-primary-rgb-12 rounded-lg border border-primary-color/20 flex items-center justify-center transform-gpu transition-all duration-500 group-hover/icon:[transform:rotateY(20deg)_translateY(-4px)] shadow-[4px_4px_0px_rgba(223,255,0,0.2)]">
                                            <Lightbulb className="w-5 h-5 text-primary-color animate-soft-pulse" />
                                        </div>
                                    </div>
                                    <h3 className="text-white-color font-title text-sm uppercase tracking-wider">{title}</h3>
                                </div>
                                <p className="text-text-secondary-dark text-base leading-relaxed italic pr-12">
                                    "{tip}"
                                </p>
                            </div>
                        </blockquote>
                    </SwiperSlide>
                ))}
            </Swiper>

            <style dangerouslySetInnerHTML={{ __html: `
                .tips-swiper .swiper-button-next,
                .tips-swiper .swiper-button-prev {
                    color: var(--color-primary-color) !important;
                    transform: scale(0.6);
                    background: rgba(25, 25, 25, 0.8);
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 1px solid rgba(223, 255, 0, 0.2);
                }
                .tips-swiper .swiper-pagination-bullet {
                    background: var(--color-white-color) !important;
                    opacity: 0.3;
                }
                .tips-swiper .swiper-pagination-bullet-active {
                    background: var(--color-primary-color) !important;
                    opacity: 1;
                    width: 20px;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                }
            `}} />
        </div>
    );
}
