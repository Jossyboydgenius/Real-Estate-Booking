exports.sendMessage = async (req, res) => {
  res.json({ message: "Message sent" });
};

exports.getMessages = async (req, res) => {
  res.json({ message: "Messages fetched" });
};
