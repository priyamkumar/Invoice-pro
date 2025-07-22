import express from 'express';
import { body, validationResult } from 'express-validator';
import Company from '../models/Company.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get company profile
router.get('/', auth, async (req, res) => {
  try {
    let company = await Company.findOne({ userId: req.user._id });
    
    if (!company) {
      // Create default company profile if it doesn't exist
      company = new Company({
        name: 'Your Company Name',
        userId: req.user._id
      });
      await company.save();
    }

    res.json(company);
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update company profile
router.put('/', auth, [
  body('name').optional().trim().isLength({ min: 1 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('gstin').optional().trim().toUpperCase(),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('bankDetails.bankName').optional().trim(),
  body('bankDetails.accountNumber').optional().trim(),
  body('bankDetails.ifscCode').optional().trim(),
  body('bankDetails.branchName').optional().trim(),
  body('invoiceSettings.prefix').optional().trim(),
  body('invoiceSettings.startingNumber').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let company = await Company.findOne({ userId: req.user._id });
    
    if (!company) {
      // Create new company profile
      company = new Company({
        ...req.body,
        userId: req.user._id
      });
    } else {
      // Update existing company profile
      Object.assign(company, req.body);
    }

    await company.save();
    res.json(company);
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update invoice settings
router.put('/invoice-settings', auth, [
  body('prefix').optional().trim().isLength({ min: 1 }),
  body('startingNumber').optional().isNumeric(),
  body('currentNumber').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const company = await Company.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { invoiceSettings: req.body } },
      { new: true, upsert: true }
    );

    res.json(company.invoiceSettings);
  } catch (error) {
    console.error('Update invoice settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get next invoice number preview
router.get('/next-invoice-number', auth, async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    
    if (!company) {
      return res.json({ nextNumber: 'INV-0001' });
    }

    const nextNumber = company.invoiceSettings.currentNumber + 1;
    const invoiceNumber = `${company.invoiceSettings.prefix}-${String(nextNumber).padStart(4, '0')}`;

    res.json({ nextNumber: invoiceNumber });
  } catch (error) {
    console.error('Get next invoice number error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;