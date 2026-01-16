exports.createBooking = async (req, res) => {
  res.json({ message: "Booking created" });
};

exports.cancelBooking = async (req, res) => {
  res.json({ message: "Booking cancelled" });
};
