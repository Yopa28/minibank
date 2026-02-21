import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface Account {
    id: number;
    name: string;
    balance: number;
    isFrozen: boolean;
    createdAt: string;
}

export interface Transaction {
    id: number;
    accountId: number;
    type: 'deposit' | 'withdraw' | 'transfer_in' | 'transfer_out';
    amount: number;
    referenceId?: number;
    createdAt: string;
}

export interface AuditLog {
    id: number;
    action: string;
    performedBy: string;
    description: string;
    createdAt: string;
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add x-user-id header
api.interceptors.request.use((config) => {
    // Prompt says: headers: { "x-user-id": localStorage.getItem("user") || "admin" }
    const userId = localStorage.getItem('user') || 'admin';
    config.headers['x-user-id'] = userId;
    return config;
});

export const accountService = {
    getAll: () => api.get<Account[]>('/accounts'),
    getById: (id: string | number) => api.get<Account>(`/accounts/${id}`),
    create: (data: Partial<Account>) => api.post<Account>('/accounts', data),
    freeze: (id: string | number) => api.patch(`/accounts/${id}/freeze`),
    unfreeze: (id: string | number) => api.patch(`/accounts/${id}/unfreeze`),
    getTransactions: (id: string | number) => api.get<Transaction[]>(`/accounts/${id}/transactions`),
    deposit: (id: string | number, amount: number) => api.post(`/accounts/${id}/deposit`, { amount }),
    withdraw: (id: string | number, amount: number) => api.post(`/accounts/${id}/withdraw`, { amount }),
};

export const transactionService = {
    transfer: (data: { fromAccountId: number; toAccountId: number; amount: number }) =>
        api.post('/transfer', data),
};

export const auditService = {
    getAll: () => api.get<AuditLog[]>('/audit-logs'),
};

export default api;

