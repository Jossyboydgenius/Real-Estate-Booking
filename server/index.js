const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { userRoute } = require("./routes/userRoute.js");
const { residencyRoute } = require("./routes/residencyRoute.js");
const { paymentRoute } = require("./routes/paymentRoute.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api/user", userRoute);
app.use("/api/residency", residencyRoute);
app.use("/api/payments", paymentRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Optional: export app if needed for testing
exports.app = app;
