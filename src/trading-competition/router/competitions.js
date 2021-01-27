const express = require("express");
const router = express.Router();

const competitionsController = require("../controllers/competitions");

router.get("/fetch/all", competitionsController.fetchAllCompetitions);
// router.get("/fetch/ongoing", competitionsController.fetchOngoingCompetitions);
// router.get("/fetch/upcoming", competitionsController.fetchUpcomingCompetitions);
// router.get("/fetch/ended", competitionsController.fetchEndedCompetitions);

router.get("/fetch/competition_id=:competition_id", competitionsController.fetchCompetitionById);

module.exports = router;