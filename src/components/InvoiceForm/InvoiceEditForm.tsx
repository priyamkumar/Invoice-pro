import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, X } from "lucide-react";
import { InvoiceItem, TaxSettings, Invoice, Client } from "../../types";
import { useInvoice } from "../../context/InvoiceContext";
import {
  calculateItemAmount,
  calculateInvoiceTotals,
} from "../../utils/calculations";
import ProductRow from "./ProductRow";
import TaxToggle from "./TaxToggle";

interface InvoiceEditFormProps {
  invoice: Invoice;
  client: Client;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
}

const InvoiceEditForm: React.FC<InvoiceEditFormProps> = ({
  invoice,
  client,
  onSave,
  onCancel,
}) => {
  const { products } = useInvoice();
  const [invoiceDate, setInvoiceDate] = useState(invoice.date.split("T")[0]);
  const [items, setItems] = useState<InvoiceItem[]>(invoice.items);
  const [taxSettings, setTaxSettings] = useState<TaxSettings>(
    invoice.taxSettings
  );
  const [termsAndConditions, setTermsAndConditions] = useState(
    invoice.termsAndConditions
  );

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
      recalculateItem(updatedItems, index);
    }

    setItems(updatedItems);
  };

  const updateItemFields = (
    index: number,
    updatedFields: Partial<InvoiceItem>
  ) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], ...updatedFields };
    recalculateItem(updatedItems, index);
    setItems(updatedItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const recalculateItem = (items: InvoiceItem[], index: number) => {
    const item = items[index];
    const calculations = calculateItemAmount(
      item.quantity,
      item.rate,
      item.taxRate,
      taxSettings.taxIncluded,
      taxSettings
    );

    items[index] = {
      ...item,
      amount: calculations.totalAmount,
      cgst: calculations.cgst,
      igst: calculations.igst,
      utgst: calculations.utgst,
    };
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

  const handleSave = () => {
    if (items.length === 0) {
      alert("Please add at least one item to save the invoice.");
      return;
    }

    const updatedInvoice: Invoice = {
      ...invoice,
      date: invoiceDate,
      items,
      taxSettings,
      termsAndConditions,
      totalAmount: totals.baseAmount,
      totalTax: totals.totalTax,
      grandTotal: totals.grandTotal,
    };

    onSave(updatedInvoice);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={onCancel}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Invoice {invoice.invoiceNumber}
            </h1>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Client Information
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span> {client.name}
                </p>
                <p>
                  <span className="font-medium">GSTIN:</span> {client.gstin}
                </p>
                <p>
                  <span className="font-medium">Address:</span> {client.address}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {client.phone}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {client.email}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <TaxToggle taxSettings={taxSettings} onChange={setTaxSettings} />

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Invoice Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={invoice.invoiceNumber}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
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
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
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
                  <th className="px-3 py-2 text-center text-xs font-medium text-purple-600 uppercase">
                    UTGST
                  </th>
                )}
                {taxSettings.showCGST && (
                  <th className="px-3 py-2 text-center text-xs font-medium text-green-600 uppercase">
                    CGST
                  </th>
                )}
                {taxSettings.showIGST && (
                  <th className="px-3 py-2 text-center text-xs font-medium text-orange-600 uppercase">
                    IGST
                  </th>
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
                  key={index}
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
            No items in this invoice. Click "Add Item" to add items.
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
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditForm;
