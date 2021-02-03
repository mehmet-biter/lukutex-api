const DepositesModel = require('../../../models/Deposites');

const getDepostiteByUid = async(uid) => {
    const start_date = '2021-02-02';
    const end_date = '2021-02-05';
    const deposites = await DepositesModel.fetchValidDepositeBetweenDate();
}

exports.fetchLuckyLots = async(req, res, next) => {

}