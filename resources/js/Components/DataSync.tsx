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
        <section id="data-sync" className="py-24 bg-background-dark relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] opacity-50 animate-pulse" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-[120px] opacity-50 animate-float" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-serif text-text-primary-dark sm:text-5xl mb-6">
                            Neural <span className="text-secondary">Orchestration</span> & Sync
                        </h2>
                        <p className="text-lg text-text-secondary-dark mb-8 leading-relaxed">
                            Seamlessly integrate your industrial data stream. NeuralFlow connects directly to your ecosystem, maintaining a real-time, high-precision knowledge vault.
                        </p>
                        
                        <div className="space-y-6 mb-10">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full glass text-success border-white/10 shadow-lg shadow-success/10">
                                    <ShieldCheck className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-primary-dark">Enterprise-Grade Security</h4>
                                    <p className="text-sm text-text-secondary-dark">Data is processed through encrypted industrial tunnels and stored in isolated vectors.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full glass text-secondary border-white/10 shadow-lg shadow-secondary/10">
                                    <Database className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-primary-dark">On-premise Protocols</h4>
                                    <p className="text-sm text-text-secondary-dark">Full support for internal network deployments (VPN/White-label connectivity).</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href={route('register')}
                            className="inline-flex items-center gap-2 rounded-xl gold-gradient px-8 py-4 text-sm font-bold text-background-dark shadow-xl shadow-secondary/10 hover:scale-105 transition-all active:scale-95"
                        >
                            Initialise Synchronization <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div 
                                    key={idx}
                                    className="relative p-7 rounded-2xl glass border-white/5 hover:border-white/10 hover:scale-[1.02] transition-all duration-300 group overflow-hidden"
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 gold-gradient" />
                                    <div className="relative z-10">
                                        <div className={`h-12 w-12 rounded-xl glass border-white/10 flex items-center justify-center mb-4 transition-all group-hover:gold-gradient group-hover:text-background-dark`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-text-primary-dark mb-2">{feature.title}</h3>
                                        <p className="text-sm text-text-secondary-dark leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
