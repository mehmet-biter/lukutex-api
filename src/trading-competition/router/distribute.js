const express = require("express");
const router = express.Router();

const distributeController = require("../controllers/distribute");

router.get("/competition_id=:competition_id", distributeController.distribute);
module.exports = router;