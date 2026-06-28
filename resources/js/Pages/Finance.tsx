import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { CreditCard, ArrowUpCircle, ArrowDownCircle, Clock, Info } from 'lucide-react';

interface Payment {
    id: number;
    amount: number;
    currency: string;
    status: string;
    payment_method: string;
    paid_at: string | null;
    created_at: string;
    subscription_id: number | null;
    metadata: any;
}

interface Props {
    payments: {
        data: Payment[];
        links: any[];
    };
}

export default function Finance({ payments }: Props) {
    const formatCurrency = (amount: number) => {
        return `${(amount / 100).toLocaleString('ru-RU')} ₽`;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-500">Завершено</span>;
            case 'pending':
                return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-500">В ожидании</span>;
            case 'failed':
                return <span className="px-2 py-1 text-xs font-medium rounded-full bg-rose-500/10 text-rose-500">Ошибка</span>;
            default:
                return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-500/10 text-gray-500">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Финансы" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <Breadcrumbs items={[{ label: 'Финансы' }]} />

                    <div className="mb-8">
                        <h3 className="text-3xl font-title text-white-color mb-4">
                            История <span className="text-primary-color">финансов</span>
                        </h3>
                        <p className="text-text-secondary-dark max-w-2xl">
                            Управляйте своим балансом, просматривайте историю пополнений и списаний за тарифные планы.
                        </p>
                    </div>

                    <div className="bg-background-one border border-border-color-one rounded-three overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border-color-one bg-background-two/50">
                                        <th className="p-4 text-sm font-title text-white-color">Тип</th>
                                        <th className="p-4 text-sm font-title text-white-color">Сумма</th>
                                        <th className="p-4 text-sm font-title text-white-color">Метод</th>
                                        <th className="p-4 text-sm font-title text-white-color">Статус</th>
                                        <th className="p-4 text-sm font-title text-white-color">Дата</th>
                                        <th className="p-4 text-sm font-title text-white-color">Информация</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.data.length > 0 ? (
                                        payments.data.map((payment) => (
                                            <tr key={payment.id} className="border-b border-border-color-one hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {!payment.subscription_id ? (
                                                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                                                <ArrowUpCircle className="w-5 h-5" />
                                                            </div>
                                                        ) : (
                                                            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                                                                <ArrowDownCircle className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                        <span className="text-sm text-white-color font-medium">
                                                            {!payment.subscription_id ? 'Пополнение' : 'Списание'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`text-sm font-title ${!payment.subscription_id ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {!payment.subscription_id ? '+' : '-'}{formatCurrency(payment.amount)}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2 text-sm text-text-secondary-dark">
                                                        <CreditCard className="w-4 h-4" />
                                                        {payment.payment_method === 'card' ? 'Банковская карта' : 'Баланс'}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {getStatusBadge(payment.status)}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2 text-sm text-text-secondary-dark">
                                                        <Clock className="w-4 h-4" />
                                                        {formatDate(payment.paid_at || payment.created_at)}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-text-secondary-dark">
                                                    {payment.metadata?.plan_name ? (
                                                        <div className="flex items-center gap-1">
                                                            <Info className="w-4 h-4" />
                                                            Тариф: {payment.metadata.plan_name}
                                                        </div>
                                                    ) : !payment.subscription_id ? 'Пополнение баланса' : '—'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-text-secondary-dark italic">
                                                История операций пока пуста
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
