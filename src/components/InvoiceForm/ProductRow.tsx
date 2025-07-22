import React from "react";
import { Trash2 } from "lucide-react";
import { InvoiceItem, Product } from "../../types";

interface ProductRowProps {
  item: InvoiceItem;
  products: Product[];
  index: number;
  showCGST: boolean;
  showIGST: boolean;
  showUTGST: boolean;
  onChange: (index: number, field: keyof InvoiceItem, value: any) => void;
  onBulkChange: (index: number, updatedFields: Partial<InvoiceItem>) => void;
  onRemove: (index: number) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({
  item,
  products,
  index,
  showCGST,
  showIGST,
  showUTGST,
  onChange,
  onBulkChange,
  onRemove,
}) => {
  // Validation helper functions
  const isFieldEmpty = (value: any): boolean => {
    if (typeof value === "string") return value.trim() === "";
    if (typeof value === "number") return value <= 0;
    return !value;
  };

  const getFieldValidationClass = (value: any, baseClass: string): string => {
    const isEmpty = isFieldEmpty(value);
    return `${baseClass} ${
      isEmpty ? "border-red-300 bg-red-50" : "border-gray-300"
    }`;
  };

  const validateAndChange = (field: keyof InvoiceItem, value: any): void => {
    // Allow the change but show validation styling
    onChange(index, field, value);
  };

  const validateAndChangeNumber = (
    field: keyof InvoiceItem,
    value: string
  ): void => {
    const numValue = parseFloat(value) || 0;
    validateAndChange(field, numValue);
  };

  const handleProductSelect = (productId: string) => {
    if (!productId) {
      // If empty selection, don't update other fields
      onChange(index, "productId", "");
      return;
    }

    const product = products.find((p) => p._id === productId);
    if (product) {
      // Batch all field updates together
      const updatedFields: Partial<InvoiceItem> = {
        productId,
        particulars: product.name,
        hsnCode: product.hsnCode,
        unit: product.unit,
        rate: product.rate,
        taxRate: product.taxRate,
      };

      onBulkChange(index, updatedFields);
    }
  };

  // Check if row has validation errors
  const hasErrors =
    isFieldEmpty(item.hsnCode) ||
    isFieldEmpty(item.particulars) ||
    isFieldEmpty(item.quantity) ||
    isFieldEmpty(item.unit) ||
    isFieldEmpty(item.rate);

  return (
    <tr
      className={`border-b ${
        hasErrors ? "border-red-200 bg-red-50/30" : "border-gray-200"
      }`}
    >
      <td className="px-3 py-2 text-center text-sm">{index + 1}</td>

      {/* HSN Code */}
      <td className="px-3 py-2">
        <input
          type="text"
          value={item.hsnCode}
          onChange={(e) => validateAndChange("hsnCode", e.target.value)}
          className={getFieldValidationClass(
            item.hsnCode,
            "w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          )}
          placeholder="HSN Code"
          required
        />
        {isFieldEmpty(item.hsnCode) && (
          <span className="text-xs text-red-500 mt-1 block">
            HSN Code required
          </span>
        )}
      </td>

      {/* Product Selection and Particulars */}
      <td className="px-3 py-2">
        <select
          value={item.productId}
          onChange={(e) => handleProductSelect(e.target.value)}
          className={getFieldValidationClass(
            item.productId,
            "w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 mb-1"
          )}
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={item.particulars}
          onChange={(e) => validateAndChange("particulars", e.target.value)}
          className={getFieldValidationClass(
            item.particulars,
            "w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          )}
          placeholder="Particulars"
          required
        />
        {isFieldEmpty(item.particulars) && (
          <span className="text-xs text-red-500 mt-1 block">
            Product description required
          </span>
        )}
      </td>

      {/* Quantity */}
      <td className="px-3 py-2">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => validateAndChangeNumber("quantity", e.target.value)}
          className={getFieldValidationClass(
            item.quantity,
            "w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          )}
          min="0"
          step="1"
          required
        />
        {isFieldEmpty(item.quantity) && (
          <span className="text-xs text-red-500 mt-1 block">Qty required</span>
        )}
      </td>

      {/* Unit */}
      <td className="px-3 py-2">
        <input
          type="text"
          value={item.unit}
          onChange={(e) => validateAndChange("unit", e.target.value)}
          className={getFieldValidationClass(
            item.unit,
            "w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          )}
          placeholder="Unit"
          required
        />
        {isFieldEmpty(item.unit) && (
          <span className="text-xs text-red-500 mt-1 block">Unit required</span>
        )}
      </td>

      {/* Rate */}
      <td className="px-3 py-2">
        <input
          type="number"
          value={item.rate}
          onChange={(e) => validateAndChangeNumber("rate", e.target.value)}
          className={getFieldValidationClass(
            item.rate,
            "w-24 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          )}
          min="0"
          step="1"
          required
        />
        {isFieldEmpty(item.rate) && (
          <span className="text-xs text-red-500 mt-1 block">Rate required</span>
        )}
      </td>

      {/* Tax columns */}
      {showUTGST && (
        <>
          <td className="px-3 py-2 text-center text-sm">{(item.taxRate / 2).toFixed(1)}%</td>
        <td className="px-3 py-2 text-center text-sm">
            ₹{item.utgst.toFixed(2)}
          </td>
        </>
      )}
      {showCGST && (
        <>
          <td className="px-3 py-2 text-center text-sm">{(item.taxRate / 2).toFixed(1)}%</td>
          <td className="px-3 py-2 text-center text-sm">
            ₹{item.cgst.toFixed(2)}
          </td>
        </>
      )}
      {showIGST && (
        <>
          <td className="px-3 py-2 text-center text-sm">{item.taxRate}%</td>
          <td className="px-3 py-2 text-center text-sm">
            ₹{item.igst.toFixed(2)}
          </td>
        </>
      )}

      {/* Amount */}
      <td className="px-3 py-2 text-center text-sm font-medium">
        ₹{item.amount.toFixed(2)}
      </td>

      {/* Remove button */}
      <td className="px-3 py-2 text-center">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
};

// Export a validation utility function that parent components can use
export const validateInvoiceItem = (
  item: InvoiceItem
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!item.hsnCode?.trim()) errors.push("HSN Code is required");
  if (!item.particulars?.trim()) errors.push("Product description is required");
  if (!item.quantity || item.quantity <= 0)
    errors.push("Quantity must be greater than 0");
  if (!item.unit?.trim()) errors.push("Unit is required");
  if (!item.rate || item.rate <= 0) errors.push("Rate must be greater than 0");

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Export a function to validate all items
export const validateAllItems = (
  items: InvoiceItem[]
): {
  isValid: boolean;
  itemErrors: Array<{ index: number; errors: string[] }>;
} => {
  const itemErrors: Array<{ index: number; errors: string[] }> = [];

  items.forEach((item, index) => {
    const validation = validateInvoiceItem(item);
    if (!validation.isValid) {
      itemErrors.push({ index, errors: validation.errors });
    }
  });

  return {
    isValid: itemErrors.length === 0,
    itemErrors,
  };
};

export default ProductRow;
