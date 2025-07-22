import express from 'express';
import { body, validationResult } from 'express-validator';
import Client from '../models/Client.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all clients
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const query = { userId: req.user._id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { gstin: { $regex: search, $options: 'i' } }
      ];
    }

    const clients = await Client.find(query)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Client.countDocuments(query);

    res.json({
      clients,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single client
router.get('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create client
router.post('/', auth, [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('email').optional().isEmail().normalizeEmail(),
  body('gstin').optional().trim().toUpperCase(),
  body('phone').optional().trim(),
  body('address').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const clientData = {
      ...req.body,
      userId: req.user._id
    };

    const client = new Client(clientData);
    await client.save();

    res.status(201).json(client);
  } catch (error) {
    console.error('Create client error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Client with this information already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Update client
router.put('/:id', auth, [
  body('name').optional().trim().isLength({ min: 1 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('gstin').optional().trim().toUpperCase(),
  body('phone').optional().trim(),
  body('address').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete client
router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;