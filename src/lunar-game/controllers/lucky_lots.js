const DepositesModel = require('../../../models/Deposites');

const axios = require('axios');
const NP = require('number-precision');

const getPrice = async(base_currency) => {
    const COMPARE_BASE_API_URL = 'https://min-api.cryptocompare.com/data/price';
    const API_KEY = '25fc5392e29e67321a0bfb9ff465ea0671c5c3b741266b0e04dc79264efb9ee3';
    try {
        let quote_price = 0;
        switch (String(base_currency).toUpperCase()) {
            case 'KOBE':
                const kobePrice = await axios.get('https://www.lukutex.com/api/v2/peatio/public/markets/kobeusdt/tickers');
                quote_price = Number(kobePrice.data.ticker.last); // 1 KOBE = x usdt
                break;
            case 'ESC':
                const escPrice = await axios.get('https://wwww.lukutex.com/api/v2/peatio/public/markets/escusdt/tickers');
                quote_price = Number(escPrice.data.ticker.last);
                break;
            case 'SWP':
                const swpPrice = await axios.get('https://www.lukutex.com/api/v2/peatio/public/markets/swpusdt/tickers');
                quote_price = Number(swpPrice.data.ticker.last);
                break;
            default:
                const price = await axios.get(`${COMPARE_BASE_API_URL}?fsym=${base_currency}&tsyms=USD&api_key=${API_KEY}`);
                quote_price = price.data['USD'];
                break;
        }
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
    const member_id = 12;
    const deposites = await DepositesModel.fetchByMemberIdAndDate(member_id, start_date, end_date);
    const deposites_usd = await Promise.all(
        deposites[0].map(async(deposite) => {
            const totalUsd = await getPrice(deposite.currency_id);
            const new_deposite = {
                ...deposite,
                total_usdt: NP.times(totalUsd, deposite.amount)
            }
            return new_deposite;
        })
    );
    const valid_deposites = deposites_usd.map(deposite => deposite.total_usdt >= min_deposite);

    console.log(deposites_usd);
}