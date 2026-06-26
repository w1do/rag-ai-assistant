import { Database, RefreshCw, Lock, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from '@inertiajs/react';

/**
 * Компонент секции "Интеграция и синхронизация данных".
 * 
 * Описывает возможности подключения к CRM, закрытым системам и автопулинга данных.
 */
export default function DataSync() {
    const features = [
        {
            title: "CRM и закрытые системы",
            description: "Прямая интеграция с Bitrix24, amoCRM, Salesforce и вашими внутренними ERP-системами через защищенный API-шлюз.",
            icon: Database,
            color: "blue",
        },
        {
            title: "Личные кабинеты",
            description: "Безопасное извлечение данных из закрытых разделов сайтов и личных кабинетов с поддержкой OAuth и кастомной авторизации.",
            icon: Lock,
            color: "indigo",
        },
        {
            title: "Автопулинг данных",
            description: "Автоматическое регулярное обновление базы знаний. Система сама заберет новые данные из ваших источников по расписанию.",
            icon: RefreshCw,
            color: "cyan",
        },
        {
            title: "Синхронизация в реальном времени",
            description: "Любые изменения в ваших системах мгновенно отражаются в ответах ИИ-ассистента благодаря технологии Webhooks.",
            icon: Zap,
            color: "purple",
        }
    ];

    return (
        <section id="data-sync" className="py-24 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                            Интеграция и синхронизация ваших данных
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Не тратьте время на ручное копирование информации. BotSync подключается напрямую к вашим рабочим инструментам и автоматически поддерживает базу знаний в актуальном состоянии.
                        </p>
                        
                        <div className="space-y-6 mb-10">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                                    <ShieldCheck className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Безопасность корпоративного уровня</h4>
                                    <p className="text-sm text-gray-500">Данные передаются по зашифрованным каналам и хранятся в изолированных векторах.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <Database className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Поддержка On-premise</h4>
                                    <p className="text-sm text-gray-500">Возможность подключения к системам внутри вашего контура (VPN/White-label).</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href={route('register')}
                            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-all active:scale-95"
                        >
                            Настроить синхронизацию <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div 
                                    key={idx}
                                    className="p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-50 transition-all group"
                                >
                                    <div className={`h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 transition-colors group-hover:bg-blue-600 group-hover:text-white`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
