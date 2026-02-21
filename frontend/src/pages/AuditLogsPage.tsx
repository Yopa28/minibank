import React, { useState, useEffect } from 'react';
import {
    History,
    Search,
    Download,
    RefreshCw,
    Clock,
    User,
    Activity
} from 'lucide-react';
import { Card } from '../components/Card';
import { DataTable } from '../components/DataTable';
import { auditService } from '../services/api';

const AuditLogsPage: React.FC = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('all');

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await auditService.getAll();
            setLogs(res.data.reverse());
        } catch (error) {
            console.error("Failed to fetch logs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter((log: any) => {
        const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.entityId?.toString().includes(searchTerm);
        const matchesAction = actionFilter === 'all' || log.action === actionFilter;
        return matchesSearch && matchesAction;
    });

    const columns = [
        {
            header: 'Action',
            accessor: (log: any) => (
                <span className={clsx(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                    log.action === 'TRANSFER' ? "bg-blue-100 text-blue-700" :
                        log.action === 'WITHDRAW' ? "bg-red-100 text-red-700" :
                            log.action === 'DEPOSIT' ? "bg-emerald-100 text-emerald-700" :
                                "bg-slate-100 text-slate-700"
                )}>
                    {log.action}
                </span>
            )
        },
        {
            header: 'Entity',
            accessor: (log: any) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{log.entity}</span>
                    <span className="text-xs text-slate-400 font-mono">ID: {log.entityId || 'N/A'}</span>
                </div>
            )
        },
        {
            header: 'Performed By',
            accessor: (log: any) => (
                <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mr-2">
                        <User className="w-3 h-3" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 uppercase">{log.performedBy}</span>
                </div>
            )
        },
        {
            header: 'Description',
            accessor: 'description',
            className: 'max-w-md truncate text-slate-500 italic'
        },
        {
            header: 'Timestamp',
            accessor: (log: any) => (
                <div className="flex items-center text-xs text-slate-400">
                    <Clock className="w-3 h-3 mr-1.5" />
                    {new Date(log.createdAt).toLocaleString()}
                </div>
            )
        },
    ];

    const actions = Array.from(new Set(logs.map((log: any) => log.action)));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">System Audit Logs</h1>
                    <p className="text-slate-500">Track and monitor all administrative and system activities.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={fetchLogs}
                        className="btn btn-secondary"
                        disabled={loading}
                    >
                        <RefreshCw className={clsx("w-4 h-4 mr-2", loading && "animate-spin")} />
                        Refresh
                    </button>
                    <button className="btn btn-secondary">
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </button>
                </div>
            </div>

            <Card>
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by description, user, or entity ID..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-all font-sans"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-slate-400" />
                        <select
                            className="text-sm border-slate-200 rounded-lg focus:ring-primary-500 capitalize"
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                        >
                            <option value="all">All Actions</option>
                            {actions.map((act: any) => (
                                <option key={act} value={act} className="capitalize">{act.toLowerCase()}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredLogs}
                    loading={loading}
                    emptyMessage="No audit logs found matching your criteria."
                />
            </Card>
        </div>
    );
};

export default AuditLogsPage;

function clsx(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
