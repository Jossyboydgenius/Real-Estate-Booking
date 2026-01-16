const express = require("express");
const { 
    bookVisit,
    cancelBooking,
    createUser,
    getAllBookings,
    getAllFav,
    toFav
} = require("../controllers/userCntrl.js");

const { jwtCheck } = require("../config/auth0Config.js");  // <-- Destructure

const router = express.Router();

router.post("/register", jwtCheck, createUser);
router.post("/bookVisit/:id", jwtCheck, bookVisit);
router.post("/allBookings", getAllBookings);
router.post("/removeBooking/:id", jwtCheck, cancelBooking);
router.post("/toFav/:rid", jwtCheck, toFav);
router.post("/allFav/", jwtCheck, getAllFav);

exports.userRoute = router;
