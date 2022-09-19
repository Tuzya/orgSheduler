const express = require("express");
const {checkAuth} = require("../middlewares/check-auth");

const { allGroups, createGroup, groups, updGroup, delGroup, updAllGroups, updCRTablesGroup } = require("../controllers/groups");

const router = express.Router();

router.route("/")
  .get(allGroups)
  .post(checkAuth, createGroup)
  .patch(checkAuth, updAllGroups)

router.route("/:id")
  .get(groups)
  .put(checkAuth, updGroup)
  .delete(checkAuth, delGroup);

router.route('/crtables/:id')
  .put(checkAuth, updCRTablesGroup)

module.exports = router;
