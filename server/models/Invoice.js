import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  particulars: {
    type: String,
    required: true,
    trim: true
  },
  hsnCode: {
    type: String,
    trim: true,
    uppercase: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  rate: {
    type: Number,
    required: true,
    min: 0
  },
  taxRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  cgst: {
    type: Number,
    default: 0,
    min: 0
  },
  igst: {
    type: Number,
    default: 0,
    min: 0
  },
  utgst: {
    type: Number,
    default: 0,
    min: 0
  }
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  items: [invoiceItemSchema],
  companyInfo: {
    name: { type: String, required: true },
    phone: String,
    email: String,
    gstin: String,
    address: String
  },
  bankDetails: {
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    branchName: String
  },
  taxSettings: {
    showCGST: { type: Boolean, default: true },
    showIGST: { type: Boolean, default: false },
    showUTGST: { type: Boolean, default: false },
    taxIncluded: { type: Boolean, default: false }
  },
  termsAndConditions: {
    type: String,
    default: '1. Goods once accepted will not be taken back.\n2. If payment is not made within 15 days, Interest @ 18% will be charged extra.\n3. All disputes subject to Chandigarh Jurisdiction.'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  totalTax: {
    type: Number,
    required: true,
    min: 0
  },
  grandTotal: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue'],
    default: 'draft'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
invoiceSchema.index({ userId: 1, invoiceNumber: 1 });
invoiceSchema.index({ userId: 1, date: -1 });
invoiceSchema.index({ userId: 1, status: 1 });

export default mongoose.model('Invoice', invoiceSchema);