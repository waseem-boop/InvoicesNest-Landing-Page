import { apiClient } from './client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const clientsApi = {
    getClients: (businessId?: string) => {
        const query = businessId ? `?businessId=${encodeURIComponent(businessId)}` : '';
        return apiClient.get(`/clients${query}`);
    },
    createClient: (data: unknown) => apiClient.post('/clients', data),
    updateClient: (id: string, data: unknown) => apiClient.patch(`/clients/${id}`, data),
    deleteClient: (id: string) => apiClient.delete(`/clients/${id}`),
    bulkDelete: (ids: string[]) => apiClient.post('/clients/bulk-delete', { ids }),

    // Notes
    getClientNotes: (clientId: string, params?: { page?: number; limit?: number; search?: string }) => {
        const query = new URLSearchParams();
        if (params?.page) query.set('page', String(params.page));
        if (params?.limit) query.set('limit', String(params.limit));
        if (params?.search) query.set('search', params.search);
        return apiClient.get(`/clients/${clientId}/notes?${query.toString()}`);
    },
    createClientNote: (clientId: string, data: { note: string; tags?: string[] }) =>
        apiClient.post(`/clients/${clientId}/notes`, data),
    updateClientNote: (clientId: string, noteId: string, data: { note?: string; tags?: string[]; isPinned?: boolean }) =>
        apiClient.patch(`/clients/${clientId}/notes/${noteId}`, data),
    deleteClientNote: (clientId: string, noteId: string) =>
        apiClient.delete(`/clients/${clientId}/notes/${noteId}`),

    // Payment History
    getPaymentHistory: (clientId: string) =>
        apiClient.get(`/clients/${clientId}/payment-history`),
    markInvoiceAsPaid: (clientId: string, invoiceId: string) =>
        apiClient.post(`/clients/${clientId}/mark-paid/${invoiceId}`),
    sendPaymentReminder: (clientId: string, invoiceId: string) =>
        apiClient.post(`/clients/${clientId}/send-reminder/${invoiceId}`),
    exportClientStatement: (clientId: string) =>
        fetch(`${API_URL}/clients/${clientId}/statement/csv`, { credentials: 'include' }),
};
