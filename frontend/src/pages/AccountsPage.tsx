import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    Snowflake,
    Sun,
    UserPlus
} from 'lucide-react';
import { Card } from '../components/Card';
import { DataTable } from '../components/DataTable';
import { accountService, type Account } from '../services/api';
import type { Column } from '../components/DataTable';
import { useAuth } from '../context/AuthContext';
import { NotificationToast } from '../components/NotificationToast';

const AccountsPage: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const { role } = useAuth();
    const navigate = useNavigate();

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const res = await accountService.getAll();
            setAccounts(res.data);

        } catch (error) {
            setNotification({ message: "Failed to load accounts", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleToggleFreeze = async (e: React.MouseEvent, id: number, isFrozen: boolean) => {
        e.stopPropagation();
        try {
            if (isFrozen) {
                await accountService.unfreeze(id);
                setNotification({ message: `Account #${id} unfrozen successfully`, type: "success" });
            } else {
                await accountService.freeze(id);
                setNotification({ message: `Account #${id} frozen successfully`, type: "success" });
            }
            fetchAccounts();
        } catch (error) {
            setNotification({ message: "Action failed. Check your permissions.", type: "error" });
        }
    };

    const filteredAccounts = accounts.filter((acc: any) => {
        const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            acc.id.toString().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'frozen' && acc.isFrozen) ||
            (statusFilter === 'active' && !acc.isFrozen);
        return matchesSearch && matchesStatus;
    });

    const columns: Column<Account>[] = [
        { header: 'ID', accessor: 'id', className: 'font-mono text-xs w-16' },
        {
            header: 'Account Holder',
            accessor: (acc) => (
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs mr-3">
                        {acc.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-900">{acc.name}</span>
                </div>
            )
        },
        {
            header: 'Balance',
            accessor: (acc) => (
                <span className="font-semibold text-slate-900">${acc.balance.toLocaleString()}</span>
            )
        },
        {
            header: 'Status',
            accessor: (acc) => (
                <span className={clsx(
                    "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                    acc.isFrozen ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                )}>
                    {acc.isFrozen ? 'Frozen' : 'Active'}
                </span>
            )
        },
        {
            header: 'Created Date',
            accessor: (acc) => new Date(acc.createdAt).toLocaleDateString()
        },
        {
            header: 'Actions',
            accessor: (acc) => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => navigate(`/accounts/${acc.id}`)}
                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    {role === 'admin' && (
                        <button
                            onClick={(e) => handleToggleFreeze(e, acc.id, acc.isFrozen)}
                            className={clsx(
                                "p-1.5 rounded transition-colors",
                                acc.isFrozen
                                    ? "text-amber-500 hover:bg-amber-50 hover:text-amber-600"
                                    : "text-slate-400 hover:bg-red-50 hover:text-red-600"
                            )}
                            title={acc.isFrozen ? "Unfreeze Account" : "Freeze Account"}
                        >
                            {acc.isFrozen ? <Sun className="w-4 h-4" /> : <Snowflake className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            )
        }
    ];


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Accounts Management</h1>
                    <p className="text-slate-500">View and manage customer bank accounts.</p>
                </div>
                <button className="btn btn-primary">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create New Account
                </button>
            </div>

            <Card>
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                            className="text-sm border-slate-200 rounded-lg focus:ring-primary-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="frozen">Frozen</option>
                        </select>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredAccounts}
                    loading={loading}
                    rowClick={(acc) => navigate(`/accounts/${acc.id}`)}
                />
            </Card>

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

export default AccountsPage;

function clsx(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
