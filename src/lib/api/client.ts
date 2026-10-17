const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const tokenManager = {
    getToken: () => typeof window === 'undefined' ? null : localStorage.getItem('accessToken'),
    setToken: (token: string) => localStorage.setItem('accessToken', token),
    removeToken: () => { localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); },
    getRefreshToken: () => typeof window === 'undefined' ? null : localStorage.getItem('refreshToken'),
    setRefreshToken: (token: string) => localStorage.setItem('refreshToken', token),
};
let refreshing: Promise<boolean> | null = null;
async function refreshAccessToken() {
    if (refreshing) return refreshing;
    refreshing = (async () => {
        try {
            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: tokenManager.getRefreshToken() || undefined, fingerprint: localStorage.getItem('device_fingerprint') || undefined }),
                signal: AbortSignal.timeout(10000),
            });
            if (!response.ok) return false;
            const data = await response.json();
            if (typeof data.accessToken !== 'string') return false;
            if (data.accessToken) tokenManager.setToken(data.accessToken);
            if (data.refreshToken) tokenManager.setRefreshToken(data.refreshToken);
            return true;
        } catch { return false; }
        finally { refreshing = null; }
    })();
    return refreshing;
}
export type ApiRequestOptions = Omit<RequestInit, 'headers' | 'body'> & { headers?: Record<string, string> };
export async function authorizedFetch(endpoint: string, options: RequestInit = {}, retry = true): Promise<Response> {
    let url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    if ((!options.method || options.method === 'GET') && typeof window !== 'undefined') {
        const id = localStorage.getItem('selectedBusinessId');
        const parsed = new URL(url);
        if (id && !parsed.searchParams.has('businessId')) { parsed.searchParams.set('businessId', id); url = parsed.toString(); }
    }
    const headers = new Headers(options.headers);
    const token = tokenManager.getToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    let response: Response;
    try { response = await fetch(url, { ...options, headers, credentials: 'include', signal: options.signal || AbortSignal.timeout(25000) }); }
    catch { throw new Error('The request could not complete. Check your connection and try again.'); }
    if (response.status === 401 && retry && !url.includes('/auth/refresh')) {
        // Another request may already have refreshed while this request was in flight.
        const currentToken = tokenManager.getToken();
        if ((currentToken && currentToken !== token) || await refreshAccessToken()) {
            return authorizedFetch(endpoint, options, false);
        }
    }
    return response;
}
async function fetcher(endpoint: string, options: ApiRequestOptions & { body?: string } = {}) {
    const response = await authorizedFetch(endpoint, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const message = response.status === 401
            ? 'Your sign-in session could not be renewed. Please sign in again; your existing invoice is still saved.'
            : data.message || 'Request failed. Please try again.';
        const error = Object.assign(new Error(message), { status: response.status, errors: data.errors });
        throw error;
    }
    return data.data ?? data;
}
export const apiClient = {
    get: (endpoint: string, options: ApiRequestOptions = {}) => fetcher(endpoint, { ...options, method: 'GET' }),
    post: (endpoint: string, data?: unknown, options: ApiRequestOptions = {}) => fetcher(endpoint, { ...options, method: 'POST', body: data === undefined ? undefined : JSON.stringify(data) }),
    put: (endpoint: string, data?: unknown, options: ApiRequestOptions = {}) => fetcher(endpoint, { ...options, method: 'PUT', body: data === undefined ? undefined : JSON.stringify(data) }),
    patch: (endpoint: string, data?: unknown, options: ApiRequestOptions = {}) => fetcher(endpoint, { ...options, method: 'PATCH', body: data === undefined ? undefined : JSON.stringify(data) }),
    delete: (endpoint: string, options: ApiRequestOptions = {}) => fetcher(endpoint, { ...options, method: 'DELETE' }),
};
