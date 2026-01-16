const createNotification = require("../helpers/createNotification");

exports.getAll = async (req, res) => {
  res.json({ message: "All notifications" });
};

exports.markAsRead = async (req, res) => {
  res.json({ message: "Notification read" });
};
