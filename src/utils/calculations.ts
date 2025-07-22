import { InvoiceItem, TaxSettings } from '../types';

export const calculateItemAmount = (
  quantity: number,
  rate: number,
  taxRate: number,
  taxIncluded: boolean,
  taxSettings: TaxSettings
): {
  baseAmount: number;
  cgst: number;
  igst: number;
  utgst: number;
  totalAmount: number;
} => {
  const baseQuantityAmount = quantity * rate;
  
  let baseAmount: number;
  let totalTaxRate = 0;
  
  // Calculate total tax rate based on enabled taxes
  if (taxSettings.showCGST) totalTaxRate += taxRate / 2;
  if (taxSettings.showIGST) totalTaxRate += taxRate;
  if (taxSettings.showUTGST) totalTaxRate += taxRate / 2;
  
  if (taxIncluded) {
    // Tax is included in the rate
    baseAmount = baseQuantityAmount / (1 + totalTaxRate / 100);
  } else {
    // Tax is extra
    baseAmount = baseQuantityAmount;
  }
  
  const cgst = taxSettings.showCGST ? (baseAmount * taxRate / 2) / 100 : 0;
  const igst = taxSettings.showIGST ? (baseAmount * taxRate) / 100 : 0;
  const utgst = taxSettings.showUTGST ? (baseAmount * taxRate / 2) / 100 : 0;
  
  const totalAmount = baseAmount + cgst + igst + utgst;
  
  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
    utgst: Math.round(utgst * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100
  };
};

export const calculateInvoiceTotals = (items: InvoiceItem[]) => {
  const totals = items.reduce(
    (acc, item) => ({
      baseAmount: acc.baseAmount + (item.amount - item.cgst - item.igst - item.utgst),
      cgst: acc.cgst + item.cgst,
      igst: acc.igst + item.igst,
      utgst: acc.utgst + item.utgst,
      totalAmount: acc.totalAmount + item.amount
    }),
    { baseAmount: 0, cgst: 0, igst: 0, utgst: 0, totalAmount: 0 }
  );
  
  return {
    baseAmount: Math.round(totals.baseAmount * 100) / 100,
    cgst: Math.round(totals.cgst * 100) / 100,
    igst: Math.round(totals.igst * 100) / 100,
    utgst: Math.round(totals.utgst * 100) / 100,
    totalTax: Math.round((totals.cgst + totals.igst + totals.utgst) * 100) / 100,
    grandTotal: Math.round(totals.totalAmount * 100) / 100
  };
};