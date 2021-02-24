const AirdropModel = require("../models/Airdrop");
const ClaimModel = require("../models/Claim");
const DistributeModel = require("../models/Distribute");

const MembersModel = require("../../../models/Members");
const AccountsModel = require("../../../models/Accounts");
const DepositesModel = require("../../../models/Deposites");

const geoip = require('geoip-lite');

exports.distribute = async(req, res, next) => {
    const airdrop_id = +req.params.airdrop_id;
    console.log(+req.params.airdrop_id)
    try {
        const foundAirdrop = await AirdropModel.findByAirdropId(airdrop_id);
        const bonus = foundAirdrop[0][0].tokens_per_claim;
        const token = String(foundAirdrop[0][0].token_name).toLowerCase();
        const members = await AccountsModel.getAllMemberID();
        const existMembers = await members[0].map(member => member.member_id);
        console.log("Ready for distribute");
        await ClaimModel.findByAirdropId(airdrop_id)
            .then(async(claims) => {
                for await (let claim of claims[0]) {
                    const id = await MembersModel.getMemberID(claim.user_uid);
                    const user_ip = claim.user_ip;
                    const geo = geoip.lookup(user_ip);
                    console.log(geo);
                    if (id[0][0]) {
                        const member_id = id[0][0].id;
                        console.log(member_id);
                        if (existMembers.includes(member_id)) {
                            // await AccountsModel.updateBalance(member_id, token, bonus);
                            const distribute = new DistributeModel(
                                airdrop_id,
                                member_id,
                                claim.user_uid,
                                token,
                                bonus,
                                new Date()
                            );
                            // await distribute.save();
                            // await ClaimModel.updateSuccessClaimStatus(airdrop_id, claim.user_uid);
                        }
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
        res.status(200).json({
            msg: "Distribute success",
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg: "Find airdrop by airdrop_id failed",
            payload: [],
            err: error,
        });
    }
};
