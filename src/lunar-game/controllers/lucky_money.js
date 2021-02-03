const LuckyMoneyModel = require('../models/LuckyMoney');

exports.fetchLuckyMoney = async(req, res, next) => {
    try {
        const lucky_money = await LuckyMoneyModel.fetchAllLuckyMoney();
        res.status(200).json({
            msg: 'Fetch all lucky money success',
            payload: lucky_money[0]
        })
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Fetch all lucky money failed',
            payload: []
        })
    }
}