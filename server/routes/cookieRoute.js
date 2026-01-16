const express = require("express");
const router = express.Router();

const {
    getCookie
} = require("../controllers/cookieCntrl");

// Cookie session loader
router.get("/", getCookie);

exports.cookieRoute = router;
