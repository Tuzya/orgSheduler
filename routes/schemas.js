const express = require("express");
const checkAuth = require("../middlewares/check-auth");
const {allSchemas, schemas, updSchemas, allCRSchemas, updCRSchemas} = require("../controllers/schemas");

const router = express.Router();

router.get("/", allSchemas);
router.get('/crschemas', allCRSchemas)
router.get("/:phase", schemas);
router.put("/crschemas", checkAuth, updCRSchemas);
router.put("/:phase", checkAuth, updSchemas);

module.exports = router;
