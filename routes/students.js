const express = require("express");
const {checkAuth} = require("../middlewares/check-auth");
const {allStudents, updComment, updStudent, getComment, getStudent, createStudents} = require("../controllers/students");

const router = express.Router();

router.get("/", checkAuth, allStudents);
// router.put('/', checkAuth, updStudents);
router.post('/', checkAuth, createStudents);

router.get('/history/comment/last', checkAuth, getComment)
router.put("/history/comment", checkAuth, updComment);

router.get("/:id", checkAuth, getStudent);
router.put('/:id', checkAuth, updStudent);


module.exports = router;
