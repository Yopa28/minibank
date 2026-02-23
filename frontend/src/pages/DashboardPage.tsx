import React, { useState, useEffect } from 'react';
import {
    Users,
    DollarSign,
    Snowflake,
    Activity,
    ArrowUpRight
} from 'lucide-react';
import { StatCard, Card } from '../components/Card';
import { DataTable } from '../components/DataTable';
import { accountService, auditService, type Account, type AuditLog } from '../services/api';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import type { Column } from '../components/DataTable';

const chartData = [
    { name: 'Mon', transactions: 4000 },
    { name: 'Tue', transactions: 3000 },
    { name: 'Wed', transactions: 2000 },
    { name: 'Thu', transactions: 2780 },
    { name: 'Fri', transactions: 1890 },
    { name: 'Sat', transactions: 2390 },
    { name: 'Sun', transactions: 3490 },
];

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState({
        totalAccounts: 0,
        totalBalance: 0,
        frozenAccounts: 0,
        totalLogs: 0
    });
    const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [accountsRes, logsRes] = await Promise.all([
                    accountService.getAll(),
                    auditService.getAll()
                ]);

                const accounts = accountsRes.data;
                const logs = logsRes.data;

                setStats({
                    totalAccounts: accounts.length,
                    totalBalance: accounts.reduce((acc: number, curr: Account) => acc + curr.balance, 0),
                    frozenAccounts: accounts.filter((acc: Account) => acc.isFrozen).length,
                    totalLogs: logs.length
                });

                setRecentLogs(logs.slice(-5).reverse());

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const columns: Column<AuditLog>[] = [
        {
            header: 'Action',
            accessor: (log) => (
                <span className={clsx(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                    log.action === 'TRANSFER' ? "bg-blue-100 text-blue-700" :
                        log.action === 'WITHDRAW' ? "bg-red-100 text-red-700" :
                            "bg-green-100 text-green-700"
                )}>
                    {log.action}
                </span>
            )
        },
        { header: 'Performed By', accessor: 'performedBy' },
        { header: 'Description', accessor: 'description', className: 'max-w-xs truncate' },
        {
            header: 'Time',
            accessor: (log) => new Date(log.createdAt).toLocaleTimeString()
        },
    ];


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500">Welcome to the Core Banking Admin Portal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Accounts"
                    value={stats.totalAccounts}
                    icon={Users}
                    trend={{ value: "+1.2%", positive: true }}
                    color="bg-primary-600"
                />
                <StatCard
                    title="Total Balance"
                    value={`$${stats.totalBalance.toLocaleString()}`}
                    icon={DollarSign}
                    trend={{ value: "+2.4%", positive: true }}
                    color="bg-emerald-600"
                />
                <StatCard
                    title="Frozen Accounts"
                    value={stats.frozenAccounts}
                    icon={Snowflake}
                    trend={{ value: "Alert", positive: false }}
                    color="bg-amber-600"
                />
                <StatCard
                    title="System Activities"
                    value={stats.totalLogs}
                    icon={Activity}
                    color="bg-indigo-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Transaction Volume" className="lg:col-span-2">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    hide
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="transactions"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorTx)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Recent Activity">
                    <div className="space-y-6">
                        {recentLogs.map((log: any) => (
                            <div key={log.id} className="flex items-start">
                                <div className={clsx(
                                    "p-2 rounded-full mr-3 mt-1",
                                    log.action === 'TRANSFER' ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-600"
                                )}>
                                    {log.action === 'TRANSFER' ? <ArrowUpRight className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{log.description}</p>
                                    <p className="text-xs text-slate-400">{new Date(log.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                        {recentLogs.length === 0 && (
                            <p className="text-sm text-slate-500 text-center py-4">No recent activity</p>
                        )}
                        <button className="w-full py-2 text-sm font-semibold text-primary-600 border border-primary-100 rounded-lg hover:bg-primary-50 transition-colors">
                            View All Logs
                        </button>
                    </div>
                </Card>
            </div>

            <Card title="Latest Transactions" subtitle="Most recent state-changing operations">
                <DataTable
                    columns={columns}
                    data={recentLogs}
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default DashboardPage;

// Helper function for clsx
function clsx(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
