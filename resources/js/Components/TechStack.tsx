import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import { Cpu, Database, Brain, Zap, Workflow, Sparkles, Layers, Library, Link2, Bot } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/autoplay';

interface Technology {
    name: string;
    description: string;
    icon: any;
    color: string;
}

/**
 * Компонент секции технологий и нейросетей.
 * 
 * Отображает бесконечную карусель (Swiper) с логотипами и названиями
 * используемых технологий: Claude, GPT, Gemini, Embeddings, LlamaIndex, LangChain, Qdrant.
 */
export default function TechStack() {
    const technologies: Technology[] = [
        {
            name: "Claude 3.5",
            description: "Продвинутая модель от Anthropic для глубокого понимания контекста.",
            icon: Bot,
            color: "text-orange-500",
        },
        {
            name: "GPT 5.5 / 4.0",
            description: "Самые мощные языковые модели от OpenAI для решения сложных задач.",
            icon: Cpu,
            color: "text-green-500",
        },
        {
            name: "Gemini",
            description: "Мультимодальная нейросеть от Google с огромным окном контекста.",
            icon: Sparkles,
            color: "text-blue-500",
        },
        {
            name: "Embeddings",
            description: "Векторные представления данных для точного поиска информации.",
            icon: Layers,
            color: "text-indigo-500",
        },
        {
            name: "LlamaIndex",
            description: "Инструментарий для построения эффективных RAG-систем.",
            icon: Library,
            color: "text-purple-500",
        },
        {
            name: "LangChain",
            description: "Фреймворк для создания цепочек действий и агентов на базе LLM.",
            icon: Link2,
            color: "text-emerald-500",
        },
        {
            name: "Qdrant",
            description: "Высокопроизводительная векторная база данных для хранения знаний.",
            icon: Database,
            color: "text-red-500",
        },
    ];

    return (
        <section id="tech-stack" className="py-24 bg-white overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Технологии и нейросети
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Мы используем передовые разработки в области ИИ для создания вашего ассистента
                    </p>
                </div>

                <div className="relative">
                    <Swiper
                        modules={[Autoplay, FreeMode]}
                        spaceBetween={24}
                        slidesPerView={1}
                        loop={true}
                        freeMode={true}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                        }}
                        speed={5000}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                            1280: {
                                slidesPerView: 4,
                            },
                        }}
                        className="tech-swiper"
                    >
                        {technologies.map((tech, index) => {
                            const Icon = tech.icon;
                            return (
                                <SwiperSlide key={index}>
                                    <div className="group relative flex flex-col rounded-3xl bg-white p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-[#F5F5F5] hover:-translate-y-1 h-full overflow-hidden">
                                        {/* Hover Gradient Background (3 colors as per cards.md) */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400" />
                                        
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 transition-colors group-hover:bg-white group-hover:shadow-md ${tech.color}`}>
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">{tech.name}</h3>
                                            </div>
                                            <p className="text-gray-500 text-sm leading-relaxed">
                                                {tech.description}
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .tech-swiper .swiper-wrapper {
                    transition-timing-function: linear !important;
                }
                .tech-swiper {
                    padding: 20px 0;
                }
            `}} />
        </section>
    );
}
