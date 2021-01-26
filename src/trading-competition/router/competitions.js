const express = require("express");
const router = express.Router();

const tradingCompetitionController = require("../controllers/competitions");

router.get("/fetch/active", tradingCompetitionController.fetchActiveCompetitions);
router.get("/fetch/upcoming", tradingCompetitionController.fetchUpcomingCompetitions);
router.get("/fetch/ended", tradingCompetitionController.fetchEndedCompetitions);
module.exports = router;