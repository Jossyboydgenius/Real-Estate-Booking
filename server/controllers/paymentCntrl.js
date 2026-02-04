const asyncHandler = require("express-async-handler");
const { prisma } = require("../config/prismaConfig.js");
const crypto = require("crypto");

/**
 * POST /api/payments/create-intent
 * @param {Object} req.body - { propertyId, userId, amount, currency }
 */
exports.createPaymentIntent = asyncHandler(async (req, res) => {
  const { propertyId, userId, amount, currency } = req.body;

  // 1. Validate input
  if (!propertyId || !userId || !amount || !currency) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: propertyId, userId, amount, and currency are required",
    });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Amount must be a positive number",
    });
  }

  const validCurrencies = ["USD", "EUR", "GBP", "CAD", "AUD"];
  if (!validCurrencies.includes(currency.toUpperCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid currency. Supported currencies: ${validCurrencies.join(", ")}`,
    });
  }

  // 2. Check if user already paid for the same property
  const existingPayment = await prisma.payment.findUnique({
    where: {
      propertyId_userId: {
        propertyId,
        userId,
      },
    },
  });

  if (existingPayment) {
    // Check if payment is already completed or pending
    if (existingPayment.status === "COMPLETED") {
      return res.status(409).json({
        success: false,
        message: "Payment already completed for this property",
        paymentId: existingPayment.id,
      });
    }

    if (existingPayment.status === "PENDING") {
      return res.status(409).json({
        success: false,
        message: "A pending payment already exists for this property",
        paymentId: existingPayment.id,
        transactionId: existingPayment.paymentIntentId,
      });
    }
  }

  // 3. Create a transaction ID (in production, this would be the blockchain transaction hash)
  const transactionId = `tx_${crypto.randomBytes(16).toString("hex")}`;

  // 4. Save transaction with status PENDING
  const payment = await prisma.payment.create({
    data: {
      propertyId,
      userId,
      amount,
      currency: currency.toUpperCase(),
      status: "PENDING",
      paymentIntentId: transactionId,
    },
  });

  res.status(201).json({
    success: true,
    message: "Payment transaction created successfully",
    data: {
      paymentId: payment.id,
      transactionId: payment.paymentIntentId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
    },
  });
});

/**
 * Process payment (update status)
 */
exports.processPayment = asyncHandler(async (req, res) => {
  const { transactionId, status } = req.body;

  if (!transactionId || !status) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: transactionId and status are required",
    });
  }

  const validStatuses = ["COMPLETED", "FAILED", "REFUNDED"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Valid statuses: ${validStatuses.join(", ")}`,
    });
  }

  const payment = await prisma.payment.update({
    where: { paymentIntentId: transactionId },
    data: { status },
  });

  res.json({
    success: true,
    message: "Payment status updated successfully",
    data: payment,
  });
});

/**
 * Blockchain webhook handler - handles transaction confirmations
 */
exports.paymentWebhook = asyncHandler(async (req, res) => {
  // In production, verify the blockchain transaction on-chain
  const { type, data } = req.body;

  if (type === "transaction.confirmed") {
    await prisma.payment.update({
      where: { paymentIntentId: data.transactionId },
      data: { status: "COMPLETED" },
    });
  } else if (type === "transaction.failed") {
    await prisma.payment.update({
      where: { paymentIntentId: data.transactionId },
      data: { status: "FAILED" },
    });
  }

  res.json({ received: true });
});

/**
 * Get payment by ID
 */
exports.getPaymentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const payment = await prisma.payment.findUnique({
    where: { id },
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
    });
  }

  res.json({
    success: true,
    data: payment,
  });
});

/**
 * Get all payments for a user
 */
exports.getUserPayments = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const payments = await prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    success: true,
    data: payments,
  });
});
