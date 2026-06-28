import { ShoppingBag, ShoppingCart, Wrench, Briefcase, Home, GraduationCap } from 'lucide-react';

interface UseCase {
    title: string;
    description: string;
    badges: string[];
    icon: any;
}

/**
 * Компонент секции "Кто использует умных ботов".
 * 
 * Отображает карточки отраслей бизнеса, которым полезен ИИ-ассистент.
 * Карточки стилизованы согласно дизайн-системе: белый фон, легкие тени, бейджи.
 */
export default function UseCases() {
    const useCases: UseCase[] = [
        {
            title: "Розничные сети",
            description: "Обучите ассистента на базе ваших товаров и услуг. Бот поможет покупателям найти нужный отдел, узнать о наличии или действующих акциях прямо в мессенджере.",
            badges: ["Розничная торговля", "Локальный бизнес", "Акции"],
            icon: ShoppingBag,
        },
        {
            title: "E-commerce",
            description: "Автоматизируйте поддержку клиентов 24/7. Бот ответит на вопросы о доставке, поможет с выбором размера и проконсультирует по характеристикам товаров.",
            badges: ["Онлайн-продажи", "Поддержка 24/7", "Маркетплейсы"],
            icon: ShoppingCart,
        },
        {
            title: "Автосервисы и СТО",
            description: "Записывайте клиентов на сервис через ИИ. Бот расскажет о стоимости работ, наличии запчастей и напомнит о необходимости планового ТО.",
            badges: ["Автобизнес", "Запись на сервис", "Запчасти"],
            icon: Wrench,
        },
        {
            title: "Маркетинговые агентства",
            description: "Используйте систему для мониторинга конкурентов ваших клиентов. Обучайте ботов на специфических нишах и предлагайте ИИ-ассистентов как часть своих услуг.",
            badges: ["Digital-агентства", "Анализ конкурентов", "SaaS"],
            icon: Briefcase,
        },
        {
            title: "Агентства недвижимости",
            description: "Бот проконсультирует по доступным объектам, условиям ипотеки и запишет на просмотр. Идеально для быстрой обработки входящих лидов.",
            badges: ["Недвижимость", "Лидогенерация", "Ипотека"],
            icon: Home,
        },
        {
            title: "Образовательные центры",
            description: "Обучите систему на учебных материалах и часто задаваемых вопросах. Помогайте студентам находить информацию в один клик.",
            badges: ["EdTech", "Онлайн-курсы", "База знаний"],
            icon: GraduationCap,
        },
    ];

    return (
        <section id="use-cases" className="py-24 bg-surface-dark/20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif text-text-primary-dark sm:text-5xl">
                        Industry <span className="text-secondary">Nodes</span>
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary-dark">
                        Precision-engineered AI solutions for diverse manufacturing and service sectors.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {useCases.map((useCase, index) => {
                        const Icon = useCase.icon;
                        return (
                            <div
                                key={index}
                                className="group relative flex flex-col rounded-2xl glass p-7 border-white/5 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 gold-gradient" />
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl glass text-secondary border-white/10 group-hover:gold-gradient group-hover:text-background-dark transition-all">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-text-primary-dark">{useCase.title}</h3>
                                    </div>

                                    <p className="text-text-secondary-dark text-sm leading-relaxed mb-8">
                                        {useCase.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {useCase.badges.map((badge) => (
                                            <span
                                                key={badge}
                                                className="inline-flex items-center rounded-full glass px-2.5 py-0.5 text-[10px] font-bold text-text-secondary-dark border-white/10 uppercase tracking-widest"
                                            >
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
