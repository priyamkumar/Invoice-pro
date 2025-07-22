import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { InvoiceItem, TaxSettings } from "../../types";
import { useInvoice } from "../../context/InvoiceContext";
import {
  calculateItemAmount,
  calculateInvoiceTotals,
} from "../../utils/calculations";
import ClientSelector from "./ClientSelector";
import ProductRow, { validateAllItems } from "./ProductRow";
import TaxToggle from "./TaxToggle";
import InvoicePreview from "../InvoicePreview/InvoicePreview";
import { storage } from "../../utils/storage";

const InvoiceForm: React.FC = () => {
  const { companyInfo, clients, products } = useInvoice();
  const [selectedClientId, setSelectedClientId] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [invoiceNumber, setInvoiceNumber] = useState("1");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [taxSettings, setTaxSettings] = useState<TaxSettings>({
    showCGST: false,
    showIGST: true,
    showUTGST: false,
    taxIncluded: false,
  });
  const [termsAndConditions, setTermsAndConditions] = useState(
    "1. Goods once accepted will not be taken back.\n2. If payment is not made within 15 days, Interest @ 18% will be charged extra.\n3. All disputes subject to Chandigarh Jurisdiction."
  );
  const [showPreview, setShowPreview] = useState(false);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      productId: "",
      particulars: "",
      hsnCode: "",
      quantity: 1,
      unit: "",
      rate: 0,
      taxRate: 18,
      amount: 0,
      cgst: 0,
      igst: 0,
      utgst: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Recalculate amounts when relevant fields change
    if (["quantity", "rate", "taxRate"].includes(field)) {
      const item = updatedItems[index];
      const calculations = calculateItemAmount(
        item.quantity,
        item.rate,
        item.taxRate,
        taxSettings.taxIncluded,
        taxSettings
      );

      updatedItems[index] = {
        ...updatedItems[index],
        amount: calculations.totalAmount,
        cgst: calculations.cgst,
        igst: calculations.igst,
        utgst: calculations.utgst,
      };
    }

    setItems(updatedItems);
  };

  const updateItemFields = (
    index: number,
    updatedFields: Partial<InvoiceItem>
  ) => {
    const updatedItems = [...items];
    const prevItem = updatedItems[index];
    const newItem = { ...prevItem, ...updatedFields };

    const calculations = calculateItemAmount(
      newItem.quantity,
      newItem.rate,
      newItem.taxRate,
      taxSettings.taxIncluded,
      taxSettings
    );

    updatedItems[index] = {
      ...newItem,
      amount: calculations.totalAmount,
      cgst: calculations.cgst,
      igst: calculations.igst,
      utgst: calculations.utgst,
    };

    setItems(updatedItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Recalculate all items when tax settings change
  useEffect(() => {
    const updatedItems = items.map((item) => {
      const calculations = calculateItemAmount(
        item.quantity,
        item.rate,
        item.taxRate,
        taxSettings.taxIncluded,
        taxSettings
      );

      return {
        ...item,
        amount: calculations.totalAmount,
        cgst: calculations.cgst,
        igst: calculations.igst,
        utgst: calculations.utgst,
      };
    });

    setItems(updatedItems);
  }, [taxSettings]);

  const totals = calculateInvoiceTotals(items);

  const handlePreview = () => {
    if (!selectedClientId || items.length === 0) {
      alert(
        "Please select a client and add at least one item to preview the invoice."
      );
      return;
    }
    const validation = validateAllItems(items);

    if (!validation.isValid) {
      alert("Please fill all fields."); // Show error message or prevent saving
      return;
    }

    setShowPreview(true);
  };
  const selectedClient = clients.find((c) => c._id === selectedClientId);
  if (showPreview && selectedClient) {
    const invoice = {
      id: "",
      invoiceNumber: invoiceNumber,
      date: invoiceDate,
      clientId: selectedClientId,
      items,
      companyInfo: companyInfo,
      bankDetails: storage.getBankDetails(),
      taxSettings,
      termsAndConditions,
      totalAmount: totals.baseAmount,
      totalTax: totals.totalTax,
      grandTotal: totals.grandTotal,
    };

    return (
      <InvoicePreview
        invoice={invoice}
        client={selectedClient}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Create New Invoice
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ClientSelector
              selectedClientId={selectedClientId}
              onSelectClient={setSelectedClientId}
            />
          </div>

          <div className="space-y-6">
            <TaxToggle taxSettings={taxSettings} onChange={setTaxSettings} />

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Invoice Details
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Sr. No
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  HSN Code
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Particulars
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  QTY
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Unit
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Rate
                </th>
                {taxSettings.showUTGST && (
                  <>
                  <th className="px-3 py-2 text-center text-xs font-medium text-purple-600 uppercase">
                    UTGST Rate
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-purple-600 uppercase">
                    UTGST Amt.
                  </th></>
                )}
                {taxSettings.showCGST && (
                  <>
                  <th className="px-3 py-2 text-center text-xs font-medium text-green-600 uppercase">
                    CGST Rate
                  </th>
                   <th className="px-3 py-2 text-center text-xs font-medium text-green-600 uppercase">
                    CGST Amt.
                  </th>
                  </>
                )}
                {taxSettings.showIGST && (
                  <>
                    <th className="px-3 py-2 text-center text-xs font-medium text-orange-600 uppercase">
                      IGST Rate
                    </th>

                    <th className="px-3 py-2 text-center text-xs font-medium text-orange-600 uppercase">
                      IGST Amt.
                    </th>
                  </>
                )}
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <ProductRow
                  key={item.id}
                  item={item}
                  products={products}
                  index={index}
                  showCGST={taxSettings.showCGST}
                  showIGST={taxSettings.showIGST}
                  showUTGST={taxSettings.showUTGST}
                  onChange={updateItem}
                  onBulkChange={updateItemFields}
                  onRemove={removeItem}
                />
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No items added yet. Click "Add Item" to get started.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Terms & Conditions
          </h3>
          <textarea
            value={termsAndConditions}
            onChange={(e) => setTermsAndConditions(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter terms and conditions..."
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Invoice Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">
                ₹{totals.baseAmount.toFixed(2)}
              </span>
            </div>
            {taxSettings.showCGST && (
              <div className="flex justify-between">
                <span className="text-green-600">CGST:</span>
                <span className="font-medium">₹{totals.cgst.toFixed(2)}</span>
              </div>
            )}
            {taxSettings.showIGST && (
              <div className="flex justify-between">
                <span className="text-orange-600">IGST:</span>
                <span className="font-medium">₹{totals.igst.toFixed(2)}</span>
              </div>
            )}
            {taxSettings.showUTGST && (
              <div className="flex justify-between">
                <span className="text-purple-600">UTGST:</span>
                <span className="font-medium">₹{totals.utgst.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Grand Total:</span>
                <span>₹{totals.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePreview}
            className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Preview Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
