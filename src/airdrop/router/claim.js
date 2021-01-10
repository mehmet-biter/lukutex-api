const express = require("express");
const router = express.Router();

const claimController = require("../controllers/claim");

router.get("/fetch/all/airdrop_id=:airdrop_id", claimController.fetchAllClaim);
router.get("/fetch/airdrop_id=:airdrop_id&page=:page&size=:size", claimController.fetchPage);
router.get("/find/airdrop_id=:airdrop_id&facebook_id=:facebook_id", claimController.findFacebookID);
router.get("/find/airdrop_id=:airdrop_id&twitter_username=:twitter_username", claimController.findTwitterUsername);
router.get("/find/airdrop_id=:airdrop_id&telegram_username=:telegram_username", claimController.findTelegramUsername);
router.get("/find/airdrop_id=:airdrop_id&user_ip=:user_ip", claimController.findUserIP);
router.get("/getByAid/:id", claimController.findByAirdropId);
router.get("/getByUid/airdrop_id=:airdrop_id&user_uid=:user_uid", claimController.findByUserId);
router.post("/airdrop_id=:airdrop_id", claimController.claimAirdrop);

module.exports = router;