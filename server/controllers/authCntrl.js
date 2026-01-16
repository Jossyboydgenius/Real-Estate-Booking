const asyncErrorHandler = require("../helpers/asyncErrorHandler");

exports.register = asyncErrorHandler(async (req, res) => {
  res.json({ message: "Register user" });
});

exports.login = asyncErrorHandler(async (req, res) => {
  res.json({ message: "Login user" });
});

exports.logout = asyncErrorHandler(async (req, res) => {
  res.json({ message: "Logout" });
});
