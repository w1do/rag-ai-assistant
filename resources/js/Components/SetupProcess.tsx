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
        <section id="setup-process" className="py-24 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Как запустить своего ассистента
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Всего 4 простых шага отделяют вас от умного чат-бота на вашем сайте
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={index}
                                className="group relative flex flex-col items-center text-center rounded-3xl bg-white p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-[#F5F5F5] hover:-translate-y-1 overflow-hidden"
                            >
                                {/* Hover Gradient Background (3 colors as per cards.md) */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400" />
                                
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="relative mb-6">
                                        {/* Number Badge */}
                                        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-md">
                                            {index + 1}
                                        </div>
                                        
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                            <Icon className="h-8 w-8" />
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
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
