const express = require("express");
const router = express.Router();

const ieoController = require("../controllers/ieo");
const fetchIEOController = require("../controllers/fetch_ieo");
const totalBuyersController = require("../controllers/total_buyer");

router.get("/fetch/active", fetchIEOController.fetchActiveIEO);
router.get("/fetch/upcoming", fetchIEOController.fetchUpcomingIEO);
router.get("/fetch/ongoing", fetchIEOController.fetchOngoingIEO);
router.get("/fetch/ended", fetchIEOController.fetchEndedIEO);
router.get("/fetch/ieo_id=:ieo_id", fetchIEOController.fetchByIEOID);
router.get("/total-buyers/ieo_id=:ieo_id", totalBuyersController.getTotalBuyers);
router.post("/buy", ieoController.buy);


router.get("/fetch/buyers/ieo_id=:ieo_id&page=:page&size=:size", ieoController.fetchBuyers);
router.get("/fetch/buy/uid=:uid/ieo_id=:ieo_id&page=:page&size=:size", ieoController.fetchBuy);

module.exports = router;