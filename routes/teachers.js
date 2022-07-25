const express = require("express");
const checkAuth = require("../middlewares/check-auth");
const {allTeachersAndTime, updTeachersAndTime} = require("../controllers/teachersAndTime");

const router = express.Router();

router.get("/", allTeachersAndTime);

router.put("/", checkAuth, updTeachersAndTime);

module.exports = router;
