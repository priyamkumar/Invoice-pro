export interface Client {
  _id: string;
  name: string;
  gstin: string;
  address: string;
  phone: string;
  email: string;
}

export interface Product {
  _id: string;
  name: string;
  hsnCode: string;
  unit: string;
  rate: number;
  taxRate: number;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  particulars: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  rate: number;
  taxRate: number;
  amount: number;
  cgst: number;
  igst: number;
  utgst: number;
}

export interface CompanyInfo {
  name: string;
  phone: string;
  email: string;
  gstin: string;
  address: string;
  bankDetails?: BankDetails; 
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
}

export interface InvoiceSettings {
  prefix: string;
  startingNumber: number;
}

export interface TaxSettings {
  showCGST: boolean;
  showIGST: boolean;
  showUTGST: boolean;
  taxIncluded: boolean;
}

export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  date: string;
  clientId: string;
  items: InvoiceItem[];
  companyInfo: CompanyInfo;
  bankDetails: BankDetails;
  taxSettings: TaxSettings;
  termsAndConditions: string;
  totalAmount: number;
  totalTax: number;
  grandTotal: number;
}
