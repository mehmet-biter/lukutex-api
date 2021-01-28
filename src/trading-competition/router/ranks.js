const express = require("express");
const router = express.Router();

const ranksController = require("../controllers/ranks");

router.get("/fetch/competition_id=:competition_id", ranksController.fetchRanksByCompetitionId);
router.get("/fetchByUid/competition_id=:competition_id&uid=:uid", ranksController.fetchRanksByUid);

module.exports = router;