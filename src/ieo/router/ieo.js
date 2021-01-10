const express = require("express");
const router = express.Router();

const ieoController = require("../controllers/ieo");

router.get("/fetch/active", ieoController.fetchActiveIEO);
router.get("/fetch/upcoming", ieoController.fetchUpcomingIEO);
router.get("/fetch/ongoing", ieoController.fetchOngoingIEO);
router.get("/fetch/ended", ieoController.fetchEndedIEO);
router.get("/fetch/ieo_id=:ieo_id", ieoController.fetchByIEOID);
router.get("/total-buyers/ieo_id=:ieo_id", ieoController.getTotalBuyers);
router.post("/buy", ieoController.buy);


router.get("/fetch/buyers/ieo_id=:ieo_id&page=:page&size=:size", ieoController.fetchBuyers);
router.get("/fetch/buy/uid=:uid/ieo_id=:ieo_id&page=:page&size=:size", ieoController.fetchBuy);

module.exports = router;