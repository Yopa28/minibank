import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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

// Interceptor to add Authorization header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials: { username: string; password: string }) =>
        api.post<{ status: string; token: string }>('/auth/login', credentials),
    register: (data: { username: string; password: string; role?: string }) =>
        api.post('/auth/register', data),
};

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

