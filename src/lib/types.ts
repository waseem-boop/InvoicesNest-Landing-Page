export interface UserPlanFeature {
    text: string;
}

export interface UserPlan {
    name?: string;
    features?: UserPlanFeature[];
}

export interface Business {
    id: string;
    name: string;
    address?: string;
    taxId?: string;
    defaultCurrency?: string;
    isDefault?: boolean;
    isArchived?: boolean;
    invoicePrefix?: string;
    brandColor?: string;
    logoUrl?: string;
}

export interface User {
    id?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    avatarUrl?: string;
    businessName?: string;
    businessLogo?: string;
    businessAddress?: string;
    website?: string;
    taxId?: string;
    defaultCurrency?: string;
    twoFactorEnabled?: boolean;
    referredById?: string;
    accessToken?: string;
    plan?: UserPlan;
    notificationPreferences?: Record<string, boolean>;
    createdAt?: string;
    hasPassword?: boolean;
    authProvider?: string;
    googleId?: string;
    stripeCustomerId?: string;
    updatedAt?: string;
    userUsage?: {
        invoicesCreatedToday?: number;
    };
    businesses?: Business[];
}

export interface Client {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    taxId?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ClientNote {
    id: string;
    note: string;
    tags: string[];
    isPinned: boolean;
    createdAt: string;
    User?: { name: string };
}

export interface InvoiceItem {
    id?: string;
    desc: string;
    qty: number;
    rate: number | string;
    amount: number | string;
}

export interface Invoice {
    id: string;
    invoiceNumber?: string;
    number?: string;
    clientName?: string;
    clientId?: string;
    client?: string;
    total: number | string;
    status: string;
    amountPaid?: number;
    currency?: string;
    date?: string;
    createdAt: string;
    updatedAt?: string;
    dueDate?: string;
    paidAt?: string;
    lineItems?: InvoiceItem[];
    from?: {
        name: string;
        email: string;
    };
    billTo?: {
        name: string;
        email: string;
    };
    notes?: string;
}

export interface PaymentHistorySummary {
    totalInvoiced: number;
    totalPaid: number;
    balanceDue: number;
    invoiceCount: number;
    paidCount: number;
    overdueCount: number;
    pendingCount: number;
}

export interface PaymentHistoryInsights {
    avgPaymentDelay: number;
    onTimeRate: number;
}

export interface PaymentHistoryInvoice {
    id: string;
    invoiceNumber: string;
    total: number;
    amountPaid: number;
    balanceDue: number;
    status: string;
    currency: string;
    createdAt: string;
    dueDate: string | null;
    paidAt: string | null;
    isOverdue: boolean;
}

export interface PaymentHistoryChartData {
    month: string;
    paid: number;
    invoiced: number;
}

export interface PaymentHistoryData {
    clientName: string;
    summary: PaymentHistorySummary;
    insights: PaymentHistoryInsights;
    chartData: PaymentHistoryChartData[];
    invoices: PaymentHistoryInvoice[];
}

export interface TicketMessage {
    id: string;
    content: string;
    isAdmin: boolean;
    createdAt: string;
}

export interface Ticket {
    id: string;
    subject: string;
    status: string;
    description: string;
    createdAt: string;
    messages?: TicketMessage[];
}

export interface Session {
    id: string;
    ipAddress?: string;
    userAgent?: string;
    deviceFingerprint?: string;
    isCurrent?: boolean;
    lastActiveAt?: string;
    createdAt: string;
}

export interface ReferralStats {
    availableBalance?: number;
    totalConversions?: number;
    totalEarned?: number;
}

export interface Payout {
    id: string;
    amount: number;
    method: 'Bank' | 'PayPal';
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    createdAt: string;
}

export interface BlogAuthor {
    name?: string;
}

export interface BlogCategory {
    name?: string;
}

export interface BlogCoverMedia {
    altText?: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    coverImage?: string;
    coverMedia?: BlogCoverMedia;
    coverImageSource?: string;
    createdAt: string;
    category?: string | BlogCategory;
    author?: BlogAuthor;
    faqSchema?: string | object;
    tags?: string[];
    isActive?: boolean;
    excerpt?: string;
    updatedAt?: string;
    publishedAt?: string;
    isFeatured?: boolean;
}

// Backup

export interface BackupFile {
    id: string;
    name: string;
    createdTime?: string;
    modifiedTime?: string;
    webViewLink?: string;
    size?: string;
}

export interface BackupConnectResponse {
    url: string;
}

export interface BackupRunResponse {
    status: 'completed' | 'up_to_date' | 'in_progress';
    fileId?: string | null;
    fileName?: string;
    message: string;
}

export interface BackupListResponse {
    files: BackupFile[];
}

// Restore

export interface RestorePreview {
    backupDate: string | null;
    totalInvoicesInBackup: number;
    newInvoices: number;
    existingInvoices: number;
}

export interface RestoreResult {
    restoredCount: number;
    updatedCount: number;
}

export interface RestoreHistoryEntry {
    id: string;
    backupFileId: string;
    backupFileName?: string | null;
    mode: 'merge' | 'replace';
    status: 'success' | 'failed';
    restoredCount: number;
    updatedCount: number;
    errorMessage?: string | null;
    createdAt: string;
}
