const express = require("express");
const router = express.Router();

const tradingCompetitionController = require("../controllers/competitions");

router.get("/fetch", tradingCompetitionController.fetchCompetitions);

module.exports = router;