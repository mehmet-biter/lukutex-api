const express = require("express");
const router = express.Router();

const lunarGameController = require("../controllers/lunar-game");

router.get("/", lunarGameController.getAward);

module.exports = router;