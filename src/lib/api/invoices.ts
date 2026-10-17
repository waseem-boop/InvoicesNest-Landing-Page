import { apiClient, authorizedFetch } from './client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const invoicesApi = {
    getInvoices: (businessId?: string) => {
        const query = businessId ? `?businessId=${encodeURIComponent(businessId)}` : '';
        return apiClient.get(`/invoices${query}`);
    },
    getInvoiceById: (id: string) => apiClient.get(`/invoices/${id}`),
    createInvoice: (data: unknown) => apiClient.post('/invoices', data),
    updateInvoice: (id: string, data: unknown) => apiClient.put(`/invoices/${id}`, data),
    deleteInvoice: (id: string) => apiClient.delete(`/invoices/${id}`),
    bulkDelete: (ids: string[]) => apiClient.post('/invoices/bulk-delete', { ids }),
    generatePdf: (id: string) => authorizedFetch(`${API_URL}/invoices/${id}/pdf`, { credentials: 'include' }),
    createShareLink: (id: string, data?: { expiresAt?: string | null }) => apiClient.post(`/invoices/${id}/share`, data || {}),
    getShareStatus: (id: string) => apiClient.get(`/invoices/${id}/share`),
    revokeShareLink: (id: string) => apiClient.delete(`/invoices/${id}/share`),
    getShareAnalytics: (id: string) => apiClient.get(`/invoices/${id}/share/analytics`),
    resendEmail: (id: string) => apiClient.post(`/invoices/${id}/resend-email`),
    getSharedInvoice: (token: string) => apiClient.get(`/invoices/share/${token}`),
    generateSharedPdf: (token: string) => authorizedFetch(`${API_URL}/invoices/share/${token}/pdf`),
    getTemplates: () => apiClient.get('/invoices/templates'),

    getNextNumber: () => apiClient.get('/invoices/next-number'),

    exportCsv: (params?: { status?: string; search?: string; clientId?: string; startDate?: string; endDate?: string }) => {
        const query = new URLSearchParams();
        if (params?.status) query.set('status', params.status);
        if (params?.search) query.set('search', params.search);
        if (params?.clientId) query.set('clientId', params.clientId);
        if (params?.startDate) query.set('startDate', params.startDate);
        if (params?.endDate) query.set('endDate', params.endDate);
        return authorizedFetch(`${API_URL}/invoices/export/csv?${query.toString()}`, { credentials: 'include' });
    },
};
