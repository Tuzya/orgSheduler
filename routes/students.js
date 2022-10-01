const express = require("express");
const {checkAuth} = require("../middlewares/check-auth");
const {allStudents, updStudent, getComment, getStudent} = require("../controllers/students");

const router = express.Router();

router.get("/", checkAuth, allStudents);
router.get('/history/comment/last', checkAuth, getComment)
router.get("/:id", checkAuth, getStudent);

router.put("/", checkAuth, updStudent);

module.exports = router;
