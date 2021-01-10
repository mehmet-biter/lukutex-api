const express = require("express");
const router = express.Router();

const blockListController = require("../controllers/blockList");

router.get("/fetch/all", blockListController.fetchAll);
router.get("/find/:userID", blockListController.findUserID);
router.post("/:userID", blockListController.blockUser);

module.exports = router;
