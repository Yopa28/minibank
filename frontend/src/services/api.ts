import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Adjust as needed for backend

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add x-user-id header
api.interceptors.request.use((config) => {
    const userId = localStorage.getItem('userId') || 'admin'; // Default to admin for now
    config.headers['x-user-id'] = userId;
    return config;
});

export const accountService = {
    getAll: () => api.get('/accounts'),
    getById: (id: string | number) => api.get(`/accounts/${id}`),
    create: (data: any) => api.post('/accounts', data),
    freeze: (id: string | number) => api.patch(`/accounts/${id}/freeze`),
    unfreeze: (id: string | number) => api.patch(`/accounts/${id}/unfreeze`),
    getTransactions: (id: string | number) => api.get(`/accounts/${id}/transactions`),
    deposit: (id: string | number, amount: number) => api.post(`/accounts/${id}/deposit`, { amount }),
    withdraw: (id: string | number, amount: number) => api.post(`/accounts/${id}/withdraw`, { amount }),
};

export const transactionService = {
    transfer: (data: { fromId: number; toId: number; amount: number; performedBy: string }) =>
        api.post('/transfer', data),
};

export const auditService = {
    getAll: () => api.get('/audit-logs'),
};

export default api;
