const DepositesModel = require('../../../models/Deposites');
const MembersModel = require('../../../models/Members');

const LuckyHistoryModel = require('../models/LuckyHistory');

const axios = require('axios');
const NP = require('number-precision');
NP.enableBoundaryChecking(false); // default param is true

const getPrice = async(base_currency) => {
    const COMPARE_BASE_API_URL = 'https://min-api.cryptocompare.com/data/price';
    const API_KEY = '25fc5392e29e67321a0bfb9ff465ea0671c5c3b741266b0e04dc79264efb9ee3';
    try {
        let quote_price = 0;
        const price = await axios.get(`${COMPARE_BASE_API_URL}?fsym=${base_currency}&tsyms=USD&api_key=${API_KEY}`);
        quote_price = price.data['USD'];
        return Promise.resolve(quote_price);
    } catch (error) {
        console.log(error);
        throw new Error('Can not get price of selected currency.');
    }
}

exports.fetchLuckyLots = async(req, res, next) => {
    const start_date = '2021-02-02';
    const end_date = '2021-02-05';
    const min_deposite = 30;

    const uid = req.params.uid;
    try {
        // do find member_id by uid
        const member = await MembersModel.getMemberID(uid);
        if (!(member[0] && member[0][0])) throw Error('Incorrect UID');
        const member_id = member[0][0].id;
        const deposites = await DepositesModel.fetchByMemberIdAndDate(member_id, start_date, end_date);
        const deposites_usd = await Promise.all(
            deposites[0].filter(async(deposite) => {
                const price = await getPrice(deposite.currency_id);
                const total_usd = NP.times(price, deposite.amount);
                if (total_usd >= min_deposite) return true;
                return false;
            })
        );

        const lk_history_user = await LuckyHistoryModel.fetchTxid(member_id);
        const number_join = lk_history_user[0].length;
        const existTxid = lk_history_user[0].map(lk => lk.txid);
        console.log(lk_history_user[0]);
        const deposites_txid = deposites_usd.map(des => {
            return {
                ...des,
                used: existTxid.includes(des.txid)
            }
        });

        res.status(200).json({
            msg: 'Fetch lots of user success',
            payload: [...deposites_txid],
            total_join: number_join
        });
    } catch (error) {
        res.status(401).json({
            msg: 'Fetch lots of user failed',
            payload: [],
            total_join: 0,
            error: JSON.stringify(error.message)
        });
    }
}