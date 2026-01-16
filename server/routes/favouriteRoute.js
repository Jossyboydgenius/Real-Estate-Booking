const express = require("express");
const router = express.Router();

const {
    toFav,
    getAllFav
} = require("../controllers/favouriteCntrl");

router.post("/toggle/:rid", toFav);
router.post("/list", getAllFav);

exports.favouriteRoute = router;