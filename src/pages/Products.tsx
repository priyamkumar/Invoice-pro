import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { useInvoice } from '../context/InvoiceContext';
import { Product } from '../types';

const Products: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useInvoice();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    hsnCode: '',
    unit: '',
    rate: '',
    taxRate: '18'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      hsnCode: formData.hsnCode,
      unit: formData.unit,
      rate: parseFloat(formData.rate),
      taxRate: parseFloat(formData.taxRate)
    };

    if (editingProduct) {
      updateProduct(editingProduct._id, productData);
      setEditingProduct(null);
    } else {
      addProduct(productData);
    }
    setFormData({ name: '', hsnCode: '', unit: '', rate: '', taxRate: '18' });
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      hsnCode: product.hsnCode,
      unit: product.unit,
      rate: product.rate.toString(),
      taxRate: product.taxRate.toString()
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', hsnCode: '', unit: '', rate: '', taxRate: '18' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
                <input
                  type="text"
                  value={formData.hsnCode}
                  onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter HSN code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select unit</option>
                  <option value="pcs">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="m">Meters</option>
                  <option value="hrs">Hours</option>
                  <option value="sets">Sets</option>
                  <option value="nos">Numbers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate (₹) *</label>
                <input
                  type="number"
                  required
                  step="1"
                  min="0"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter rate"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%) *</label>
                <select
                  required
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {editingProduct ? 'Update' : 'Add'} Product
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">HSN Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tax Rate</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{product.hsnCode}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{product.unit}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 text-right">₹{product.rate.toFixed(2)}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 text-right">{product.taxRate}%</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
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

        {products.length === 0 && !showForm && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first product.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;