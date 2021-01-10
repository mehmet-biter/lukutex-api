const express = require("express");
const router = express.Router();

const airdropController = require("../controllers/airdrop");

router.get("/fetch", airdropController.fetchAllAirdrop);
router.get("/fetch/waiting/page=:page&size=:size", airdropController.fetchWaitingAirdriop);
router.get("/fetch/opening/page=:page&size=:size", airdropController.fetchOpeningAirdriop);
router.get("/fetch/delivering/page=:page&size=:size", airdropController.fetchDeliveringAirdriop);
router.get("/fetch/delivered/page=:page&size=:size", airdropController.fetchDeliveredAirdriop);
router.get("/fetch/:id", airdropController.fetchAirdropById);
router.post("/create", airdropController.createAirdrop);

module.exports = router;
