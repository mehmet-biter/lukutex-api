const express = require("express");
const router = express.Router();
const withdrawController = require('../controllers/withdraw');

router.post('', withdrawController.withdrawEthFee);
router.get('/get/eth_fee', withdrawController.getFee);

module.exports = router;
