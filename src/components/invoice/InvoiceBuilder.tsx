"use client";
import { authorizedFetch } from "@/lib/api/client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Download, Save, CheckCircle2, Loader2, AlertCircle, Layers, Layout, Edit2, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import CurrencyPicker from "@/components/invoice/CurrencyPicker";
import { Currency, ALL_CURRENCIES } from "@/lib/currencies";
import type { Client } from "@/lib/types";
import { clientsApi } from "@/lib/api/clients";
import { invoicesApi } from "@/lib/api/invoices";
import { toast } from "sonner";
import { handlePhoneInput } from "@/lib/phone-formatter";

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface InitialInvoiceData {
    id?: string;
    invoiceNumber?: string;
    number?: string;
    invoiceDate?: string;
    date?: string;
    createdAt?: string;
    dueDate?: string;
    paymentTerms?: string;
    poNumber?: string;
    fromAddress?: string;
    clientAddress?: string;
    toAddress?: string;
    clientName?: string;
    shipTo?: string;
    items?: Array<{
        id?: string;
        description?: string;
        quantity?: number;
        rate?: number;
        amount?: number;
    }>;
    notes?: string;
    terms?: string;
    taxRate?: number;
    discountAmount?: number;
    shipping?: number;
    amountPaid?: number;
    currencyCode?: string;
    logo?: string;
    templateId?: string;
    status?: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
    labels?: Record<string, string>;
    taxId?: string;
}

interface InvoiceTemplate {
    id: string;
    name: string;
    htmlContent: string;
    cssContent?: string;
    thumbnail?: string;
    tier?: string;
    category?: string;
}

function getGuestFingerprint(): string {
    if (typeof window === 'undefined') return '';
    const fp = localStorage.getItem('nest_preview_guest_fp');
    if (fp) return fp;
    const newFp = 'guest_' + Math.random().toString(36).substring(7);
    localStorage.setItem('nest_preview_guest_fp', newFp);
    return newFp;
}

function getTimestampString(): string {
    return Date.now().toString();
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function InvoiceBuilder({
    isLanding = false,
    initialData,
    isViewOnly = false,
    standalonePreview = false
}: {
    isLanding?: boolean;
    initialData?: InitialInvoiceData;
    isViewOnly?: boolean;
    standalonePreview?: boolean;
}) {
    const [mounted, setMounted] = useState(false);
    const [dbId, setDbId] = useState<string | null>(null);

    // Basic Details & Meta
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState("");
    const todayStr = React.useMemo(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }, []);
    const [paymentTerms, setPaymentTerms] = useState("");
    const [poNumber, setPoNumber] = useState("");
    const [fromAddress, setFromAddress] = useState("");
    const [toAddress, setToAddress] = useState("");
    const [shipTo, setShipTo] = useState("");

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        try {
            // Handle YYYY-MM-DD format strictly
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1;
                const day = parseInt(parts[2]);
                const d = new Date(year, month, day);
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }

            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return 'N/A';
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            return 'N/A';
        }
    };

    const formattedInvoiceDate = formatDate(invoiceDate);
    const formattedDueDate = formatDate(dueDate);

    // Logo & Refs
    const [logo, setLogo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Items & Money
    const [items, setItems] = useState<InvoiceItem[]>([
        { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
    ]);
    const [tax, setTax] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [amountPaid, setAmountPaid] = useState(0);
    const [currencyCode, setCurrencyCode] = useState('USD');
    const [taxId, setTaxId] = useState("");
    const [taxIdLabel, setTaxIdLabel] = useState("Tax ID");
    const [taxIdPlaceholder, setTaxIdPlaceholder] = useState("e.g. Tax / Registration #");
    const [notes, setNotes] = useState("");
    const [terms, setTerms] = useState("");
    const [status, setStatus] = useState<'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE'>('DRAFT');

    // Customizable Labels
    const [labels, setLabels] = useState({
        invoiceTitle: "Invoice",
        invoiceNumber: "Invoice #",
        date: "Date",
        paymentTerms: "Payment Terms",
        dueDate: "Due Date",
        poNumber: "PO Number",
        taxId: "Tax ID",
        billTo: "Bill To",
        shipTo: "Ship To",
        item: "Item",
        quantity: "Quantity",
        rate: "Rate",
        amount: "Amount",
        notes: "Notes",
        terms: "Terms & Conditions",
        subtotal: "Subtotal",
        tax: "Tax",
        discount: "Discount",
        shipping: "Shipping",
        total: "Total",
        amountPaid: "Amount Paid",
        balanceDue: "Balance Due"
    });

    const countryTaxMap: Record<string, { label: string; placeholder: string; currency?: string; tax?: number; taxLabel?: string }> = {
        australia: { label: 'ABN', placeholder: 'Enter ABN Number', currency: 'AUD', tax: 10, taxLabel: 'GST' },
        germany: { label: 'Steuernummer', placeholder: 'Enter Steuernummer / USt-IdNr', currency: 'EUR', tax: 19, taxLabel: 'MwSt' },
        uk: { label: 'UTR / VAT', placeholder: 'Enter UTR / CRN Number', currency: 'GBP', tax: 20, taxLabel: 'VAT' },
        'united kingdom': { label: 'UTR / VAT', placeholder: 'Enter UTR / CRN Number', currency: 'GBP', tax: 20, taxLabel: 'VAT' },
        vietnam: { label: 'MST', placeholder: 'Enter MST Tax Code', currency: 'VND', tax: 10, taxLabel: 'GTGT' },
        canada: { label: 'Business No.', placeholder: 'Enter Business Number (BN)', currency: 'CAD', tax: 5, taxLabel: 'GST/HST' },
        uae: { label: 'TRN', placeholder: 'Enter TRN Number', currency: 'AED', tax: 5, taxLabel: 'VAT' },
        'united arab emirates': { label: 'TRN', placeholder: 'Enter TRN Number', currency: 'AED', tax: 5, taxLabel: 'VAT' },
        russia: { label: 'ИНН / КПП', placeholder: 'Enter ИНН Number', currency: 'RUB', tax: 20, taxLabel: 'НДС' },
    };

    // Feedback States
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Validation Refs & State
    const fromAddressRef = useRef<HTMLTextAreaElement>(null);
    const toAddressRef = useRef<HTMLTextAreaElement>(null);
    const itemsRef = useRef<HTMLDivElement>(null);
    const [fieldErrors, setFieldErrors] = useState<{ from: boolean, to: boolean, items: boolean }>({ from: false, to: false, items: false });

    const validateFields = () => {
        const errors = { from: false, to: false, items: false };
        let hasError = false;

        if (!fromAddress.trim()) { errors.from = true; hasError = true; }
        if (!toAddress.trim()) { errors.to = true; hasError = true; }
        if (items.length === 0 || (items.length === 1 && !items[0].description.trim())) { errors.items = true; hasError = true; }

        setFieldErrors(errors);

        if (hasError) {
            toast.error("Please fill in the required fields (highlighted in red)");
            if (errors.from && fromAddressRef.current) {
                fromAddressRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                fromAddressRef.current.focus();
            } else if (errors.to && toAddressRef.current) {
                toAddressRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                toAddressRef.current.focus();
            } else if (errors.items && itemsRef.current) {
                itemsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }
        return true;
    };

    // Templates System
    const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const [HandlebarsModule, setHandlebarsModule] = useState<typeof import('handlebars') | null>(null);

    // Dynamic heavy import for PDF compilation only when needed
    useEffect(() => {
        if (selectedTemplateId && !HandlebarsModule) {
            import('handlebars').then(m => setHandlebarsModule(m.default));
        }
    }, [selectedTemplateId, HandlebarsModule]);

    // Client Management
    const [clients, setClients] = useState<Client[]>([]);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [newClient, setNewClient] = useState({ name: '', email: '', address: '', phone: '', taxId: '' });
    const [isCreatingClient, setIsCreatingClient] = useState(false);

    // Calculations memoized for performance
    const { currency, currencyName, subtotal, taxAmount, total, balanceDue } = React.useMemo(() => {
        const currencyObj = ALL_CURRENCIES.find(c => c.code === currencyCode) || { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' };
        const sub = items.reduce((sum, item) => sum + item.amount, 0);
        const taxAmt = (sub * tax) / 100;
        const totalAmt = sub + taxAmt + shipping - discount;
        const balance = totalAmt - amountPaid;

        return {
            currency: currencyObj.symbol,
            currencyName: currencyObj.code,
            subtotal: sub,
            taxAmount: taxAmt,
            total: totalAmt,
            balanceDue: balance
        };
    }, [currencyCode, items, tax, shipping, discount, amountPaid]);

    const loadTemplates = async () => {
        if (standalonePreview) return;
        try {
            const response = await authorizedFetch(`${API_URL}/invoices/templates`, {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            if (response.ok) {
                const json = await response.json();
                setTemplates(json.data);
            }
        } catch (err) {
            console.error("Failed to load templates", err);
        }
    };

    const loadClients = async () => {
        if (standalonePreview) return;
        try {
            const data = await clientsApi.getClients();
            setClients(data);
            if (data.length > 0) setIsLoggedIn(true); // Extra check: if we can fetch clients, we are logged in
        } catch (err) {
            console.error("Failed to load clients", err);
        }
    };

    const fetchNextNumber = async () => {
        if (standalonePreview) return;
        try {
            const response = await authorizedFetch(`${API_URL}/invoices/next-number`, {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            if (response.ok) {
                const json = await response.json();
                if (json.data?.nextNumber) setInvoiceNumber(json.data.nextNumber);
            }
        } catch (err) {
            console.error("Failed to fetch next invoice number", err);
            setInvoiceNumber("INV-" + Math.floor(1000 + Math.random() * 9000));
        }
    };

    // Initialization & Data Load
    useEffect(() => {
        setTimeout(() => {
            setMounted(true);

            const init = async () => {
                try {
                    loadTemplates();
                    const res = standalonePreview ? null : await authorizedFetch(`${API_URL}/auth/me`, { credentials: 'include' }).catch(() => null);
                    if (res && res.ok) {
                        const { data } = await res.json().catch(() => ({}));
                        if (data) {
                            const businessId = localStorage.getItem('selectedBusinessId');
                            const selectedBusiness = data.businesses?.find((business: any) => business.id === businessId) || data.businesses?.find((business: any) => business.isDefault);
                            if (selectedBusiness && !initialData) {
                                Object.assign(data, { businessName: selectedBusiness.name, businessAddress: selectedBusiness.address, taxId: selectedBusiness.taxId, defaultCurrency: selectedBusiness.defaultCurrency, businessLogo: selectedBusiness.logoUrl });
                            }
                            setIsLoggedIn(true);
                            // ONLY auto-fill if we are NOT on landing page and NOT editing existing data
                            if (!isLanding && !initialData) {
                                let from = '';
                                if (data.businessName) from += data.businessName + '\n';
                                if (data.businessAddress) from += data.businessAddress + '\n';
                                if (data.taxId) from += `Tax ID: ${data.taxId}\n`;
                                if (data.phoneNumber) from += `Phone: ${data.phoneNumber}\n`;
                                if (data.website) from += `Web: ${data.website}`;

                                if (from.trim()) setFromAddress(from.trim());
                                if (data.businessLogo) setLogo(data.businessLogo);
                                if (data.defaultCurrency) setCurrencyCode(data.defaultCurrency);
                            } else if (!isLanding && initialData) {
                                // If editing and saved invoice has no logo or fromAddress, load them from settings default
                                if (!initialData.fromAddress || !initialData.fromAddress.trim()) {
                                    let from = '';
                                    if (data.businessName) from += data.businessName + '\n';
                                    if (data.businessAddress) from += data.businessAddress + '\n';
                                    if (data.taxId) from += `Tax ID: ${data.taxId}\n`;
                                    if (data.phoneNumber) from += `Phone: ${data.phoneNumber}\n`;
                                    if (data.website) from += `Web: ${data.website}`;

                                    if (from.trim()) setFromAddress(from.trim());
                                }
                                if (!initialData.logo && data.businessLogo) {
                                    setLogo(data.businessLogo);
                                }
                            }
                            loadClients();
                        }
                    }
                } catch { console.error("Initialization failed"); }
            };
            init();

            // PRIORITIZE initialData (from database) over localStorage
            if (initialData) {
                const data = initialData;
                if (data.id) setDbId(data.id);
                if (data.invoiceNumber || data.number) setInvoiceNumber(data.invoiceNumber || data.number || "");
                const dateVal = data.invoiceDate || data.date || data.createdAt;
                if (dateVal) setInvoiceDate(new Date(dateVal).toISOString().split('T')[0]);
                if (data.dueDate) setDueDate(new Date(data.dueDate).toISOString().split('T')[0]);
                if (data.paymentTerms) setPaymentTerms(data.paymentTerms);
                if (data.poNumber) setPoNumber(data.poNumber);
                if (data.fromAddress) setFromAddress(data.fromAddress);
                setToAddress(data.clientAddress || data.toAddress || data.clientName || "");
                if (data.shipTo) setShipTo(data.shipTo);
                if (data.items) {
                    setItems(Array.isArray(data.items) ? data.items.map((item: {
                        id?: string;
                        description?: string;
                        quantity?: number;
                        rate?: number;
                        amount?: number;
                    }, idx: number) => ({
                        id: item.id || `loaded_${idx}_${Math.random()}`,
                        description: item.description || "",
                        quantity: Number(item.quantity) || 1,
                        rate: Number(item.rate) || 0,
                        amount: Number(item.amount) || 0
                    })) : []);
                }
                if (data.notes) setNotes(data.notes);
                if (data.terms) setTerms(data.terms);
                if (data.taxRate !== undefined) setTax(data.taxRate);
                if (data.discountAmount !== undefined) setDiscount(data.discountAmount);
                if (data.shipping !== undefined) setShipping(data.shipping);
                if (data.amountPaid !== undefined) setAmountPaid(data.amountPaid);
                if (data.currencyCode) setCurrencyCode(data.currencyCode);
                if (data.logo) setLogo(data.logo);
                if (data.templateId) setSelectedTemplateId(data.templateId);
                if (data.status) setStatus(data.status);
                if (data.labels) setLabels(prev => ({ ...prev, ...data.labels }));
                if (data.taxId) setTaxId(data.taxId);

                // If we are in view-only mode, default to the live preview (PDF-like) view
                if (isViewOnly) {
                    setIsPreviewMode(true);
                }
            } else {
                // Load draft from localStorage if no initialData (only for guest users)
                const canUseGuestDraft = isLanding && (standalonePreview || !localStorage.getItem('accessToken'));
                if (!canUseGuestDraft) {
                    localStorage.removeItem('nest_preview_invoice_draft');
                }
                const saved = canUseGuestDraft ? localStorage.getItem('nest_preview_invoice_draft') : null;
                if (saved) {
                    try {
                        const data = JSON.parse(saved);
                        if (data.invoiceNumber) setInvoiceNumber(data.invoiceNumber);
                        if (data.invoiceDate) setInvoiceDate(data.invoiceDate);
                        if (data.dueDate) setDueDate(data.dueDate);
                        if (data.paymentTerms) setPaymentTerms(data.paymentTerms);
                        if (data.poNumber) setPoNumber(data.poNumber);
                        if (data.fromAddress) setFromAddress(data.fromAddress);
                        if (data.toAddress) setToAddress(data.toAddress);
                        if (data.shipTo) setShipTo(data.shipTo);
                        if (data.items) {
                            setItems(data.items.map((item: any, idx: number) => ({
                                id: item.id || `loaded_${idx}_${Math.random()}`,
                                description: item.description || "",
                                quantity: Number(item.quantity) || 1,
                                rate: Number(item.rate) || 0,
                                amount: Number(item.amount) || 0
                            })));
                        }
                        if (data.taxRate !== undefined) setTax(data.taxRate);
                        if (data.discountAmount !== undefined) setDiscount(data.discountAmount);
                        if (data.shipping !== undefined) setShipping(data.shipping);
                        if (data.amountPaid !== undefined) setAmountPaid(data.amountPaid);
                        if (data.currencyCode) setCurrencyCode(data.currencyCode);
                        if (data.logo) setLogo(data.logo);
                        if (data.notes) setNotes(data.notes);
                        if (data.terms) setTerms(data.terms);
                        if (data.templateId) setSelectedTemplateId(data.templateId);
                        if (data.labels) setLabels((prev) => ({ ...prev, ...data.labels }));
                        if (data.taxId) setTaxId(data.taxId);
                        if (data.taxIdLabel) setTaxIdLabel(data.taxIdLabel);
                        if (data.taxIdPlaceholder) setTaxIdPlaceholder(data.taxIdPlaceholder);
                    } catch (e) {
                        console.error("Failed to parse saved draft", e);
                    }
                } else if (!isLanding) {
                    fetchNextNumber();
                    setInvoiceDate(new Date().toISOString().split('T')[0]);
                } else {
                    setInvoiceDate(new Date().toISOString().split('T')[0]);
                }
            }

            // Dynamic country/preset parameters from URL (e.g. ?country=australia, ?country=germany, ?currency=EUR&tax=19&taxLabel=MwSt)
            if (typeof window !== 'undefined') {
                try {
                    const searchParams = new URLSearchParams(window.location.search);
                    const countryParam = searchParams.get('country')?.toLowerCase();
                    const curr = searchParams.get('currency');
                    const taxVal = searchParams.get('tax');
                    const taxLbl = searchParams.get('taxLabel');
                    const urlTaxIdLabel = searchParams.get('taxIdLabel');
                    const urlTaxIdPlaceholder = searchParams.get('taxIdPlaceholder');

                    if (countryParam && countryTaxMap[countryParam]) {
                        const preset = countryTaxMap[countryParam];
                        setTaxIdLabel(preset.label);
                        setTaxIdPlaceholder(preset.placeholder);
                        setLabels(prev => ({ ...prev, taxId: preset.label, ...(preset.taxLabel ? { tax: preset.taxLabel } : {}) }));
                        if (preset.currency) setCurrencyCode(preset.currency);
                        if (preset.tax !== undefined) setTax(preset.tax);
                    }

                    if (curr) setCurrencyCode(curr.toUpperCase());
                    if (taxVal !== null && !isNaN(Number(taxVal))) setTax(Number(taxVal));
                    if (taxLbl) setLabels(prev => ({ ...prev, tax: taxLbl }));
                    if (urlTaxIdLabel) {
                        setTaxIdLabel(urlTaxIdLabel);
                        setLabels(prev => ({ ...prev, taxId: urlTaxIdLabel }));
                    }
                    if (urlTaxIdPlaceholder) setTaxIdPlaceholder(urlTaxIdPlaceholder);
                } catch {
                    // Ignore URL search params error
                }
            }
        }, 0);
    }, [isLanding, initialData, isViewOnly, standalonePreview]);

    // Auto-save guest invoice drafts to localStorage whenever fields change
    useEffect(() => {
        if (!mounted) return;
        if (isLanding && !initialData) {
            const draft = {
                invoiceNumber,
                invoiceDate,
                dueDate,
                paymentTerms,
                poNumber,
                fromAddress,
                toAddress,
                shipTo,
                items,
                taxRate: tax,
                taxAmount,
                discountAmount: discount,
                shipping,
                amountPaid,
                currencyCode,
                currencySymbol: currency,
                total,
                subtotal,
                notes,
                terms,
                templateId: selectedTemplateId,
                labels,
                logo,
                taxId,
                taxIdLabel,
                taxIdPlaceholder
            };
            localStorage.setItem('nest_preview_invoice_draft', JSON.stringify(draft));
        }
    }, [
        mounted, isLanding, initialData,
        invoiceNumber, invoiceDate, dueDate, paymentTerms, poNumber,
        fromAddress, toAddress, shipTo, items, tax, discount, shipping,
        amountPaid, currencyCode, currency, total, subtotal, taxAmount,
        notes, terms, selectedTemplateId, labels, logo, taxId, taxIdLabel, taxIdPlaceholder
    ]);

    const handleCreateClient = async () => {
        if (!newClient.name || !newClient.email) {
            toast.error("Name and Email are required");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(newClient.email.trim())) {
            toast.error("Please enter a valid email address with a valid domain (e.g. name@company.com)");
            return;
        }
        setIsCreatingClient(true);
        try {
            const businessId = typeof window !== 'undefined' ? localStorage.getItem('selectedBusinessId') : null;
            const client = await clientsApi.createClient({ ...newClient, businessId }) as Client;
            setClients([client, ...clients]);
            handleSelectClient(client);
            setIsClientModalOpen(false);
            setNewClient({ name: '', email: '', address: '', phone: '', taxId: '' });
            toast.success("Client added successfully!");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to create client";
            toast.error(message);
        } finally {
            setIsCreatingClient(false);
        }
    };

    const handleSelectClient = (client: Client) => {
        setSelectedClientId(client.id);
        const addressBlock = `${client.name}\n${client.email}\n${client.address || ''}\n${client.phone ? 'Phone: ' + client.phone : ''}\n${client.taxId ? 'Tax ID: ' + client.taxId : ''}`.trim();
        setToAddress(addressBlock);
    };

    const addItem = () => {
        const newItem = { id: Math.random().toString(), description: '', quantity: 1, rate: 0, amount: 0 };
        setItems([...items, newItem]);
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const val = (field === 'quantity' || field === 'rate') ? Number(value) : value;
                const updated = { ...item, [field]: val };
                if (field === 'quantity' || field === 'rate') {
                    updated.amount = Number(updated.quantity) * Number(updated.rate);
                }
                return updated as InvoiceItem;
            }
            return item;
        }));
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDownload = async () => {
        if (!validateFields()) return;
        if (standalonePreview) {
            const popup = window.open('', '_blank', 'width=900,height=1000');
            if (!popup) { toast.error('Please allow the invoice print window, then try again.'); return; }
            const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
            const money = (value: number) => `${escape(currencyCode)} ${value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            const logoMarkup = logo && /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(logo) ? `<img src="${logo}" alt="Business logo" style="max-width:180px;max-height:80px;object-fit:contain"/>` : '';
            popup.document.write(`<!doctype html><html><head><title>${escape(invoiceNumber || 'Invoice')}</title><meta charset="utf-8"/><style>@page{size:A4;margin:18mm}*{box-sizing:border-box}body{font:13px Arial,sans-serif;color:#25243a;margin:25px;line-height:1.5}header{display:flex;justify-content:space-between;gap:25px;border-bottom:2px solid #5754d7;padding-bottom:25px}h1{margin:0;font-size:34px}h2{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#777588}.addresses{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin:30px 0}.lines{white-space:pre-wrap}table{width:100%;border-collapse:collapse;margin:25px 0}th{text-align:left;background:#f4f2fb;color:#5754d7}td,th{padding:12px 8px;border-bottom:1px solid #e9e8f1}td:last-child,th:last-child{text-align:right}tr{break-inside:avoid}.totals{margin-left:auto;width:270px}.totals p{display:flex;justify-content:space-between}.due{font-weight:bold;font-size:17px;border-top:1px solid #ddd;padding-top:12px}.print-note{color:#777;font-size:11px}@media print{.print-note{display:none}body{margin:0}}</style></head><body><header><div>${logoMarkup}<h2>Invoice from</h2><div class="lines">${escape(fromAddress)}</div></div><div><h1>${escape(labels.invoiceTitle)}</h1><p># ${escape(invoiceNumber)}</p><p>Date: ${escape(invoiceDate)}<br/>Due: ${escape(dueDate)}<br/>${escape(paymentTerms)}</p></div></header><div class="addresses"><div><h2>${escape(labels.billTo)}</h2><div class="lines">${escape(toAddress)}</div></div>${shipTo ? `<div><h2>Ship to</h2><div class="lines">${escape(shipTo)}</div></div>` : ''}</div><table><thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>${items.map(item => `<tr><td>${escape(item.description)}</td><td>${escape(item.quantity)}</td><td>${money(item.rate)}</td><td>${money(item.amount)}</td></tr>`).join('')}</tbody></table><div class="totals"><p><span>Subtotal</span><span>${money(subtotal)}</span></p><p><span>Tax (${escape(tax)}%)</span><span>${money(taxAmount)}</span></p><p><span>Discount</span><span>− ${money(discount)}</span></p><p><span>Shipping</span><span>${money(shipping)}</span></p><p><span>Total</span><span>${money(total)}</span></p><p><span>Amount paid</span><span>${money(amountPaid)}</span></p><p class="due"><span>Balance due</span><span>${money(balanceDue)}</span></p></div>${notes ? `<h2>Notes</h2><p class="lines">${escape(notes)}</p>` : ''}${terms ? `<h2>Terms</h2><p class="lines">${escape(terms)}</p>` : ''}<p class="print-note">Choose “Save as PDF” in your browser’s print dialog.</p></body></html>`);
            popup.document.close();
            popup.onload = () => { popup.focus(); popup.print(); };
            return;
        }
        setIsGeneratingPDF(true);
        setError(null);

        // Auto-save to database before downloading if user is logged in
        if (!isLanding) {
            try {
                await handleSave();
            } catch (e) {
                console.error("Auto-save failed before download", e);
                toast.error("Invoice save failed — PDF will still download but dashboard was not updated.");
            }
        }

        const fingerprint = getGuestFingerprint();

        // These are now available from the outer scope

        const effectiveFromAddress = taxId && !fromAddress.includes(taxId)
            ? `${fromAddress}\n${labels.taxId || taxIdLabel}: ${taxId}`.trim()
            : fromAddress;

        try {
            const response = await authorizedFetch(`${API_URL}/guest/invoice/pdf`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invoiceNumber, currency: currencyCode, currencySymbol: currency,
                    clientName: toAddress.split('\n')[0] || 'Valued Client',
                    clientAddress: toAddress.split('\n').slice(1).join('\n'),
                    subtotal, taxRate: tax,
                    taxAmount, discountAmount: discount, shipping, total,
                    amountPaid, balanceDue,
                    notes, terms, items: items.map(i => ({
                        description: i.description || 'Service', quantity: i.quantity, rate: i.rate, amount: i.amount
                    })),
                    fingerprint, logo, fromAddress: effectiveFromAddress, shipTo, poNumber, taxId,
                    date: formattedInvoiceDate !== 'N/A' ? formattedInvoiceDate : formatDate(new Date().toISOString().split('T')[0]),
                    invoiceDate: formattedInvoiceDate !== 'N/A' ? formattedInvoiceDate : formatDate(new Date().toISOString().split('T')[0]),
                    dueDate: formattedDueDate !== 'N/A' ? formattedDueDate : '',
                    due_date: formattedDueDate !== 'N/A' ? formattedDueDate : '',
                    paymentTerms,
                    templateId: selectedTemplateId,
                    labels
                })
            });

            if (!response.ok) throw new Error('Failed to generate PDF');

            // Save to local history with FULL data for editing/viewing
            const savedInvoices = JSON.parse(localStorage.getItem('nest_landing_preview_saved_invoices') || '[]');
            const fullPayload = {
                id: getTimestampString(),
                number: invoiceNumber,
                date: invoiceDate,
                dueDate,
                paymentTerms,
                poNumber,
                fromAddress,
                toAddress,
                shipTo,
                logo,
                items,
                tax,
                discount,
                shipping,
                amountPaid,
                currencyCode,
                currencySymbol: currency,
                total,
                subtotal,
                taxAmount,
                templateId: selectedTemplateId,
                status: status || 'PAID',
                createdAt: new Date().toISOString(),
                client: toAddress || 'Valued Client',
                amount: `${currency}${total.toLocaleString()}`,
                labels,
            };

            // Remove any existing invoice with same ID (if editing)
            const filteredInvoices = savedInvoices.filter((inv: { number?: string }) => inv.number !== invoiceNumber);
            localStorage.setItem('nest_landing_preview_saved_invoices', JSON.stringify([fullPayload, ...filteredInvoices]));

            const blobData = await response.blob();
            const blob = new Blob([blobData], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Invoice_${invoiceNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success("Invoice PDF downloaded!");
        } catch (err) {
            console.error("PDF generation failed:", err);
            const message = err instanceof Error ? err.message : "PDF generation failed. Please try again.";
            setError(message);
            toast.error("PDF generation failed");
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleSave = async () => {
        // Validation: Make sure required fields are filled
        if (!validateFields()) return;

        setIsSaving(true);
        try {
            const payload = {
                invoiceNumber,
                currency: currencyCode,
                currencySymbol: currency,
                clientName: toAddress.split('\n')[0] || 'Valued Client',
                clientAddress: toAddress,
                subtotal,
                taxRate: tax,
                taxAmount,
                discountRate: 0,
                discountAmount: discount,
                shipping,
                amountPaid,
                total,
                notes,
                terms,
                items: items.map(i => ({
                    description: i.description || 'Service',
                    quantity: i.quantity,
                    rate: i.rate,
                    amount: i.amount
                })),
                logo,
                fromAddress,
                shipTo,
                dueDate,
                invoiceDate,
                poNumber,
                paymentTerms,
                templateId: selectedTemplateId,
                clientId: selectedClientId,
                status,
                // CRITICAL: attach the currently selected business so the invoice appears in the dashboard list
                businessId: (typeof window !== 'undefined' ? localStorage.getItem('selectedBusinessId') : null) || null,
            };

            // Save to database if not on landing page
            if (!isLanding) {
                if (dbId) {
                    await invoicesApi.updateInvoice(dbId, payload);
                    toast.success("Invoice updated successfully!");
                } else {
                    const response = await invoicesApi.createInvoice(payload);
                    if (response.id) setDbId(response.id);
                    toast.success("Invoice saved to dashboard!");
                }
            } else {
                // For guest users, save to local storage as draft
                localStorage.setItem('nest_preview_invoice_draft', JSON.stringify(payload));
                toast.success("Draft saved locally!");
            }

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to save invoice.";
            setError(message);
        } finally {
            setIsSaving(false);
        }
    };

    if (!mounted) return null;

    const renderPreviewHTML = () => {

        const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
        if (!selectedTemplate || !selectedTemplate.htmlContent) {
            // If no template selected, we show a basic classic preview instead of an error
            return `
                <div style="font-family: 'Inter', sans-serif; padding: 40px 60px; color: #333; line-height: 1.4; background: white; max-width: 800px; margin: auto; min-height: 1000px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px;">
                        <div>
                            ${logo ? `<img src="${logo}" style="max-width: 200px; max-height: 100px; object-fit: contain;">` : '<div style="height: 60px;"></div>'}
                        </div>
                        <div style="text-align: right;">
                            <h1 style="font-size: 38px; font-weight: 700; color: #1e293b; margin: 0; line-height: 1; text-transform: uppercase;">${labels.invoiceTitle}</h1>
                            <div style="font-size: 16px; color: #64748b; margin-top: 5px;"># ${invoiceNumber || '0001'}</div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                        <div style="flex: 1;">
                            <div style="margin-bottom: 20px;">
                                <span style="font-size: 13px; font-weight: 700; color: #333; margin-bottom: 3px; display: block;">Who is this from?</span>
                                <div style="font-size: 14px; color: #333; white-space: pre-wrap;">${fromAddress || 'N/A'}</div>
                            </div>

                            <div style="display: flex; gap: 30px; margin-top: 10px;">
                                <div style="min-width: 150px;">
                                    <span style="font-size: 12px; color: #94a3b8; margin-bottom: 3px; display: block;">${labels.billTo}:</span>
                                    <div style="font-size: 13px; font-weight: 700; color: #333; white-space: pre-wrap;">${toAddress || 'Valued Client'}</div>
                                </div>
                                <div style="min-width: 150px;">
                                    <span style="font-size: 12px; color: #94a3b8; margin-bottom: 3px; display: block;">${labels.shipTo}:</span>
                                    <div style="font-size: 13px; font-weight: 700; color: #333; white-space: pre-wrap;">${shipTo || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                        <div style="width: 300px;">
                             <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                  <td style="text-align: right; color: #94a3b8; padding-right: 20px; font-size: 13px;">${labels.date}:</td>
                                  <td style="text-align: right; color: #333; font-size: 13px;">${formattedInvoiceDate}</td>
                                </tr>
                                <tr>
                                  <td style="text-align: right; color: #94a3b8; padding-right: 20px; font-size: 13px;">${labels.paymentTerms}:</td>
                                  <td style="text-align: right; color: #333; font-size: 13px;">${paymentTerms || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td style="text-align: right; color: #94a3b8; padding-right: 20px; font-size: 13px;">${labels.dueDate}:</td>
                                  <td style="text-align: right; color: #333; font-size: 13px;">${formattedDueDate}</td>
                                </tr>
                                <tr>
                                  <td style="text-align: right; color: #94a3b8; padding-right: 20px; font-size: 13px;">${labels.poNumber}:</td>
                                  <td style="text-align: right; color: #333; font-size: 13px;">${poNumber || 'N/A'}</td>
                                </tr>
                             </table>

                             <div style="background: #f1f5f9; padding: 10px 15px; border-radius: 4px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 14px; font-weight: 700; color: #1e293b;">${labels.balanceDue}:</span>
                                <span style="font-size: 15px; font-weight: 700; color: #1e293b;">${currency}${balanceDue.toLocaleString()}</span>
                             </div>
                        </div>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 35px;">
                        <thead>
                            <tr style="background: #334155; color: white; text-align: left;">
                                <th style="padding: 8px 15px; font-size: 13px; font-weight: 400; width: 50%;">${labels.item}</th>
                                <th style="padding: 8px 15px; font-size: 14px; font-weight: 400; text-align: center;">${labels.quantity}</th>
                                <th style="padding: 8px 15px; font-size: 14px; font-weight: 400; text-align: right;">${labels.rate}</th>
                                <th style="padding: 8px 15px; font-size: 14px; font-weight: 400; text-align: right;">${labels.amount}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(item => `
                                <tr>
                                    <td style="padding: 10px 15px; border-bottom: 1px solid #f1f5f9; font-size: 13px; font-weight: 700; color: #333;">${item.description || 'Service'}</td>
                                    <td style="padding: 10px 15px; border-bottom: 1px solid #f1f5f9; font-size: 13px; text-align: center;">${item.quantity}</td>
                                    <td style="padding: 10px 15px; border-bottom: 1px solid #f1f5f9; font-size: 13px; text-align: right;">${currency}${item.rate.toLocaleString()}</td>
                                    <td style="padding: 10px 15px; border-bottom: 1px solid #f1f5f9; font-size: 13px; text-align: right; color: #333;">${currency}${item.amount.toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
                        <table style="width: 250px; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 4px 0; font-size: 14px; color: #94a3b8; text-align: right; padding-right: 25px;">${labels.subtotal}:</td>
                                <td style="padding: 4px 0; font-size: 14px; text-align: right; color: #333;">${currency}${subtotal.toLocaleString()}</td>
                            </tr>
                            ${tax > 0 ? `
                            <tr>
                                <td style="padding: 4px 0; font-size: 14px; color: #94a3b8; text-align: right; padding-right: 25px;">${labels.tax} (${tax}%):</td>
                                <td style="padding: 4px 0; font-size: 14px; text-align: right; color: #333;">${currency}${taxAmount.toLocaleString()}</td>
                            </tr>` : ''}
                            ${discount > 0 ? `
                            <tr>
                                <td style="padding: 4px 0; font-size: 14px; color: #94a3b8; text-align: right; padding-right: 25px;">${labels.discount}:</td>
                                <td style="padding: 4px 0; font-size: 14px; text-align: right; color: #333;">-${currency}${discount.toLocaleString()}</td>
                            </tr>` : ''}
                            <tr style="border-top: none;">
                                <td style="padding: 10px 0; font-size: 16px; font-weight: 700; color: #1e293b; text-align: right; padding-right: 25px;">${labels.total}:</td>
                                <td style="padding: 10px 0; font-size: 16px; font-weight: 700; color: #1e293b; text-align: right;">${currency}${total.toLocaleString()}</td>
                            </tr>
                            ${amountPaid > 0 ? `
                            <tr>
                                <td style="padding: 4px 0; font-size: 14px; color: #94a3b8; text-align: right; padding-right: 25px;">${labels.amountPaid}:</td>
                                <td style="padding: 4px 0; font-size: 14px; text-align: right; color: #333;">${currency}${amountPaid.toLocaleString()}</td>
                            </tr>` : ''}
                        </table>
                    </div>

                    <div style="margin-top: 50px;">
                        ${notes ? `
                        <div style="margin-bottom: 15px;">
                            <span style="font-size: 12px; color: #94a3b8; margin-bottom: 3px; display: block;">${labels.notes}:</span>
                            <div style="font-size: 13px; color: #475569; white-space: pre-wrap;">${notes}</div>
                        </div>` : ''}
                        
                        ${terms ? `
                        <div style="margin-bottom: 15px;">
                            <span style="font-size: 12px; color: #94a3b8; margin-bottom: 3px; display: block;">${labels.terms}:</span>
                            <div style="font-size: 13px; color: #475569; white-space: pre-wrap;">${terms}</div>
                        </div>` : ''}
                    </div>
                </div>
            `;
        }

        const effectiveFromAddress = taxId && !fromAddress.includes(taxId)
            ? `${fromAddress}\n${labels.taxId || taxIdLabel}: ${taxId}`.trim()
            : fromAddress;

        try {
            const templateData = {
                logo,
                invoiceNumber,
                invoiceDate: formattedInvoiceDate,
                dueDate: formattedDueDate,
                rawInvoiceDate: invoiceDate,
                rawDueDate: dueDate,
                paymentTerms,
                poNumber,
                taxId,
                tax_id: taxId,
                abn: taxId,
                steuernummer: taxId,
                vatNumber: taxId,
                fromName: fromAddress.split('\n')[0] || 'My Business',
                fromAddress: effectiveFromAddress,
                clientName: toAddress.split('\n')[0] || 'Valued Client',
                clientAddress: toAddress,
                shipTo,
                currency,
                items,
                subtotal,
                taxRate: tax,
                taxAmount,
                discountAmount: discount,
                shipping,
                total,
                amountPaid,
                balanceDue,
                notes,
                terms,
                labels
            };

            if (!HandlebarsModule) {
                return `<div style="padding: 40px; font-family: 'Inter', sans-serif; color: #64748b; text-align: center;">Loading template compiler...</div>`;
            }

            const compiled = HandlebarsModule.compile(selectedTemplate.htmlContent);
            const bodyHtml = compiled(templateData);

            return `
                <!DOCTYPE html>
                <html>
                <head>
                <style>
                    body { font-family: 'Inter', sans-serif; margin: 0; padding: 40px; background: white; color: #1e293b; }
                    ${selectedTemplate.cssContent || ''}
                </style>
                </head>
                <body>
                    ${bodyHtml}
                </body>
                </html>
            `;
        } catch (err) {
            return `<div style="color: red; padding: 20px;">Template Rendering Error: ${(err as Error).message}</div>`;
        }
    };


    const getUsedVariables = (html: string) => {
        const regex = /\{\{([a-zA-Z0-9_]+)\}\}/g;
        const matches = html.matchAll(regex);
        const variables = new Set<string>();
        for (const match of matches) {
            variables.add(match[1]);
        }
        // Also check for loops
        const loopRegex = /\{\{#each ([a-zA-Z0-9_]+)\}\}/g;
        const loopMatches = html.matchAll(loopRegex);
        for (const match of loopMatches) {
            variables.add(match[1]);
        }
        return variables;
    };

    const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
    const usedVariables = selectedTemplate ? getUsedVariables(selectedTemplate.htmlContent || "") : null;

    const isVisible = (field: string) => {
        if (!selectedTemplateId) return true;
        if (!usedVariables) return true;

        const mapping: Record<string, string[]> = {
            'paymentTerms': ['paymentTerms', 'payment_terms'],
            'dueDate': ['dueDate', 'due_date'],
            'poNumber': ['poNumber', 'po_number'],
            'shipTo': ['shipTo', 'shipping_address', 'ship_to'],
            'notes': ['notes'],
            'terms': ['terms', 'conditions'],
            'taxAmount': ['taxAmount', 'tax_amount', 'taxRate', 'tax_rate', 'tax'],
            'discountAmount': ['discountAmount', 'discount_amount', 'discount'],
            'shipping': ['shipping'],
            'amountPaid': ['amountPaid', 'amount_paid', 'paid'],
            'balanceDue': ['balanceDue', 'balance_due', 'balance'],
            'logo': ['logo'],
        };

        const vars = mapping[field] || [field];
        return vars.some(v => usedVariables.has(v));
    };

    return (
        <div className={cn(
            "bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all duration-500",
            isLanding ? "max-w-5xl mx-auto" : "w-full"
        )} style={{ fontFamily: '"Outfit", "Inter", sans-serif' }}>
            {/* Error Alert */}
            {error && (
                <div className="bg-rose-500/10 border-b border-rose-500/20 p-4 flex items-center gap-3 text-rose-600 animate-in slide-in-from-top duration-300">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                    <button onClick={() => setError(null)} className="ml-auto text-rose-400 hover:text-rose-600 font-bold">✕</button>
                </div>
            )}

            {/* The Actual Invoice Document View (Paper Effect) - ALWAYS LIGHT */}
            <div className="flex flex-col text-slate-900 min-h-[800px]">
                {isPreviewMode ? (
                    <>
                        <div className="flex-1 bg-slate-50 p-4 md:p-12 animate-in fade-in duration-500">
                            <div className="max-w-4xl mx-auto bg-white border rounded-xl overflow-hidden min-h-[1000px] border-slate-200">
                                <iframe
                                    sandbox=""
                                    key={`${invoiceDate}-${dueDate}-${invoiceNumber}-${logo}-${selectedTemplateId}-${taxId}`}
                                    title="Invoice Preview"
                                    srcDoc={renderPreviewHTML()}
                                    className="w-full h-[1000px] border-none"
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-white p-4 sm:p-8 md:p-16 flex flex-col">

                            {/* Header Section */}
                            <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-10 mb-8 md:mb-12">
                                <div className="flex-shrink-0">
                                    {!isViewOnly ? (
                                        <div
                                            onClick={() => !isViewOnly && fileInputRef.current?.click()}
                                            className={cn(
                                                "w-48 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-indigo-300 transition-all group overflow-hidden relative pdf-hide",
                                                isViewOnly && "cursor-default opacity-50"
                                            )}
                                        >
                                            {logo ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-1">
                                                    <Plus className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">+ Add Logo</span>
                                                </div>
                                            )}
                                            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" disabled={isViewOnly} />
                                        </div>
                                    ) : logo && (
                                        <div className="w-48 h-24 relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                    {logo && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={logo} alt="Logo" className="hidden print:block w-48 h-24 object-contain" />
                                    )}

                                    <div className="mt-6 max-w-sm">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">From (Your Details) <span className="text-rose-500">*</span></label>
                                        <textarea
                                            ref={fromAddressRef}
                                            placeholder="Your Name, Business Address, etc."
                                            value={fromAddress}
                                            onChange={(e) => { setFromAddress(e.target.value); if (fieldErrors.from) setFieldErrors({ ...fieldErrors, from: false }); }}
                                            readOnly={isViewOnly}
                                            className={cn(
                                                "w-full bg-slate-50 border rounded-lg p-3 focus:ring-1 focus:ring-indigo-500 text-sm leading-relaxed resize-none h-24 placeholder:text-slate-300 font-medium text-slate-800 outline-none transition-colors",
                                                fieldErrors.from ? "border-rose-500 ring-1 ring-rose-500 bg-rose-50/30" : "border-slate-100",
                                                isViewOnly && "cursor-default border-transparent bg-white px-0"
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="text-left md:text-right">
                                    <div className="relative group/title inline-block md:block">
                                        <input
                                            type="text"
                                            aria-label="Edit invoiceTitle label" value={labels.invoiceTitle}
                                            onChange={(e) => setLabels({ ...labels, invoiceTitle: e.target.value })}
                                            readOnly={isViewOnly}
                                            className={cn(
                                                "text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter mb-4 md:mb-6 bg-transparent border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-2xl px-2 md:px-4 py-2 transition-all outline-none w-full text-left md:text-right cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent"
                                            )}
                                        />
                                        {!isViewOnly && <Edit2 className="w-6 h-6 absolute -left-6 md:-left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/title:opacity-100 transition-opacity text-indigo-400" />}
                                    </div>

                                    <div className="flex flex-col gap-3 items-end w-full md:w-auto">

                                        {/* INVOICE NUMBER */}
                                        <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
                                            <div className="relative group/label flex-1 md:flex-none">
                                                <input
                                                    type="text"
                                                    aria-label="Invoice number label"
                                                    value={labels.invoiceNumber}
                                                    onChange={(e) => setLabels({ ...labels, invoiceNumber: e.target.value })}
                                                    readOnly={isViewOnly}
                                                    className={cn(
                                                        "text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] bg-transparent border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-lg px-2 py-1 transition-all outline-none w-full md:w-40 text-left md:text-right cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                        isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent"
                                                    )}
                                                />
                                                {!isViewOnly && <Edit2 className="w-2.5 h-2.5 absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-400 hidden md:block" />}
                                            </div>
                                            <span className="text-rose-500 text-[10px] font-bold w-2 text-center">*</span>
                                            <input
                                                type="text"
                                                aria-label="Invoice number"
                                                value={invoiceNumber}
                                                onChange={(e) => setInvoiceNumber(e.target.value)}
                                                readOnly={isViewOnly}
                                                className={cn(
                                                    "bg-slate-50 border border-slate-100 rounded-xl px-3 md:px-4 py-2 w-[140px] md:w-40 text-left md:text-right focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm font-bold text-slate-900",
                                                    isViewOnly && "bg-transparent border-transparent px-0 cursor-default"
                                                )}
                                            />
                                        </div>

                                        {/* DATE */}
                                        <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
                                            <div className="relative group/label flex-1 md:flex-none">
                                                <input
                                                    type="text"
                                                    aria-label="Invoice date label"
                                                    value={labels.date}
                                                    onChange={(e) => setLabels({ ...labels, date: e.target.value })}
                                                    readOnly={isViewOnly}
                                                    className={cn(
                                                        "text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] bg-transparent border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-lg px-2 py-1 transition-all outline-none w-full md:w-40 text-left md:text-right cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                        isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent"
                                                    )}
                                                />
                                                {!isViewOnly && <Edit2 className="w-2.5 h-2.5 absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-400 hidden md:block" />}
                                            </div>
                                            <span className="text-rose-500 text-[10px] font-bold w-2 text-center">*</span>
                                            <input
                                                type="date"
                                                aria-label="Invoice date"
                                                value={invoiceDate}
                                                onChange={(e) => setInvoiceDate(e.target.value)}
                                                readOnly={isViewOnly}
                                                className={cn(
                                                    "bg-slate-50 border border-slate-100 rounded-xl px-3 md:px-4 py-2 w-[140px] md:w-40 text-left md:text-right focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm font-bold text-slate-900",
                                                    isViewOnly && "bg-transparent border-transparent px-0 cursor-default"
                                                )}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-3 mt-1 w-full md:w-auto">
                                            {isVisible('paymentTerms') && (
                                                <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
                                                    <div className="relative group/label flex-1 md:flex-none">
                                                        <input
                                                            type="text"
                                                            aria-label="Edit paymentTerms label" value={labels.paymentTerms}
                                                            onChange={(e) => setLabels({ ...labels, paymentTerms: e.target.value })}
                                                            readOnly={isViewOnly}
                                                            className={cn(
                                                                "text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] bg-transparent border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-lg px-2 py-1 transition-all outline-none w-full md:w-48 text-left md:text-right cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                                isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent"
                                                            )}
                                                        />
                                                        {!isViewOnly && <Edit2 className="w-2.5 h-2.5 absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-400 hidden md:block" />}
                                                    </div>
                                                    <span className="w-2"></span> {/* Spacer for alignment */}
                                                    <input
                                                        type="text"
                                                        aria-label="Payment terms"
                                                        placeholder="e.g. Net 30"
                                                        value={paymentTerms}
                                                        onChange={(e) => setPaymentTerms(e.target.value)}
                                                        readOnly={isViewOnly}
                                                        className={cn(
                                                            "bg-slate-50 border border-slate-100 rounded-xl px-3 md:px-4 py-2 w-[140px] md:w-40 text-left md:text-right focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm font-bold text-slate-900 placeholder:text-slate-300",
                                                            isViewOnly && "bg-transparent border-transparent px-0 cursor-default"
                                                        )}
                                                    />
                                                </div>
                                            )}
                                            {isVisible('dueDate') && (
                                                <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
                                                    <div className="relative group/label flex-1 md:flex-none">
                                                        <input
                                                            type="text"
                                                            aria-label="Edit dueDate label" value={labels.dueDate}
                                                            onChange={(e) => setLabels({ ...labels, dueDate: e.target.value })}
                                                            readOnly={isViewOnly}
                                                            className={cn(
                                                                "text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] bg-transparent border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-lg px-2 py-1 transition-all outline-none w-full md:w-40 text-left md:text-right cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                                isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent"
                                                            )}
                                                        />
                                                        {!isViewOnly && <Edit2 className="w-2.5 h-2.5 absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-400 hidden md:block" />}
                                                    </div>
                                                    <span className="w-2"></span> {/* Spacer for alignment */}
                                                    <input
                                                        type="date"
                                                        aria-label="Due date"
                                                        value={dueDate}
                                                        onChange={(e) => setDueDate(e.target.value)}
                                                        min={todayStr}
                                                        readOnly={isViewOnly}
                                                        className={cn(
                                                            "bg-slate-50 border border-slate-100 rounded-xl px-3 md:px-4 py-2 w-[140px] md:w-40 text-left md:text-right focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm font-bold text-slate-900",
                                                            isViewOnly && "bg-transparent border-transparent px-0 cursor-default"
                                                        )}
                                                    />
                                                </div>
                                            )}
                                            {isVisible('poNumber') && (
                                                <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
                                                    <div className="relative group/label flex-1 md:flex-none">
                                                        <input
                                                            type="text"
                                                            aria-label="Edit poNumber label" value={labels.poNumber}
                                                            onChange={(e) => setLabels({ ...labels, poNumber: e.target.value })}
                                                            readOnly={isViewOnly}
                                                            className={cn(
                                                                "text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] bg-transparent border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-lg px-2 py-1 transition-all outline-none w-full md:w-40 text-left md:text-right cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                                isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent"
                                                            )}
                                                        />
                                                        {!isViewOnly && <Edit2 className="w-2.5 h-2.5 absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-400 hidden md:block" />}
                                                    </div>
                                                    <span className="w-2"></span> {/* Spacer for alignment */}
                                                    <input
                                                        type="text"
                                                        aria-label="PO Number"
                                                        placeholder="Optional"
                                                        value={poNumber}
                                                        onChange={(e) => setPoNumber(e.target.value)}
                                                        readOnly={isViewOnly}
                                                        className={cn(
                                                            "bg-slate-50 border border-slate-100 rounded-xl px-3 md:px-4 py-2 w-[140px] md:w-40 text-left md:text-right focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm font-bold text-slate-900 placeholder:text-slate-300",
                                                            isViewOnly && "bg-transparent border-transparent px-0 cursor-default"
                                                        )}
                                                    />
                                                </div>
                                            )}
                                            {/* CUSTOM TAX ID / BUSINESS NUMBER (e.g. ABN, Steuernummer, UTR, MST) */}
                                            {isVisible('taxId') && (
                                                <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
                                                    <div className="relative group/label flex-1 md:flex-none">
                                                        <input
                                                            type="text"
                                                            aria-label="Edit tax identification label"
                                                            value={labels.taxId || taxIdLabel}
                                                            onChange={(e) => setLabels({ ...labels, taxId: e.target.value })}
                                                            readOnly={isViewOnly}
                                                            className={cn(
                                                                "text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] bg-transparent border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-lg px-2 py-1 transition-all outline-none w-full md:w-44 text-left md:text-right cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                                isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent"
                                                            )}
                                                        />
                                                        {!isViewOnly && <Edit2 className="w-2.5 h-2.5 absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-400 hidden md:block" />}
                                                    </div>
                                                    <span className="w-2"></span> {/* Spacer for alignment */}
                                                    <input
                                                        type="text"
                                                        aria-label="Tax ID / Business Number"
                                                        placeholder={taxIdPlaceholder}
                                                        value={taxId}
                                                        onChange={(e) => setTaxId(e.target.value)}
                                                        readOnly={isViewOnly}
                                                        className={cn(
                                                            "bg-slate-50 border border-slate-100 rounded-xl px-3 md:px-4 py-2 w-[140px] md:w-48 text-left md:text-right focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm font-bold text-slate-900 placeholder:text-slate-300",
                                                            isViewOnly && "bg-transparent border-transparent px-0 cursor-default"
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Billing & Shipping Addresses Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-12 text-left">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="relative group/label">
                                            <input
                                                type="text"
                                                aria-label="Edit billTo label" value={labels.billTo}
                                                onChange={(e) => setLabels({ ...labels, billTo: e.target.value })}
                                                readOnly={isViewOnly}
                                                className={cn(
                                                    "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-transparent border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-lg px-2 py-1 transition-all outline-none w-40 cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                    isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent"
                                                )}
                                            />
                                            {!isViewOnly && <Edit2 className="w-2.5 h-2.5 absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-400" />}
                                        </div>
                                        {isLoggedIn && (
                                            <div className="flex items-center gap-2">
                                                <select
                                                    onChange={(e) => {
                                                        const client = clients.find(c => c.id === e.target.value);
                                                        if (client) handleSelectClient(client);
                                                    }}
                                                    className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none text-slate-600 focus:border-indigo-500"
                                                    value={selectedClientId || ''}
                                                >
                                                    <option value="">Select Saved Client</option>
                                                    {clients.map((c, idx) => (
                                                        <option key={c.id || idx} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => setIsClientModalOpen(true)}
                                                    className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all"
                                                    title="Add New Client"
                                                >
                                                    <UserPlus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <textarea
                                        ref={toAddressRef}
                                        placeholder="Who is this to? (Client Name & Address)"
                                        value={toAddress}
                                        onChange={(e) => {
                                            setToAddress(e.target.value);
                                            setSelectedClientId(null);
                                            if (fieldErrors.to) setFieldErrors({ ...fieldErrors, to: false });
                                        }}
                                        readOnly={isViewOnly}
                                        className={cn(
                                            "w-full bg-slate-50 border rounded-xl p-4 focus:ring-1 focus:ring-indigo-500 text-sm leading-relaxed resize-none h-24 placeholder:text-slate-300 font-medium text-slate-800 outline-none transition-colors",
                                            fieldErrors.to ? "border-rose-500 ring-1 ring-rose-500 bg-rose-50/30" : "border-slate-200",
                                            isViewOnly && "cursor-default border-transparent bg-white px-0"
                                        )}
                                    />
                                </div>
                                {isVisible('shipTo') && (
                                    <div className="space-y-2">
                                        <div className="relative group/label">
                                            <input
                                                type="text"
                                                aria-label="Edit shipTo label" value={labels.shipTo}
                                                onChange={(e) => setLabels({ ...labels, shipTo: e.target.value })}
                                                readOnly={isViewOnly}
                                                className={cn(
                                                    "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-transparent border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-lg px-2 py-1 transition-all outline-none w-48 cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                    isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent"
                                                )}
                                            />
                                            {!isViewOnly && <Edit2 className="w-2.5 h-2.5 absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-400" />}
                                        </div>
                                        <textarea
                                            placeholder="(optional)"
                                            value={shipTo}
                                            onChange={(e) => setShipTo(e.target.value)}
                                            readOnly={isViewOnly}
                                            className={cn(
                                                "w-full bg-slate-50 border border-slate-100 rounded-xl p-4 focus:ring-1 focus:ring-indigo-500 text-sm leading-relaxed resize-none h-24 placeholder:text-slate-300 font-medium text-slate-800 outline-none",
                                                isViewOnly && "bg-transparent border-transparent px-0 cursor-default"
                                            )}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Items Table */}
                            <div className="flex-grow" ref={itemsRef}>
                                <div className={cn(
                                    "overflow-hidden overflow-x-auto border rounded-lg transition-colors",
                                    fieldErrors.items ? "border-rose-500 ring-1 ring-rose-500 shadow-sm shadow-rose-500/20" : "border-slate-200"
                                )}>
                                    <table className="w-full min-w-[600px] text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-800 text-white">
                                                <th className="py-2.5 px-4">
                                                    <div className="relative group/label">
                                                        <input
                                                            type="text"
                                                            aria-label="Edit item label" value={labels.item}
                                                            onChange={(e) => setLabels({ ...labels, item: e.target.value })}
                                                            readOnly={isViewOnly}
                                                            className={cn(
                                                                "text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border border-transparent hover:border-slate-600 hover:bg-slate-700/50 rounded px-2 py-1 transition-all outline-none w-full text-white cursor-text focus:border-indigo-400 focus:bg-slate-700",
                                                                isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent"
                                                            )}
                                                        />
                                                        {!isViewOnly && <Edit2 className="w-2 h-2 absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-300" />}
                                                    </div>
                                                    <span className="text-indigo-300 absolute top-2 right-2 text-xs">*</span>
                                                </th>
                                                <th className="py-2.5 px-4 w-24">
                                                    <input
                                                        type="text"
                                                        aria-label="Quantity label"
                                                        value={labels.quantity}
                                                        onChange={(e) => setLabels({ ...labels, quantity: e.target.value })}
                                                        readOnly={isViewOnly}
                                                        className="text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border-none focus:ring-0 outline-none w-full text-center text-white"
                                                    />
                                                </th>
                                                <th className="py-2.5 px-4 w-32">
                                                    <input
                                                        type="text"
                                                        aria-label="Rate label"
                                                        value={labels.rate}
                                                        onChange={(e) => setLabels({ ...labels, rate: e.target.value })}
                                                        readOnly={isViewOnly}
                                                        className="text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border-none focus:ring-0 outline-none w-full text-right text-white"
                                                    />
                                                </th>
                                                <th className="py-2.5 px-4 w-40">
                                                    <input
                                                        type="text"
                                                        aria-label="Amount label"
                                                        value={labels.amount}
                                                        onChange={(e) => setLabels({ ...labels, amount: e.target.value })}
                                                        readOnly={isViewOnly}
                                                        className="text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border-none focus:ring-0 outline-none w-full text-right text-white"
                                                    />
                                                </th>
                                                <th className="py-2.5 px-2 text-center w-10 pdf-hide"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {items.map((item, idx) => (
                                                <tr key={item.id || idx} className="group">
                                                    <td className="py-2 px-4">
                                                        <input
                                                            type="text"
                                                            aria-label="Item description"
                                                            placeholder="Description of item/service..."
                                                            value={item.description}
                                                            onChange={(e) => { updateItem(item.id, 'description', e.target.value); if (fieldErrors.items) setFieldErrors({ ...fieldErrors, items: false }); }}
                                                            readOnly={isViewOnly}
                                                            className={cn(
                                                                "w-full bg-transparent border-none focus:ring-0 text-sm py-1 font-medium text-slate-800 outline-none",
                                                                isViewOnly && "cursor-default"
                                                            )}
                                                        />
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <input
                                                            type="number"
                                                            aria-label="Item quantity"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                                            readOnly={isViewOnly}
                                                            className={cn(
                                                                "w-full bg-transparent border-none focus:ring-0 text-center text-sm py-1 font-bold text-slate-800 outline-none",
                                                                isViewOnly && "cursor-default"
                                                            )}
                                                        />
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <div className="flex items-center justify-end">
                                                            <span className="text-slate-400 mr-1 text-xs">{currency}</span>
                                                            <input
                                                                type="number"
                                                                aria-label="Item rate"
                                                                value={item.rate}
                                                                onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                                                                readOnly={isViewOnly}
                                                                className={cn(
                                                                    "bg-transparent border-none focus:ring-0 text-right text-sm py-1 font-bold text-slate-800 outline-none w-20",
                                                                    isViewOnly && "cursor-default"
                                                                )}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-4 text-right text-sm font-semibold text-slate-800">
                                                        {currency}{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="py-2 px-2 text-center pdf-hide">
                                                        <button
                                                            aria-label="Remove item"
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {!isViewOnly && (
                                    <button
                                        onClick={addItem}
                                        className="mt-4 flex items-center gap-1.5 text-indigo-600 font-bold text-[11px] uppercase tracking-wider hover:underline pdf-hide"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Line Item
                                    </button>
                                )}
                            </div>

                            {/* Totals Section */}
                            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                                <div className="space-y-6">
                                    {isVisible('notes') && (
                                        <div className="space-y-2">
                                            <div className="relative group/label">
                                                <input
                                                    type="text"
                                                    aria-label="Edit notes label" value={labels.notes}
                                                    onChange={(e) => setLabels({ ...labels, notes: e.target.value })}
                                                    readOnly={isViewOnly}
                                                    className={cn(
                                                        "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-transparent border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-lg px-2 py-1 transition-all outline-none w-40 cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                        isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent"
                                                    )}
                                                />
                                                {!isViewOnly && <Edit2 className="w-2.5 h-2.5 absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-400" />}
                                            </div>
                                            <textarea
                                                placeholder="Any relevant information not already covered"
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                readOnly={isViewOnly}
                                                className={cn(
                                                    "w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm leading-relaxed resize-none h-20 outline-none font-medium text-slate-800 placeholder:text-slate-300",
                                                    isViewOnly && "bg-transparent border-transparent px-0 cursor-default h-auto"
                                                )}
                                            />
                                        </div>
                                    )}
                                    {isVisible('terms') && (
                                        <div className="space-y-2">
                                            <div className="relative group/label">
                                                <input
                                                    type="text"
                                                    aria-label="Edit terms label" value={labels.terms}
                                                    onChange={(e) => setLabels({ ...labels, terms: e.target.value })}
                                                    readOnly={isViewOnly}
                                                    className={cn(
                                                        "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-transparent border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-lg px-2 py-1 transition-all outline-none w-56 cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                        isViewOnly && "cursor-default hover:border-transparent hover:text-slate-400"
                                                    )}
                                                />
                                                {!isViewOnly && <Edit2 className="w-2.5 h-2.5 absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-400" />}
                                            </div>
                                            <textarea
                                                placeholder="Legal terms, late fees, payment instructions..."
                                                value={terms}
                                                onChange={(e) => setTerms(e.target.value)}
                                                readOnly={isViewOnly}
                                                className={cn(
                                                    "w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm leading-relaxed resize-none h-20 outline-none font-medium text-slate-800 placeholder:text-slate-300",
                                                    isViewOnly && "bg-transparent border-transparent px-0 cursor-default h-auto"
                                                )}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col items-end space-y-3">
                                    <div className="w-full max-w-xs space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="relative group/label">
                                                <input
                                                    type="text"
                                                    aria-label="Edit subtotal label" value={labels.subtotal}
                                                    onChange={(e) => setLabels({ ...labels, subtotal: e.target.value })}
                                                    readOnly={isViewOnly}
                                                    className={cn(
                                                        "text-slate-400 font-black uppercase tracking-widest text-[10px] bg-transparent border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded px-2 py-1 transition-all outline-none w-32 cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                        isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent"
                                                    )}
                                                />
                                                {!isViewOnly && <Edit2 className="w-2 h-2 absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-400" />}
                                            </div>
                                            <span className="font-semibold text-slate-800">{currency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        {isVisible('taxAmount') && (
                                            <div className="flex justify-between items-center text-sm gap-4">
                                                <div className="flex items-center gap-1">
                                                    <div className="relative group/label">
                                                        <input
                                                            type="text"
                                                            aria-label="Edit tax label" value={labels.tax}
                                                            onChange={(e) => setLabels({ ...labels, tax: e.target.value })}
                                                            readOnly={isViewOnly}
                                                            className={cn(
                                                                "text-slate-400 font-black uppercase tracking-widest text-[10px] whitespace-nowrap bg-transparent border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded px-2 py-1 transition-all outline-none w-28 cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                                isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent"
                                                            )}
                                                        />
                                                        {!isViewOnly && <Edit2 className="w-2 h-2 absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-400" />}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            type="number"
                                                            aria-label="Tax percentage" value={tax}
                                                            onChange={(e) => setTax(Number(e.target.value))}
                                                            readOnly={isViewOnly}
                                                            className={cn(
                                                                "w-20 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-right text-xs font-bold outline-none",
                                                                isViewOnly && "bg-transparent border-transparent cursor-default"
                                                            )}
                                                        />
                                                        {!isViewOnly && <span className="text-xs font-bold text-slate-400 select-none">%</span>}
                                                    </div>
                                                </div>
                                                <span className="font-semibold text-slate-800">{currency}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        )}
                                        {isVisible('discountAmount') && (
                                            <div className="flex justify-between items-center text-sm gap-4">
                                                <div className="flex items-center gap-1">
                                                    <div className="relative group/label">
                                                        <input
                                                            type="text"
                                                            aria-label="Edit discount label" value={labels.discount}
                                                            onChange={(e) => setLabels({ ...labels, discount: e.target.value })}
                                                            readOnly={isViewOnly}
                                                            className={cn(
                                                                "text-slate-400 font-black uppercase tracking-widest text-[10px] whitespace-nowrap bg-transparent border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded px-2 py-1 transition-all outline-none w-28 cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                                isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent"
                                                            )}
                                                        />
                                                        {!isViewOnly && <Edit2 className="w-2 h-2 absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-400" />}
                                                    </div>
                                                    <input
                                                        type="number"
                                                        aria-label="Discount amount" value={discount}
                                                        onChange={(e) => setDiscount(Number(e.target.value))}
                                                        readOnly={isViewOnly}
                                                        className={cn(
                                                            "w-20 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-right text-xs font-bold outline-none",
                                                            isViewOnly && "bg-transparent border-transparent cursor-default"
                                                        )}
                                                    />
                                                </div>
                                                <span className="font-semibold text-rose-500">-{currency}{discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        )}
                                        {isVisible('shipping') && (
                                            <div className="flex justify-between items-center text-sm gap-4">
                                                <div className="flex items-center gap-1">
                                                    <div className="relative group/label">
                                                        <input
                                                            type="text"
                                                            aria-label="Edit shipping label" value={labels.shipping}
                                                            onChange={(e) => setLabels({ ...labels, shipping: e.target.value })}
                                                            readOnly={isViewOnly}
                                                            className={cn(
                                                                "text-slate-400 font-black uppercase tracking-widest text-[10px] whitespace-nowrap bg-transparent border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded px-2 py-1 transition-all outline-none w-28 cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                                isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent"
                                                            )}
                                                        />
                                                        {!isViewOnly && <Edit2 className="w-2 h-2 absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-400" />}
                                                    </div>
                                                    <input
                                                        type="number"
                                                        aria-label="Shipping cost" value={shipping}
                                                        onChange={(e) => setShipping(Number(e.target.value))}
                                                        readOnly={isViewOnly}
                                                        className={cn(
                                                            "w-20 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-right text-xs font-bold outline-none",
                                                            isViewOnly && "bg-transparent border-transparent cursor-default"
                                                        )}
                                                    />
                                                </div>
                                                <span className="font-semibold text-slate-800">+{currency}{shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        )}
                                        <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                                            <div className="relative group/label">
                                                <input
                                                    type="text"
                                                    aria-label="Edit total label" value={labels.total}
                                                    onChange={(e) => setLabels({ ...labels, total: e.target.value })}
                                                    readOnly={isViewOnly}
                                                    className={cn(
                                                        "text-slate-900 font-black uppercase tracking-widest text-[11px] bg-transparent border border-transparent hover:border-slate-300 hover:bg-slate-50 rounded px-2 py-1 transition-all outline-none w-32 cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                        isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent hover:text-slate-900"
                                                    )}
                                                />
                                                {!isViewOnly && <Edit2 className="w-2.5 h-2.5 absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-500" />}
                                            </div>
                                            <span className="text-2xl font-black text-slate-900">{currency}{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="pt-4 flex flex-col gap-2 border-t border-slate-100 border-dashed">
                                            {isVisible('amountPaid') && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <div className="relative group/label">
                                                            <input
                                                                type="text"
                                                                aria-label="Edit amountPaid label" value={labels.amountPaid}
                                                                onChange={(e) => setLabels({ ...labels, amountPaid: e.target.value })}
                                                                readOnly={isViewOnly}
                                                                className={cn(
                                                                    "text-slate-400 font-black uppercase tracking-widest text-[10px] bg-transparent border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded px-2 py-1 transition-all outline-none w-32 cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                                    isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent"
                                                                )}
                                                            />
                                                            {!isViewOnly && <Edit2 className="w-2 h-2 absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-400" />}
                                                        </div>
                                                        <input
                                                            type="number"
                                                            aria-label="Amount paid" value={amountPaid}
                                                            onChange={(e) => setAmountPaid(Number(e.target.value))}
                                                            readOnly={isViewOnly}
                                                            className={cn(
                                                                "w-20 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-right text-xs font-bold outline-none",
                                                                isViewOnly && "bg-transparent border-transparent cursor-default"
                                                            )}
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-emerald-600">-{currency}{amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                </div>
                                            )}
                                            {isVisible('balanceDue') && (
                                                <div className="flex justify-between items-center py-2.5 px-3 border-l-4 border-indigo-500 bg-indigo-50/50 mt-4 rounded-r-lg">
                                                    <div className="relative group/label">
                                                        <input
                                                            type="text"
                                                            aria-label="Edit balanceDue label" value={labels.balanceDue}
                                                            onChange={(e) => setLabels({ ...labels, balanceDue: e.target.value })}
                                                            readOnly={isViewOnly}
                                                            className={cn(
                                                                "text-slate-900 font-black uppercase tracking-widest text-[11px] bg-transparent border border-transparent hover:border-slate-300 hover:bg-slate-50 rounded px-2 py-1 transition-all outline-none w-32 cursor-text focus:border-indigo-500 focus:bg-indigo-50/30 focus:text-indigo-600",
                                                                isViewOnly && "cursor-default hover:border-transparent hover:bg-transparent hover:text-slate-900"
                                                            )}
                                                        />
                                                        {!isViewOnly && <Edit2 className="w-2.5 h-2.5 absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover/label:opacity-100 transition-opacity text-indigo-500" />}
                                                    </div>
                                                    <span className="text-2xl font-black text-slate-900">{currencyName} {balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Application Toolbar */}
            {!isViewOnly && (
                <div className="bg-slate-50 border-t border-slate-200 p-4 md:p-6 flex flex-col lg:flex-row items-center justify-between gap-6 pdf-hide font-inter">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6">
                        <div className="flex flex-col gap-1 min-w-[120px]">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Currency</span>
                            <CurrencyPicker
                                value={currencyCode}
                                onChange={(c: Currency) => setCurrencyCode(c.code)}
                            />
                        </div>
                        {!isLanding && (
                            <>
                                <div className="w-px h-10 bg-slate-200 hidden lg:block" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Design Template</span>
                                    <button
                                        onClick={() => setIsTemplateModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-indigo-500 transition-all text-sm font-semibold text-slate-700"
                                    >
                                        <Layers className="w-4 h-4 text-indigo-500" />
                                        <span>{templates.find(t => t.id === selectedTemplateId)?.name || 'Default Classic'}</span>
                                    </button>
                                </div>
                            </>
                        )}
                        {(!isLanding || isLoggedIn) && (
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE')}
                                    className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500"
                                >
                                    <option value="DRAFT">Draft</option>
                                    <option value="SENT">Sent</option>
                                    <option value="PAID">Paid</option>
                                    <option value="OVERDUE">Overdue</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
                        {/* Preview Mode Toggle removed */}

                        <button
                            onClick={handleDownload}
                            disabled={isGeneratingPDF}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20 active:scale-95"
                        >
                            {isGeneratingPDF ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                            <span>{isGeneratingPDF ? 'Generating...' : standalonePreview ? 'Print / Save PDF' : 'Download PDF'}</span>
                        </button>
                        {!isLanding && (
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={cn(
                                    "w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md border-2 active:scale-95",
                                    saveSuccess
                                        ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-white"
                                )}
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save to Dashboard'}</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Special Simple Toolbar for View-Only mode */}
            {isViewOnly && (
                <div className="bg-slate-50 border-t border-slate-200 p-6 flex items-center justify-between pdf-hide">
                    <p className="text-sm font-medium text-slate-500">Viewing archived invoice document.</p>
                    <button
                        onClick={handleDownload}
                        disabled={isGeneratingPDF}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                    >
                        {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Download PDF Version
                    </button>
                </div>
            )}

            {/* Template Selection Modal */}
            {isTemplateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Select Invoice Design</h2>
                                <p className="text-slate-400 text-sm font-medium mt-1">Choose a template that fits your brand.</p>
                            </div>
                            <button
                                onClick={() => setIsTemplateModalOpen(false)}
                                className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-all"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 custom-scrollbar bg-slate-50/50">
                            {/* Default Template Option */}
                            <div
                                onClick={() => {
                                    setSelectedTemplateId(null);
                                    setIsPreviewMode(false);
                                    setIsTemplateModalOpen(false);
                                }}
                                className={cn(
                                    "group bg-white border-2 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-xl",
                                    !selectedTemplateId ? "border-indigo-500 shadow-lg shadow-indigo-500/10" : "border-slate-100 hover:border-slate-200"
                                )}
                            >
                                <div className="h-40 bg-slate-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-slate-100">
                                    <Layout className="w-10 h-10 text-slate-200 group-hover:text-indigo-200 transition-colors" />
                                </div>
                                <h3 className="font-bold text-slate-800">Classic Default</h3>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Standard Design</p>
                            </div>

                            {templates.map((tpl, idx) => (
                                <div
                                    key={tpl.id || idx}
                                    onClick={() => {
                                        setSelectedTemplateId(tpl.id);
                                        setIsPreviewMode(true);
                                        setIsTemplateModalOpen(false);
                                    }}
                                    className={cn(
                                        "group bg-white border-2 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-xl",
                                        selectedTemplateId === tpl.id ? "border-indigo-500 shadow-lg shadow-indigo-500/10" : "border-slate-100 hover:border-slate-200"
                                    )}
                                >
                                    <div className="h-40 bg-slate-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-slate-100 relative">
                                        {tpl.thumbnail ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={tpl.thumbnail} alt={tpl.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Layers className="w-10 h-10 text-slate-200 group-hover:text-indigo-200 transition-colors" />
                                        )}
                                        <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur border border-slate-100 rounded text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                                            {tpl.tier}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-slate-800">{tpl.name}</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">{tpl.category}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/* Add Client Modal */}
            {isClientModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-slate-200">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-600 rounded-xl text-white">
                                    <UserPlus className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black font-outfit text-slate-900">Add New Client</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Save for future invoices</p>
                                </div>
                            </div>
                            <button onClick={() => setIsClientModalOpen(false)} className="text-slate-400 hover:text-slate-900 font-bold">✕</button>
                        </div>

                        <div className="p-8 space-y-5 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Name *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Acme Corp"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all"
                                        value={newClient.name}
                                        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Email *</label>
                                    <input
                                        type="email"
                                        placeholder="client@email.com"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all"
                                        value={newClient.email}
                                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Address</label>
                                <textarea
                                    placeholder="Street, City, Zip..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all resize-none h-24"
                                    value={newClient.address}
                                    onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                                    <input
                                        type="text"
                                        placeholder="+1..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all"
                                        value={newClient.phone}
                                        onChange={(e) => setNewClient({ ...newClient, phone: handlePhoneInput(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tax ID / VAT</label>
                                    <input
                                        type="text"
                                        placeholder="Optional"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all"
                                        value={newClient.taxId}
                                        onChange={(e) => setNewClient({ ...newClient, taxId: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={() => setIsClientModalOpen(false)}
                                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateClient}
                                disabled={isCreatingClient}
                                className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                            >
                                {isCreatingClient ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Client'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
