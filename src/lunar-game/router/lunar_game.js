const express = require("express");
const router = express.Router();

const awardController = require("../controllers/award");
const luckyMoneyController = require('../controllers/lucky_money');
const luckyLotsController = require('../controllers/lucky_lots');

router.get("/award/get", awardController.getAward);
router.get("/luckymoney/fetch", luckyMoneyController.fetchLuckyMoney);
router.get("/luckylots/fetch", luckyLotsController.fetchLuckyLots);

module.exports = router;