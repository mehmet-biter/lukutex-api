const express = require("express");
const router = express.Router();

const competitionsController = require("../controllers/competitions");

router.get("/fetch/all", competitionsController.fetchActiveCompetitions);
// router.get("/fetch/active", competitionsController.fetchActiveCompetitions);
router.get("/fetch/upcoming", competitionsController.fetchUpcomingCompetitions);
router.get("/fetch/ended", competitionsController.fetchEndedCompetitions);

module.exports = router;