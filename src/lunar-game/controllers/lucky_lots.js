const MembersModel = require('../../../models/Members');

const DepositeLotsModel = require('../models/DepositeLots');

exports.fetchLuckyLots = async(req, res, next) => {

    const uid = req.params.uid;
    try {
        // do find member_id by uid
        const member = await MembersModel.getMemberID(uid);
        if (!(member[0] && member[0][0])) throw Error('Incorrect UID');
        const member_id = member[0][0].id;
        const deposite_lots = await DepositeLotsModel.fetchByMemberID(member_id);
        const deposites = deposite_lots[0].map(deposite => {
            const newDeposite = {
                txid: deposite.txid,
                currency_id: deposite.currency_id,
                amount: deposite.amount,
                used: deposite.state == 1 ? true : false
            }
            return newDeposite;
        });

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