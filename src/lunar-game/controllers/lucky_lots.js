const MembersModel = require('../../../models/Members');

const DepositeLotsModel = require('../models/DepositeLots');
const LuckyHistoryModel = require('../models/LuckyHistory');
exports.fetchLuckyLots = async(req, res, next) => {

    const uid = req.params.uid;
    try {
        // do find member_id by uid
        const member = await MembersModel.getMemberID(uid);
        if (!(member[0] && member[0][0])) throw Error('Incorrect UID');
        const member_id = member[0][0].id;
        const deposite_lots = await DepositeLotsModel.fetchByMemberID(member_id);
        const deposites = await Promise.all(
            deposite_lots[0].map(async(deposite) => {
                let newDeposite = {
                    txid: deposite.txid,
                    currency_id: deposite.currency_id,
                    amount: deposite.amount,
                }

                if (deposite.state == 1) {
                    const reward_data = await LuckyHistoryModel.fetchRewardByTxid(deposite.txid);
                    newDeposite = {
                        ...newDeposite,
                        used: deposite.state == 1 ? true : false,
                        reward: reward_data[0] && reward_data[0][0] ? Number(reward_data[0][0].reward) : 0
                    }
                }
                return newDeposite;
            })
        )

        res.status(200).json({
            msg: 'Fetch lots of user success',
            payload: [...deposites],
            error: null
        });
    } catch (error) {
        res.status(401).json({
            msg: 'Fetch lots of user failed',
            payload: [],
            error: JSON.stringify(error.message)
        });
    }
}