const ClaimModel = require("../models/Claim");
const AirdropModel = require("../models/Airdrop");

exports.fetchAllClaim = async(req, res, next) => {
    const airdropID = +req.params.airdrop_id;
    try {
        const claims = await ClaimModel.fetchAll(airdropID);
        res.status(200).json({
            msg: "Fetch all claims successfully!",
            payload: claims[0],
        })
    } catch (error) {
        res.status(404).json({
            msg: "Fetch all claims failed",
            payload: [],
            err: error,
        })
    }
};

exports.fetchPage = async(req, res, next) => {
    const airdropID = +req.params.airdrop_id;
    const pageNumber = +req.params.page;
    const pageSize = +req.params.size;
    try {
        const claims = await ClaimModel.fetchPage(airdropID, pageNumber, pageSize)
        const total = await ClaimModel.getTotal(airdropID);
        res.status(200).json({
            msg: "Fetch page successfully!",
            payload: claims[0],
            total: total[0][0].total
        })
    } catch (error) {
        res.status(404).json({
            msg: "Fetch page failed",
            payload: [],
            err: error,
        })
    }
};

exports.findFacebookID = async(req, res, next) => {
    const airdropID = +req.params.airdrop_id;
    const facebookID = req.params.facebook_id;
    try {
        const claims = await ClaimModel.findFacebookID(airdropID, facebookID);
        res.status(200).json({
            msg: "Find facebook ids successfully!",
            payload: claims[0],
        })
    } catch (error) {
        res.status(404).json({
            msg: "Find facebook ids failed",
            payload: [],
            err: error,
        })
    }
};

exports.findTwitterUsername = async(req, res, next) => {
    const airdropID = +req.params.airdrop_id;
    const twitterUsername = req.params.twitter_username;
    try {
        const claims = await ClaimModel.findTwitterUsername(airdropID, twitterUsername);
        res.status(200).json({
            msg: "Find twitter username successfully!",
            payload: claims[0],
        })
    } catch (error) {
        res.status(404).json({
            msg: "Find twitter username failed",
            payload: [],
            err: error,
        });
    }
};

exports.findTelegramUsername = async(req, res, next) => {
    const airdropID = +req.params.airdrop_id;
    const telegramUsername = req.params.telegram_username;
    try {
        const claims = await ClaimModel.findTelegramUsername(airdropID, telegramUsername);
        res.status(200).json({
            msg: "Find telegram usernames successfully!",
            payload: claims[0],
        })
    } catch (error) {
        res.status(404).json({
            msg: "Find telegram usernames failed",
            err: error,
        })
    }
};

exports.findUserIP = async(req, res, next) => {
    const airdropID = +req.params.airdrop_id;
    const userIP = req.params.user_ip;
    try {
        const claims = await ClaimModel.findUserIP(airdropID, userIP);
        res.status(200).json({
            msg: "Find user ip successfully!",
            payload: claims[0],
        });
    } catch (error) {
        res.status(404).json({
            msg: "Find user ips failed",
            payload: [],
            err: error,
        });
    }
};

exports.claimAirdrop = async(req, res, next) => {
    const claimData = req.body;
    const airdropId = +req.params.airdrop_id;
    try {
        const airdrop = await AirdropModel.findByAirdropId(airdropId);
        if (airdrop[0][0].remain_tokens > 0) {
            try {
                const existClaim = await ClaimModel.findByUserId(airdropId, claimData.user_uid);
                if (existClaim[0].length > 0)
                    res.status(200).json({
                        msg: 'exist_user_uid',
                        payload: [],
                    });
                else {
                    try {
                        const claim = new ClaimModel(
                            airdropId,
                            claimData.user_uid,
                            claimData.email_user,
                            airdrop[0][0].tokens_per_claim, // bonus
                            new Date(), // timer_claim
                            claimData.facebook_id,
                            claimData.twitter_username,
                            claimData.telegram_username,
                            claimData.user_ip,
                            0, // claim_status = 0 : default -> pending
                        );
                        await AirdropModel.updateRemainTokensAfterClaim(airdropId, airdrop[0][0].tokens_per_claim);
                        await claim.save();
                        res.status(200).json({
                            msg: "claim_success",
                            payload: [],
                        });
                    } catch (error) {
                        res.status(404).json({
                            msg: "claim_failed",
                            payload: [],
                            err: error
                        });
                    }
                }
            } catch (error) {
                res.status(404).json({
                    msg: "Find exist claim failed",
                    payload: [],
                    err: error,
                });
            }
        } else {
            res.status(200).json({
                msg: 'out_of_tokens',
                payload: [],
            });
        }
    } catch (error) {
        res.status(404).json({
            msg: "claim_failed",
            payload: [],
            err: error
        });
    }
};

exports.findByAirdropId = async(req, res, next) => {
    const airdropId = req.params.id;
    try {
        const claim = await ClaimModel.findByAirdropId(airdropId)
        res.status(200).json({
            msg: "Find by airdrop id successfully!",
            payload: claim[0],
        });
    } catch (error) {
        res.status(404).json({
            msg: "Find airdrop by airdrop_id failed",
            payload: [],
            err: error,
        });
    }
};

exports.findByUserId = async(req, res, next) => {
    const airdropID = +req.params.airdrop_id;
    const userId = req.params.user_uid;
    try {
        const claim = await ClaimModel.findByUserId(airdropID, userId);
        res.status(200).json({
            msg: "Find by user id successfully!",
            payload: claim[0]
        });
    } catch (error) {
        res.status(404).json({
            msg: "Find airdrop by user id failed",
            payload: [],
            err: error,
        });
    }
};