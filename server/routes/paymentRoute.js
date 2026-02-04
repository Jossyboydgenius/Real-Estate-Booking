const express = require("express");
const router = express.Router();

const {
  createPaymentIntent,
  processPayment,
  paymentWebhook,
  getPaymentById,
  getUserPayments,
} = require("../controllers/paymentCntrl");

// Payment Routes
router.post("/create-intent", createPaymentIntent);
router.post("/process", processPayment);
router.post("/webhook", paymentWebhook);
router.get("/:id", getPaymentById);
router.get("/user/:userId", getUserPayments);

exports.paymentRoute = router;
