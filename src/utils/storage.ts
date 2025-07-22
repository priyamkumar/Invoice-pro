import { Client, Product, Invoice, CompanyInfo, BankDetails } from '../types';

const STORAGE_KEYS = {
  CLIENTS: 'invoice_clients',
  PRODUCTS: 'invoice_products',
  INVOICES: 'invoice_invoices',
  COMPANY_INFO: 'invoice_company_info',
  BANK_DETAILS: 'invoice_bank_details',
  INVOICE_COUNTER: 'invoice_counter'
};

export const storage = {
  // Clients
  getClients: (): Client[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return data ? JSON.parse(data) : [];
  },
  
  saveClients: (clients: Client[]) => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  },
  
  // Products
  getProducts: (): Product[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },
  
  saveProducts: (products: Product[]) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },
  
  // Invoices
  getInvoices: (): Invoice[] => {
    const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return data ? JSON.parse(data) : [];
  },
  
  saveInvoices: (invoices: Invoice[]) => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  },
  
  // Company Info
  getCompanyInfo: (): CompanyInfo => {
    const data = localStorage.getItem(STORAGE_KEYS.COMPANY_INFO);
    return data ? JSON.parse(data) : {
      name: 'Company Name',
      phone: '',
      email: '',
      gstin: '',
      address: ''
    };
  },
  
  saveCompanyInfo: (info: CompanyInfo) => {
    localStorage.setItem(STORAGE_KEYS.COMPANY_INFO, JSON.stringify(info));
  },
  
  // Bank Details
  getBankDetails: (): BankDetails => {
    const data = localStorage.getItem(STORAGE_KEYS.BANK_DETAILS);
    return data ? JSON.parse(data) : {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branchName: ''
    };
  },
  
  saveBankDetails: (details: BankDetails) => {
    localStorage.setItem(STORAGE_KEYS.BANK_DETAILS, JSON.stringify(details));
  },
};