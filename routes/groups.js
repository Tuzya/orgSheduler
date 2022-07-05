const express = require("express");
const checkAuth = require("../middlewares/check-auth");

const { allGroups, createGroup, groups, updGroup, delGroup, updAllGroups } = require("../controllers/groups");

const router = express.Router();

router.route("/")
  .get(allGroups)
  .post(createGroup)
  .patch(updAllGroups)

router.route("/:id")
  .get(groups)
  .put(checkAuth, updGroup)
  .delete(checkAuth, delGroup);

module.exports = router;
