const express = require("express");
const { createExam } = require("../controllers/exam");
const { isAdmin } = require("../middlewares/check-auth");


const router = express.Router();

router.route("/")
  .post(isAdmin, createExam)

module.exports = router;
