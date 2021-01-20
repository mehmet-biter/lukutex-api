const express = require("express");
const router = express.Router();

const rankingsController = require("../controllers/rankings");

router.get("/fetch", rankingsController.fetchRankings);

module.exports = router;