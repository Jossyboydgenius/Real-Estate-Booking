const express = require("express");
const { createResidency, getAllResidencies, getResidency } = require("../controllers/resdCntrl.js");
const { jwtCheck } = require("../config/auth0Config.js"); // destructure!

const router = express.Router();

router.post("/create", jwtCheck, createResidency);
router.get("/allresd", getAllResidencies);
router.get("/:id", getResidency);

exports.residencyRoute = router;
