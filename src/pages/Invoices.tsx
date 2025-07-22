import React from "react";
import { FileText, Eye, Trash2, Calendar } from "lucide-react";
import { useInvoice } from "../context/InvoiceContext";
import InvoicePreview from "../components/InvoicePreview/InvoicePreview";
import { Invoice } from "../types";

const Invoices: React.FC = () => {
  const { invoices, clients, deleteInvoice } = useInvoice();
  const [previewInvoice, setPreviewInvoice] = React.useState<Invoice | null>(
    null
  );

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c._id === clientId);
    return client ? client.name : "Unknown Client";
  };

  const getClientById = (clientId: string) => {
    return clients.find((c) => c._id === clientId);
  };

  const handlePreview = (invoice: Invoice) => {
    setPreviewInvoice(invoice);
  };

  const handleClosePreview = () => {
    setPreviewInvoice(null);
  };

  if (previewInvoice) {
    const client = getClientById(previewInvoice.clientId?._id);
    if (!client) {
      return (
        <div className="text-center py-12">
          <p className="text-red-600">Client not found for this invoice.</p>
          <button
            onClick={handleClosePreview}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Invoices
          </button>
        </div>
      );
    }

    return (
      <InvoicePreview
        invoice={previewInvoice}
        client={client}
        onBack={handleClosePreview}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Generated Invoices
          </h1>
          <div className="text-sm text-gray-600">
            Total: {invoices.length} invoices
          </div>
        </div>

        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Invoice No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Client
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Tax
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="font-medium text-gray-900">
                          {invoice.invoiceNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(invoice.date).toLocaleDateString("en-IN")}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {getClientName(invoice.clientId?._id)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 text-right">
                      ₹{invoice.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 text-right">
                      ₹{invoice.totalTax.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 text-right font-medium">
                      ₹{invoice.grandTotal.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          onClick={() => handlePreview(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteInvoice(invoice._id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No invoices yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start creating invoices to see them here.
            </p>
          </div>
        )}
      </div>

      {invoices.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Invoice Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Total Invoices
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {invoices.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      invoices.filter((inv) => {
                        const invDate = new Date(inv.date);
                        const now = new Date();
                        return (
                          invDate.getMonth() === now.getMonth() &&
                          invDate.getFullYear() === now.getFullYear()
                        );
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-900">
                    Total Value
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₹
                    {invoices
                      .reduce((sum, inv) => sum + inv.grandTotal, 0)
                      .toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
