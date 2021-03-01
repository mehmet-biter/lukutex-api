const AirdropModel = require("../models/Airdrop");
const ClaimModel = require("../models/Claim");
const DistributeModel = require("../models/Distribute");

const MembersModel = require("../../../models/Members");
const AccountsModel = require("../../../models/Accounts");
const DepositesModel = require("../../../models/Deposites");

const geoip = require('geoip-lite');

const filterDuplicate = (array) => {
    const duplicate = [];
    const arr = [];
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (arr.includes(element)) duplicate.push(element);
        else arr.push(element);

    }
    console.log(arr);
    return [...duplicate];
}

exports.distribute = async(req, res, next) => {
    const airdrop_id = +req.params.airdrop_id;
    console.log(+req.params.airdrop_id)
    try {
        const foundAirdrop = await AirdropModel.findByAirdropId(airdrop_id);
        const bonus = foundAirdrop[0][0].tokens_per_claim;
        const token = String(foundAirdrop[0][0].token_name).toLowerCase();
        const members = await AccountsModel.getAllMemberID(token);
        const existMembers = await members[0].map(member => member.member_id);
        console.log("Ready for distribute");
        let claims_with_ip = [];

        const claims = await ClaimModel.findByAirdropId(airdrop_id);

        console.log(existMembers.length, claims[0].length);
        for (let index = 0; index < claims[0].length; index++) {
            const claim = claims[0][index];
            const id = await MembersModel.getMemberID(claim.user_uid);
            const user_ip = claim.user_ip;
            const geo = geoip.lookup(user_ip);
            const country = geo ? geo.country : 'Unavailable';
            const isVN = country.toLowerCase() == 'vn';
            const member_id = id[0][0].id;

            const claim_data = {
                email: id[0][0] ? id[0][0].email : 'Unavailable',
                telegram: claim.telegram_username.replace('@', ''),
                ip: claim.user_ip,
                country: country,
                state: 'success',
                reason: ''
            };

            if (!isVN) {
                claim_data.state = 'fail';
                claim_data.reason += 'Error: User is not Vietnamese. ';
            }


            if (!existMembers.includes(member_id)) {
                claim_data.state = 'fail';
                claim_data.reason += 'Error: LKT wallet is not generated. ';
            }

            claims_with_ip.push(claim_data);

            if (isVN && existMembers.includes(member_id)) {
                await AccountsModel.updateBalance(member_id, token, bonus);
                const distribute = new DistributeModel(
                    airdrop_id,
                    member_id,
                    claim.user_uid,
                    token,
                    bonus,
                    new Date()
                );
                await distribute.save();
                await ClaimModel.updateSuccessClaimStatus(airdrop_id, claim.user_uid);
            }
        }

        res.status(200).json(claims_with_ip);
    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg: "Find airdrop by airdrop_id failed",
            payload: [],
            err: error,
        });
    }
};