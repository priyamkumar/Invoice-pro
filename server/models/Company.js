import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  gstin: {
    type: String,
    trim: true,
    uppercase: true
  },
  address: {
    type: String,
    trim: true
  },
  bankDetails: {
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    branchName: String
  },
  logo: {
    type: String // URL or base64 string
  },
  invoiceSettings: {
    prefix: {
      type: String,
      default: 'INV'
    },
    startingNumber: {
      type: Number,
      default: 1
    },
    currentNumber: {
      type: Number,
      default: 0
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Company', companySchema);