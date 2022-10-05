const express = require("express");
const {checkAuth} = require("../middlewares/check-auth");
const {allStudents, updComment, getComment, getStudent} = require("../controllers/students");

const router = express.Router();

router.get("/", checkAuth, allStudents);
// router.put('/', checkAuth, updStudents);
router.get('/history/comment/last', checkAuth, getComment)
router.get("/:id", checkAuth, getStudent);

router.put("/history/comment", checkAuth, updComment);

module.exports = router;
