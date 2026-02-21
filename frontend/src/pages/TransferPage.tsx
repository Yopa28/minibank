import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftRight,
    ShieldCheck,
    Info,
    ArrowRight
} from 'lucide-react';
import { Card } from '../components/Card';
import { FormInput } from '../components/FormInput';
import { accountService, transactionService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { NotificationToast } from '../components/NotificationToast';

const TransferPage: React.FC = () => {
    const [accounts, setAccounts] = useState([]);
    const [formData, setFormData] = useState({
        fromId: '',
        toId: '',
        amount: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const { userId } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
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
        fetchAccounts();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fromId || !formData.toId || !formData.amount) {
            setNotification({ message: "Please fill all fields", type: "error" });
            return;
        }

        if (formData.fromId === formData.toId) {
            setNotification({ message: "Source and destination accounts must be different", type: "error" });
            return;
        }

        try {
            setSubmitting(true);
            await transactionService.transfer({
                fromId: parseInt(formData.fromId),
                toId: parseInt(formData.toId),
                amount: parseFloat(formData.amount),
                performedBy: userId
            });
            setNotification({ message: "Transfer completed successfully!", type: "success" });
            setFormData({ fromId: '', toId: '', amount: '' });
            // Redirect after a short delay
            setTimeout(() => navigate('/accounts'), 2000);
        } catch (error: any) {
            const msg = error.response?.data?.message || "Transfer failed. Check balance or account status.";
            setNotification({ message: msg, type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    const accountOptions = accounts.map((acc: any) => ({
        value: acc.id,
        label: `${acc.name} (#${acc.id}) - $${acc.balance.toLocaleString()}${acc.isFrozen ? ' (Frozen)' : ''}`
    }));

    const selectedFromAccount = accounts.find((acc: any) => acc.id.toString() === formData.fromId);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Internal Fund Transfer</h1>
                <p className="text-slate-500">Initiate a secure transfer between internal bank accounts.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Transfer Details">
                        <form onSubmit={handleTransfer} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    label="From Account"
                                    name="fromId"
                                    type="select"
                                    options={accountOptions}
                                    value={formData.fromId}
                                    onChange={handleChange}
                                    disabled={submitting}
                                    required
                                />
                                <FormInput
                                    label="To Account"
                                    name="toId"
                                    type="select"
                                    options={accountOptions}
                                    value={formData.toId}
                                    onChange={handleChange}
                                    disabled={submitting}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <FormInput
                                    label="Amount (USD)"
                                    name="amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    disabled={submitting}
                                    required
                                    step="0.01"
                                />
                                {selectedFromAccount && (
                                    <p className="mt-1 text-xs text-slate-500">
                                        Available Balance: <span className="font-bold text-slate-700">${selectedFromAccount.balance.toLocaleString()}</span>
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center text-xs text-slate-400">
                                    <ShieldCheck className="w-4 h-4 mr-1 text-green-500" />
                                    Secure Bank-to-Bank Transfer
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submitting || !formData.amount}
                                >
                                    {submitting ? "Processing..." : (
                                        <><ArrowRight className="w-4 h-4 mr-2" /> Submit Transfer</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-primary-600 text-white border-none shadow-primary-200 shadow-xl">
                        <h4 className="flex items-center font-bold mb-4">
                            <Info className="w-5 h-5 mr-2" /> Processing Info
                        </h4>
                        <ul className="space-y-3 text-sm opacity-90">
                            <li className="flex items-start">
                                <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 mt-1.5 shrink-0" />
                                Internal transfers are processed immediately.
                            </li>
                            <li className="flex items-start">
                                <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 mt-1.5 shrink-0" />
                                Large transactions over $1M may require secondary approval.
                            </li>
                            <li className="flex items-start">
                                <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 mt-1.5 shrink-0" />
                                Ensure both accounts are active and not frozen.
                            </li>
                        </ul>
                    </Card>

                    <Card title="Recent Summary">
                        <div className="text-center py-6">
                            <div className="inline-flex items-center justify-center p-3 bg-slate-100 rounded-full mb-3">
                                <ArrowLeftRight className="w-6 h-6 text-slate-400" />
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed px-4">
                                Select accounts to see a preview of the transaction impact.
                            </p>
                        </div>
                    </Card>
                </div>
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

export default TransferPage;
