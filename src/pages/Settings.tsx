import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useInvoice } from '../context/InvoiceContext';

const Settings: React.FC = () => {
  const { companyInfo, bankDetails, updateCompanyInfo, updateBankDetails } = useInvoice();
  const [companyForm, setCompanyForm] = useState(companyInfo);
  const [bankForm, setBankForm] = useState(bankDetails);

  // Sync form state when context data changes (e.g., after fetching)
  useEffect(() => {
    setCompanyForm(companyInfo);
  }, [companyInfo]);

  useEffect(() => {
    setBankForm(bankDetails);
  }, [bankDetails]);

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyInfo(companyForm);
    alert('Company information updated successfully!');
  };

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBankDetails(bankForm);
    alert('Bank details updated successfully!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Company Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
        <form onSubmit={handleCompanySubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={companyForm.name || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={companyForm.phone || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={companyForm.email || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
              <input
                type="text"
                value={companyForm.gstin || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, gstin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter GSTIN"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={companyForm.address || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company address"
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Company Info
            </button>
          </div>
        </form>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h2>
        <form onSubmit={handleBankSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={bankForm.bankName || ''}
                onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter bank name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                value={bankForm.accountNumber || ''}
                onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter account number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
              <input
                type="text"
                value={bankForm.ifscCode || ''}
                onChange={(e) => setBankForm({ ...bankForm, ifscCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter IFSC code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
              <input
                type="text"
                value={bankForm.branchName || ''}
                onChange={(e) => setBankForm({ ...bankForm, branchName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter branch name"
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Bank Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;