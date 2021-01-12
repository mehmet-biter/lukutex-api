const express = require("express");
const router = express.Router();

const eventsController = require("../controllers/events");

router.get("/fetch/active", eventsController.getEventList);

module.exports = router;