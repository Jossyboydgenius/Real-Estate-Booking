const express = require("express");
const router = express.Router();

const {
    bookVisit,
    getAllBookings,
    cancelBooking
} = require("../controllers/bookingCntrl");

// Bookings Routes
router.post("/book/:id", bookVisit);
router.post("/list", getAllBookings);
router.delete("/cancel/:id", cancelBooking);

exports.bookingRoute = router;
