import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  hsnCode: {
    type: String,
    trim: true,
    uppercase: true
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
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
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
productSchema.index({ userId: 1, name: 1 });
productSchema.index({ userId: 1, hsnCode: 1 });

export default mongoose.model('Product', productSchema);