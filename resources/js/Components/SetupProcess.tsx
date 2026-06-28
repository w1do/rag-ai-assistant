import { UserPlus, PlusCircle, UploadCloud, CheckCircle } from 'lucide-react';

interface Step {
    title: string;
    description: string;
    icon: any;
}

/**
 * Компонент секции "Процесс настройки".
 * 
 * Отображает пошаговый процесс создания и настройки RAG-ассистента.
 * Состоит из 4 шагов: Регистрация, Создание, Загрузка и Интеграция.
 * 
 * @component
 */
export default function SetupProcess() {
    const steps: Step[] = [
        {
            title: "Регистрация",
            description: "Создайте аккаунт за 30 секунд и получите доступ к персональной панели управления.",
            icon: UserPlus,
        },
        {
            title: "Создание бота",
            description: "Дайте имя вашему ассистенту, выберите его роль и стиль общения с клиентами.",
            icon: PlusCircle,
        },
        {
            title: "Загрузка данных",
            description: "Загрузите документы (PDF, Word) или отправьте голосовое сообщение для обучения ИИ.",
            icon: UploadCloud,
        },
        {
            title: "Готово к встройке",
            description: "Скопируйте готовый код виджета и добавьте его на свой сайт в один клик.",
            icon: CheckCircle,
        },
    ];

    return (
        <section id="setup-process" className="py-24 bg-background-dark">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif text-text-primary-dark sm:text-5xl">
                        Deployment <span className="text-secondary">Pipeline</span>
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary-dark">
                        Four industrial phases to initialize your custom RAG orchestration.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={index}
                                className="group relative flex flex-col items-center text-center rounded-2xl glass p-7 border-white/5 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 gold-gradient" />
                                
                                <div className="relative z-10 flex flex-col items-center w-full">
                                    <div className="relative mb-6">
                                        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full gold-gradient text-[10px] font-bold text-background-dark shadow-md">
                                            {index + 1}
                                        </div>
                                        
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl glass text-secondary border-white/10 group-hover:gold-gradient group-hover:text-background-dark transition-all">
                                            <Icon className="h-8 w-8" />
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-text-primary-dark mb-3">{step.title}</h3>
                                    <p className="text-text-secondary-dark text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
