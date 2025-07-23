import { Client, Product, Invoice, CompanyInfo, BankDetails } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = response.token;
    localStorage.setItem('token', response.token);
    return response;
  }

  async register(name: string, email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    this.token = response.token;
    localStorage.setItem('token', response.token);
    return response;
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Client methods
  async getClients() {
    const response = await this.request<{ clients: Client[] }>('/clients');
    return response.clients;
  }

  async createClient(client: Omit<Client, '_id'>) {
    return this.request<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  }

  async updateClient(id: string, client: Partial<Client>) {
    return this.request<Client>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    });
  }

  async deleteClient(id: string) {
    return this.request<{ message: string }>(`/clients/${id}`, {
      method: 'DELETE',
    });
  }

  // Product methods
  async getProducts() {
    const response = await this.request<{ products: Product[] }>('/products');
    return response.products;
  }

  async createProduct(product: Omit<Product, '_id'>) {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: Partial<Product>) {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string) {
    return this.request<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Invoice methods
  async getInvoices() {
    const response = await this.request<{ invoices: Invoice[] }>('/invoices');
    return response.invoices;
  }

  async createInvoice(invoice: Omit<Invoice, 'id'>) {
    return this.request<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    });
  }

  async updateInvoice(id: string, invoice: Partial<Invoice>) {
    return this.request<Invoice>(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoice),
    });
  }

   async deleteInvoice(id: string) {
    return this.request<Invoice>(`/invoices/${id}`, {
      method: 'DELETE',
    });
  }

  async getInvoiceStats() {
    return this.request<any>('/invoices/stats/overview');
  }

  // Company methods
  async getCompanyInfo() {
    return this.request<CompanyInfo & BankDetails>('/company');
  }

  async updateCompanyInfo(info: Partial<CompanyInfo & BankDetails>) {
    return this.request<CompanyInfo & BankDetails>('/company', {
      method: 'PUT',
      body: JSON.stringify(info),
    });
  }
}

export const apiService = new ApiService();