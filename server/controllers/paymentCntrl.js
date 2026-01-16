exports.processPayment = async (req, res) => {
  res.json({ message: "Payment processed" });
};

exports.paymentWebhook = async (req, res) => {
  res.json({ message: "Payment webhook received" });
};
