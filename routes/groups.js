const express = require("express");
const checkAuth = require("../middlewares/check-auth");

const { allGroups, createGroup, groups, updGroup, delGroup } = require("../controllers/groups");

const router = express.Router();

router.route("/")
  .get(allGroups)
  .post(createGroup);

router.route("/:id")
  .get(groups)
  .put(checkAuth, updGroup)
  .delete(checkAuth, delGroup);

module.exports = router;
