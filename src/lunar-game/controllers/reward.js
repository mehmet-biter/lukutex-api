const MembersModel = require('../../../models/Members');
const AccountsModel = require('../../../models/Accounts');

const LuckyHistoryModel = require('../models/LuckyHistory');
const LuckyAwardModel = require('../models/LuckyMoney');

exports.reward = async(req, res, next) => {
    try {
        const { uid, txid, lucky_id } = req.body;

        // Get member_id
        const member = await MembersModel.getMemberID(uid);
        if (!(member[0] && member[0][0])) throw Error('Incorrect UID');

        // Get lucky award
        const lucky_award = await LuckyAwardModel.getLuckyMoneyById(lucky_id);
        if (!lucky_award[0] && lucky_award[0][0]) throw Error('Incorrect Lucky ID');
        if (!lucky_award[0][0].quantity <= 0) throw Error('Out of quantity');

        // plus balance usdt
        await AccountsModel.plusBalance(member[0][0].member_id, 'usdt', lucky_award[0][0].award);

        // substract quantity
        await LuckyAwardModel.substractQuantity(lucky_id);

        // save lucky history
        const reward_data = new LuckyHistoryModel(
            uid,
            member[0][0].member_id,
            txid,
            lucky_award[0][0].award,
            new Date()
        );
        await reward_data.save();

        console.log(reward_data);
        res.status(401).json({
            msg: "Reward success",
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "Reward failed"
        });
    }


}