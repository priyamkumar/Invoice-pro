import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all products
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50, search, isActive = true } = req.query;
    const query = { userId: req.user._id, isActive };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { hsnCode: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product
router.post('/', auth, [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('unit').trim().isLength({ min: 1 }).withMessage('Unit is required'),
  body('rate').isNumeric().withMessage('Rate must be a number'),
  body('taxRate').isNumeric().withMessage('Tax rate must be a number'),
  body('hsnCode').optional().trim().toUpperCase(),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productData = {
      ...req.body,
      userId: req.user._id
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/:id', auth, [
  body('name').optional().trim().isLength({ min: 1 }),
  body('unit').optional().trim().isLength({ min: 1 }),
  body('rate').optional().isNumeric(),
  body('taxRate').optional().isNumeric(),
  body('hsnCode').optional().trim().toUpperCase(),
  body('description').optional().trim(),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete(
      { _id: req.params.id, userId: req.user._id },
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;