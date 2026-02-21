import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Snowflake,
    Sun,
    History,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Calendar
} from 'lucide-react';
import { Card } from '../components/Card';
import { DataTable } from '../components/DataTable';
import { accountService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { NotificationToast } from '../components/NotificationToast';

const AccountDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { role } = useAuth();

    const [account, setAccount] = useState<any>(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const fetchData = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const [accRes, txRes] = await Promise.all([
                accountService.getById(id),
                accountService.getTransactions(id)
            ]);
            setAccount(accRes.data);
            setTransactions(txRes.data.reverse());
        } catch (error) {
            setNotification({ message: "Failed to load account details", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleToggleFreeze = async () => {
        if (!account) return;
        try {
            if (account.isFrozen) {
                await accountService.unfreeze(account.id);
                setNotification({ message: "Account unfrozen successfully", type: "success" });
            } else {
                await accountService.freeze(account.id);
                setNotification({ message: "Account frozen successfully", type: "success" });
            }
            fetchData();
        } catch (error) {
            setNotification({ message: "Action failed", type: "error" });
        }
    };

    const columns = [
        {
            header: 'Type',
            accessor: (tx: any) => (
                <div className="flex items-center">
                    {tx.type === 'deposit' || tx.type === 'transfer_in' ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className="capitalize font-medium">{tx.type.replace('_', ' ')}</span>
                </div>
            )
        },
        {
            header: 'Amount',
            accessor: (tx: any) => (
                <span className={clsx(
                    "font-bold",
                    tx.type === 'deposit' || tx.type === 'transfer_in' ? "text-green-600" : "text-red-600"
                )}>
                    {tx.type === 'deposit' || tx.type === 'transfer_in' ? '+' : '-'}
                    ${tx.amount.toLocaleString()}
                </span>
            )
        },
        {
            header: 'Reference/ID',
            accessor: (tx: any) => tx.referenceId ? `#${tx.referenceId}` : '-'
        },
        {
            header: 'Date & Time',
            accessor: (tx: any) => new Date(tx.createdAt).toLocaleString()
        },
    ];

    if (loading && !account) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (!account) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-slate-800">Account not found</h2>
                <button onClick={() => navigate('/accounts')} className="btn btn-secondary mt-4">
                    Back to Accounts
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/accounts')}
                    className="flex items-center text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Accounts
                </button>
                {role === 'admin' && (
                    <button
                        onClick={handleToggleFreeze}
                        className={clsx(
                            "btn",
                            account.isFrozen ? "btn-secondary border-amber-300 text-amber-700" : "btn-danger"
                        )}
                    >
                        {account.isFrozen ? (
                            <><Sun className="w-4 h-4 mr-2" /> Unfreeze Account</>
                        ) : (
                            <><Snowflake className="w-4 h-4 mr-2" /> Freeze Account</>
                        )}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 border-t-4 border-t-primary-600">
                    <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
                        <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-3xl font-bold mb-4">
                            {account.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">{account.name}</h2>
                        <p className="text-sm text-slate-500 font-mono mt-1">ID: #{account.id}</p>
                        <span className={clsx(
                            "mt-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                            account.isFrozen ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        )}>
                            {account.isFrozen ? 'Account Frozen' : 'Account Active'}
                        </span>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center text-slate-500">
                                <DollarSign className="w-4 h-4 mr-2" /> Available Balance
                            </div>
                            <span className="font-bold text-slate-900 text-lg">${account.balance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center text-slate-500">
                                <Calendar className="w-4 h-4 mr-2" /> Opened On
                            </div>
                            <span className="font-medium text-slate-700">{new Date(account.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </Card>

                <Card title="Transaction History" headerAction={<History className="w-5 h-5 text-slate-400" />} className="lg:col-span-2">
                    <DataTable
                        columns={columns}
                        data={transactions}
                        loading={loading}
                        emptyMessage="No transactions found for this account."
                    />
                </Card>
            </div>

            {notification && (
                <NotificationToast
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default AccountDetailsPage;

function clsx(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
