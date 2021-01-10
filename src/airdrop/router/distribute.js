const express = require("express");
const router = express.Router();

const distributeController = require("../controllers/distribute");

router.get("/airdrop_id=:airdrop_id", distributeController.distribute);
module.exports = router;
