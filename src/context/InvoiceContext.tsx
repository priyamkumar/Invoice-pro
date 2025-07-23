import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Client,
  Product,
  Invoice,
  CompanyInfo,
  BankDetails,
} from "../types";
import { apiService } from "../services/api";

interface InvoiceContextType {
  // State
  clients: Client[];
  products: Product[];
  invoices: Invoice[];
  companyInfo: CompanyInfo;
  bankDetails: BankDetails;

  // Actions
  addClient: (client: Omit<Client, "_id">) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  addProduct: (product: Omit<Product, "_id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  saveInvoice: (invoice: Omit<Invoice, "id">) => void;
  deleteInvoice: (id: string) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  updateCompanyInfo: (info: CompanyInfo) => void;
  updateBankDetails: (details: BankDetails) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoice must be used within an InvoiceProvider");
  }
  return context;
};

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "",
    phone: "",
    email: "",
    gstin: "",
    address: "",
  });
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, productsData, invoicesData, companyData] =
          await Promise.all([
            apiService.getClients(),
            apiService.getProducts(),
            apiService.getInvoices(),
            apiService.getCompanyInfo(),
          ]);
        setClients(clientsData);
        setProducts(productsData);
        setInvoices(invoicesData);
        setCompanyInfo({
          name: companyData.name,
          phone: companyData.phone || "",
          email: companyData.email || "",
          gstin: companyData.gstin || "",
          address: companyData.address || "",
        });
        setBankDetails({
          bankName: companyData.bankDetails?.bankName || "",
          accountNumber: companyData.bankDetails?.accountNumber || "",
          ifscCode: companyData.bankDetails?.ifscCode || "",
          branchName: companyData.bankDetails?.branchName || "",
        });
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadData();
  }, []);

  const addClient = async (client: Omit<Client, "_id">) => {
    try {
      const newClient = await apiService.createClient(client);
      setClients([...clients, newClient]);
    } catch (error) {
      console.error("Failed to add client:", error);
      throw error;
    }
  };

  const updateClient = async (id: string, clientUpdate: Partial<Client>) => {
    try {
      const updatedClient = await apiService.updateClient(id, clientUpdate);
      setClients(
        clients.map((client) => (client._id === id ? updatedClient : client))
      );
    } catch (error) {
      console.error("Failed to update client:", error);
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await apiService.deleteClient(id);
      setClients(clients.filter((client) => client._id !== id));
    } catch (error) {
      console.error("Failed to delete client:", error);
      throw error;
    }
  };

  const addProduct = async (product: Omit<Product, "_id">) => {
    try {
      const newProduct = await apiService.createProduct(product);
      setProducts([...products, newProduct]);
    } catch (error) {
      console.error("Failed to add product:", error);
      throw error;
    }
  };

  const updateProduct = async (id: string, productUpdate: Partial<Product>) => {
    try {
      const updatedProduct = await apiService.updateProduct(id, productUpdate);
      setProducts(
        products.map((product) =>
          product._id === id ? updatedProduct : product
        )
      );
    } catch (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await apiService.deleteProduct(id);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw error;
    }
  };

  const saveInvoice = async (invoice: Omit<Invoice, "id">) => {
    try {
      const newInvoice = await apiService.createInvoice(invoice);
      setInvoices([...invoices, newInvoice]);
    } catch (error) {
      console.error("Failed to save invoice:", error);
      throw error;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      await apiService.deleteInvoice(id);
      setInvoices(invoices.filter((invoice) => invoice._id !== id));
    } catch (error) {
      console.error("Failed to save invoice:", error);
      throw error;
    }
  };

  const updateInvoice = async (id: string, invoiceUpdate: Partial<Invoice>) => {
    try {
      const updatedInvoice = await apiService.updateInvoice(id, invoiceUpdate);
      setInvoices(invoices.map(invoice =>
        invoice._id === id ? updatedInvoice : invoice
      ));
    } catch (error) {
      console.error('Failed to update invoice:', error);
      throw error;
    }
  };

  const updateCompanyInfo = async (info: CompanyInfo) => {
    try {
      await apiService.updateCompanyInfo(info);
      setCompanyInfo(info);
    } catch (error) {
      console.error("Failed to update company info:", error);
      throw error;
    }
  };

  const updateBankDetails = async (details: BankDetails) => {
    try {
      await apiService.updateCompanyInfo(details);
      setBankDetails(details);
    } catch (error) {
      console.error("Failed to update bank details:", error);
      throw error;
    }
  };

  return (
    <InvoiceContext.Provider
      value={{
        clients,
        products,
        invoices,
        companyInfo,
        bankDetails,
        addClient,
        updateClient,
        deleteClient,
        addProduct,
        updateProduct,
        deleteProduct,
        saveInvoice,
        deleteInvoice,
        updateInvoice,
        updateCompanyInfo,
        updateBankDetails,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
