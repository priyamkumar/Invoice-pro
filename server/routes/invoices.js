import express from "express";
import { body, validationResult } from "express-validator";
import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get all invoices
router.get("/", auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      startDate,
      endDate,
      clientId,
    } = req.query;
    const query = { userId: req.user._id };

    if (status) query.status = status;
    if (clientId) query.clientId = clientId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const invoices = await Invoice.find(query)
      .sort({ date: -1, invoiceNumber: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Invoice.countDocuments(query);

    res.json({
      invoices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get invoices error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single invoice
router.get("/:id", auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    console.error("Get invoice error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create invoice
router.post(
  "/",
  auth,
  [
    body("clientId").isMongoId().withMessage("Valid client ID is required"),
    body("items")
      .isArray({ min: 1 })
      .withMessage("At least one item is required"),
    body("items.*.particulars")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Particulars is required"),
    body("items.*.quantity")
      .isNumeric()
      .withMessage("Quantity must be a number"),
    body("items.*.rate").isNumeric().withMessage("Rate must be a number"),
    body("items.*.taxRate")
      .isNumeric()
      .withMessage("Tax rate must be a number"),
    body("companyInfo.name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Company name is required"),
    body("totalAmount")
      .isNumeric()
      .withMessage("Total amount must be a number"),
    body("totalTax").isNumeric().withMessage("Total tax must be a number"),
    body("grandTotal").isNumeric().withMessage("Grand total must be a number"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // Verify client belongs to user
      const client = await Client.findOne({
        _id: req.body.clientId,
        userId: req.user._id,
      });

      if (!client) {
        return res.status(400).json({ message: "Invalid client" });
      }

      const invoiceData = {
        ...req.body,
        userId: req.user._id,
      };

      const invoice = new Invoice(invoiceData);
      await invoice.save();
      res.status(201).json(invoice);
    } catch (error) {
      if (error.code === 11000) {
        res
          .status(400)
          .json({
            message: "Invoice with same invoice number already exists.",
          });
      } else res.status(500).json({ message: "Server error" });
      console.error("Create invoice error:", error);
    }
  }
);

// Update invoice
router.put(
  "/:id",
  auth,
  [
    body("status").optional().isIn(["draft", "sent", "paid", "overdue"]),
    body("items").optional().isArray({ min: 1 }),
    body("totalAmount").optional().isNumeric(),
    body("totalTax").optional().isNumeric(),
    body("grandTotal").optional().isNumeric(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const invoice = await Invoice.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      res.json(invoice);
    } catch (error) {
      console.error("Update invoice error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete invoice
router.delete("/:id", auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Delete invoice error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get invoice statistics
router.get("/stats/overview", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const stats = await Invoice.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalAmount: { $sum: "$grandTotal" },
          paidAmount: {
            $sum: {
              $cond: [{ $eq: ["$status", "paid"] }, "$grandTotal", 0],
            },
          },
          pendingAmount: {
            $sum: {
              $cond: [{ $ne: ["$status", "paid"] }, "$grandTotal", 0],
            },
          },
        },
      },
    ]);

    const monthlyStats = await Invoice.aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: new Date(currentYear, currentMonth, 1),
            $lt: new Date(currentYear, currentMonth + 1, 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          monthlyInvoices: { $sum: 1 },
          monthlyAmount: { $sum: "$grandTotal" },
        },
      },
    ]);

    res.json({
      total: stats[0] || {
        totalInvoices: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
      },
      monthly: monthlyStats[0] || { monthlyInvoices: 0, monthlyAmount: 0 },
    });
  } catch (error) {
    console.error("Get invoice stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
