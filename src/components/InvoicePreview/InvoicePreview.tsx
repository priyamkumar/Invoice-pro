import React, { useRef } from "react";
import { ArrowLeft, Save, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Invoice, Client } from "../../types";
import { useInvoice } from "../../context/InvoiceContext";
import { calculateInvoiceTotals } from "../../utils/calculations";

interface InvoicePreviewProps {
  invoice: Invoice;
  client: Client;
  onBack: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  client,
  onBack,
}) => {
  const { saveInvoice } = useInvoice();
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const handleSave = () => {
    const handleSaveAsync = async () => {
      try {
        await saveInvoice(invoice);
        alert("Invoice saved successfully!");
        onBack();
      } catch (error) {
        alert("Failed to save invoice. Please try again.");
      }
    };

    handleSaveAsync();
  };

  const totals = calculateInvoiceTotals(invoice.items);
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Form
            </button>
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <div
          ref={componentRef}
          className="bg-white shadow-lg rounded-lg overflow-hidden print-optimized"
        >
          <div className="p-6">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-200 pb-4 mb-4">
              <h1
                className="text-2xl font-bold text-gray-900 mb-1"
                style={{ fontFamily: "serif" }}
              >
                Tax Invoice
              </h1>
              <h2 className="text-xl font-bold text-gray-800">
                {invoice.companyInfo.name}
              </h2>
              <div className="mt-1 text-xs text-gray-600 space-y-0.5">
                <p>Phone No: {invoice.companyInfo.phone}</p>
                <p>Email: {invoice.companyInfo.email}</p>
                <p>GSTIN: {invoice.companyInfo.gstin}</p>
                <p>{invoice.companyInfo.address}</p>
              </div>
            </div>

            {/* Bill To and Invoice Details */}
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                  Bill To:
                </h3>
                <div className="text-xs text-gray-700 space-y-0.5">
                  <p className="font-medium">{client.name}</p>
                  <p>GSTIN: {client.gstin}</p>
                  {client.address && <p>{client.address}</p>}
                  {client.phone && <p>Phone: {client.phone}</p>}
                  {client.email && <p>Email: {client.email}</p>}
                </div>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                  Invoice Details:
                </h3>
                <div className="text-xs text-gray-700 space-y-0.5">
                  <p>Invoice No: {invoice.invoiceNumber}</p>
                  <p>
                    Date: {new Date(invoice.date).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-4">
              <table className="w-full border border-gray-300 table-fixed">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-1 py-1 text-xs font-medium text-gray-900 w-10">
                      Sr. No
                    </th>
                    <th className="border border-gray-300 px-1 py-1 text-xs font-medium text-gray-900 w-16">
                      HSN Code
                    </th>
                    <th className="border border-gray-300 px-1 py-1 text-xs font-medium text-gray-900 w-32 ">
                      Particulars
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900 w-12">
                      QTY
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900 w-12">
                      Unit
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900 w-16">
                      Price
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900 w-20">
                      Taxable Amt.
                    </th>

                    {invoice.taxSettings.showUTGST && (
                      <>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900 w-10">
                          UTGST Rate
                        </th>
                         <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900 w-16">
                          UTGST Amt.
                        </th>
                      </>
                    )}
                    {invoice.taxSettings.showCGST && (
                      <>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900 w-10">
                          CGST Rate
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900 w-16">
                          CGST Amt.
                        </th>
                      </>
                    )}
                    {invoice.taxSettings.showIGST && (
                      <>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900 w-10">
                          IGST Rate
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900 w-16">
                          IGST Amt.
                        </th>
                      </>
                    )}
                    <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-900 w-20">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.particulars}>
                      <td className="border border-gray-300 px-1 py-1 text-xs text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-xs break-words">
                        {item.hsnCode}
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-xs break-words leading-tight">
                        {item.particulars}
                      </td>

                      <td className="border border-gray-300 px-1 py-1 text-xs text-center">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-xs text-center break-words">
                        {item.unit}
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-xs text-right">
                        ₹{item.rate.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-xs text-right">
                        ₹{(item.rate * item.quantity).toFixed(2)}
                      </td>
                      {invoice.taxSettings.showUTGST && (
                        <>
                          <td className="border border-gray-300 px-1 py-1 text-xs text-right">
                            {(item.taxRate / 2).toFixed(1)}%
                          </td>
                          <td className="border border-gray-300 px-1 py-1 text-xs text-right">
                            ₹{item.utgst.toFixed(2)}
                          </td>
                        </>
                      )}
                      {invoice.taxSettings.showCGST && (
                        <>
                          <td className="border border-gray-300 px-2 py-2 text-xs text-right">
                            {(item.taxRate / 2).toFixed(1)}%
                          </td>
                          <td className="border border-gray-300 px-2 py-2 text-xs text-right">
                            ₹{item.cgst.toFixed(2)}
                          </td>
                        </>
                      )}
                      {invoice.taxSettings.showIGST && (
                        <>
                          <td className="border border-gray-300 px-2 py-2 text-xs text-right">
                            {item.taxRate}%
                          </td>
                          <td className="border border-gray-300 px-2 py-2 text-xs text-right">
                            ₹{item.igst.toFixed(2)}
                          </td>
                        </>
                      )}
                      <td className="border border-gray-300 px-1 py-1 text-xs text-right font-medium">
                        ₹{item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                  Bank Details:
                </h3>
                <div className="text-xs text-gray-700 space-y-0.5">
                  <p>Bank Name: {invoice.bankDetails.bankName}</p>
                  <p>
                    Bank Account Number: {invoice.bankDetails.accountNumber}
                  </p>
                  <p>Bank Branch IFSC: {invoice.bankDetails.ifscCode}</p>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{totals.baseAmount.toFixed(2)}</span>
                </div>
                {invoice.taxSettings.showUTGST && (
                  <div className="flex justify-between text-sm">
                    <span>UTGST:</span>
                    <span>₹{totals.utgst.toFixed(2)}</span>
                  </div>
                )}
                {invoice.taxSettings.showCGST && (
                  <div className="flex justify-between text-sm">
                    <span>CGST:</span>
                    <span>₹{totals.cgst.toFixed(2)}</span>
                  </div>
                )}
                {invoice.taxSettings.showIGST && (
                  <div className="flex justify-between text-sm">
                    <span>IGST:</span>
                    <span>₹{totals.igst.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Total GST:</span>
                  <span>₹{totals.totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t pt-1">
                  <span>Grand Total:</span>
                  <span>₹{totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                Terms and Conditions:
              </h3>
              <div className="text-xs text-gray-700 whitespace-pre-line">
                {invoice.termsAndConditions}
              </div>
            </div>

            {/* Footer */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="border-t border-gray-300 mt-8 pt-1">
                  <p className="text-sm text-gray-600">
                    Receiver's Signature with seal
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-gray-300 mt-8 pt-1">
                  <p className="text-sm text-gray-600">Authorised Signatory</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-3 text-xs text-gray-500">
              <p>
                Certified that the particulars given above are true and correct.
              </p>
              <p>For {invoice.companyInfo.name}</p>
            </div>
          </div>
        </div>

        <style>{`
          @media print {
          @page {
      margin: 3mm; /* Adjust margin as needed (top, right, bottom, left) */
    }

            .print-optimized {
              box-shadow: none !important;
              border-radius: 0 !important;
            }
            
            .print-optimized > div {
              padding: 0.5rem !important;
            }
            
            /* Prevent page breaks within table rows */
            tbody tr {
              page-break-inside: avoid;
            }
            
            /* Optimize table spacing for print */
            table {
              font-size: 10px !important;
            }
            
            th, td {
              padding: 2px 4px !important;
              line-height: 1.2 !important;
            }
            
            /* Ensure text wrapping in print */
            .break-words {
              word-wrap: break-word !important;
              word-break: break-word !important;
              hyphens: auto !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default InvoicePreview;
