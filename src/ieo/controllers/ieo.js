const axios = require('axios');
const NP = require('number-precision');

// peatio
const AccountsModel = require('../../../models/Accounts');
const MembersModel = require('../../../models/Members');

// ieo
const IEOListModel = require('../models/IEO');
const BuyHistoryModel = require('../models/BuyHistory');

// ---------------------------BUY--------------------------------------------------
const fetchIEOInfo = async(ieoID) => {
    const ieo = await IEOListModel.fetchByIEOID(ieoID);
    const ieoInfo = ieo[0][0];
    if (ieoInfo) {
        return ieoInfo;
    } else {
        // Do something if not find ieo info
        throw new Error('Unexist ieo.');
    }
}

const getMemberIDByUid = async(uid) => {
    // Get Member ID by user_id
    const member = await MembersModel.getMemberID(uid);
    if (member[0].length) {
        const memberID = member[0][0].id;
        return memberID;
    } else {
        throw new Error('You don\'t have member id');
    }
}
const getBaseBalanceAccount = async(memberID, base_currency) => {
    // Get buy balance of user
    try {
        const baseBalanceAccount = await AccountsModel.getBalanceUserByCurrencyID(memberID, base_currency);
        if (baseBalanceAccount[0].length === 0) {
            const newAccount = new AccountsModel(memberID, base_currency, 0, 0, new Date(), new Date());
            await newAccount.save();
            return 0;
        } else {
            return Number(baseBalanceAccount[0][0].balance);
        }
    } catch (error) {
        // Do something if not have buy & purchase balance
        throw new Error(`You don\'t have ${String(base_currency).toUpperCase()} wallet. Please generate it before buying.`);
    }
}


const getQuoteBalanceAccount = async(memberID, quote_currency) => {
    // Get purchase balance of user
    const quoteBalanceAccount = await AccountsModel.getBalanceUserByCurrencyID(memberID, quote_currency);
    if (quoteBalanceAccount[0].length) {
        return Number(quoteBalanceAccount[0][0].balance);
    } else {
        // Do something if not have purchase balance
        throw new Error(`You don\'t have ${String(quote_currency).toUpperCase()} wallet. Please generate it before buying.`);
    }
}

const getPrice = async(fsym, tsyms, base_price) => {
    const COMPARE_BASE_API_URL = 'https://min-api.cryptocompare.com/data/price';
    const API_KEY = '25fc5392e29e67321a0bfb9ff465ea0671c5c3b741266b0e04dc79264efb9ee3';
    try {
        let quote_price = 0;
        switch (String(tsyms).toUpperCase()) {
            case 'KOBE':
                const kobePrice = await axios.get('https://www.lukutex.com/api/v2/peatio/public/markets/kobeusdt/tickers');
                quote_price = Number(kobePrice.data.ticker.last) || 0; // 1 KOBE = x usdt
                break;
            case 'ESC':
                const escPrice = await axios.get('https://wwww.lukutex.com/api/v2/peatio/public/markets/escusdt/tickers');
                quote_price = Number(escPrice.data.ticker.last) || 0;
                break;
            case 'SWP':
                const swpPrice = await axios.get('https://www.lukutex.com/api/v2/peatio/public/markets/swpusdt/tickers');
                quote_price = Number(swpPrice.data.ticker.last) || 0;
                break;
            default:
                const price = await axios.get(`${COMPARE_BASE_API_URL}?fsym=${fsym}&tsyms=${tsyms}&api_key=${API_KEY}`);
                quote_price = price.data[tsyms] || 0;
                break;
        }

        switch (String(tsyms).toUpperCase()) {
            case 'KOBE':
                return NP.divide(NP.divide(1, quote_price), NP.divide(1, base_price));
            case 'ESC':
                return NP.divide(NP.divide(1, quote_price), NP.divide(1, base_price));
            case 'SWP':
                return NP.divide(NP.divide(1, quote_price), NP.divide(1, base_price));
            default:
                return NP.divide(quote_price, NP.divide(1, base_price));
        }
        // base_price: 1 LKT = 0.025 USDT => 40LKT = 1 USDT
        // price: 1 KOBE = 0.002 USDT => 500 KOBE = 1 USDT
        // Calculator: 1 LKT = ?? KOBE => 1 LKT = 500/40 = 12.5 KOBE
    } catch (error) {
        console.log(error);
        throw new Error('Can not get price of selected currency.');
    }
}

const getBonus = (quantity, bonus) => {
    const arrayOfBonus = bonus.replace(/ /g, '').split('&');
    const bonusIndex = arrayOfBonus.findIndex((bonus) => {
        const bonusRange = bonus.split('=');
        const startPoint = Number(bonusRange[0].split('-')[0])
        const endPoint = Number(bonusRange[0].split('-')[1]);
        if (quantity >= startPoint && quantity <= endPoint) {
            return true;
        }
        return false;
    });
    const bonusValue = arrayOfBonus[bonusIndex].split('=')[1];
    return bonusIndex === -1 ? 0 : NP.times(quantity, bonusValue);
}

exports.buy = async(req, res, next) => {
    // Buy Info from client
    const buyInfo = req.body;
    const ieoID = buyInfo.ieo_id;
    const uid = buyInfo.uid;
    const quantity = Number(buyInfo.quantity);

    try {
        // Fetch ieo info from database
        const ieoInfo = await fetchIEOInfo(ieoID);
        const memberID = await getMemberIDByUid(uid);

        // Total Quantity User will recieve
        const bonusQuantity = getBonus(quantity, ieoInfo.bonus);
        const totalQuantity = quantity + bonusQuantity;

        // Base currency & Quote currency
        const base_currency = ieoInfo.currency_id;
        const quote_currency = buyInfo.quote_currency;

        // Check remains
        const remains = Number(ieoInfo.remains);
        if (remains < totalQuantity) throw new Error('Sorry. Out of tokens to ieo');

        // Check quote_currency in currency_available of ieo
        const currency_available = ieoInfo.currency_available.replace(/ /g, '').split(',');
        if (!currency_available.includes(quote_currency)) throw new Error('Selected Quote currency is not correct');

        // Buy & Purchase Balance Of User
        await getBaseBalanceAccount(memberID, base_currency);
        const purchaseBalance = await getQuoteBalanceAccount(memberID, quote_currency);

        const price = await getPrice('USD', String(quote_currency).toUpperCase(), ieoInfo.price);
        if (!(price && price > 0)) throw new Error('Can not get price of selected currency.');

        const totalPurchase = NP.times(price, quantity); // price of currency (CopmareCrypt) * quantity * defaultPrice on database

        if (!(purchaseBalance >= totalPurchase)) throw new Error(`You don\'t have enough ${String(quote_currency).toUpperCase()} balance to purchase.`);

        // Do substract balance purchase
        await AccountsModel.substractBalance(memberID, quote_currency, totalPurchase);
        // Do substract balance purchase
        await AccountsModel.plusBalance(memberID, base_currency, totalQuantity);
        // Do substract remain token of ieo
        await IEOListModel.updateTokenRemains(ieoID, totalQuantity);
        try {
            // Save to buy history
            const buyHistoryData = new BuyHistoryModel(
                ieoID,
                uid,
                memberID,
                totalQuantity,
                base_currency,
                totalPurchase,
                quote_currency,
                'success',
                new Date()
            );
            console.log(JSON.stringify(buyHistoryData));
            await buyHistoryData.save();
        } catch (error) {
            console.log(error);
            throw new Error('Buy failed');
        }

        res.status(200).json({
            msg: 'Buy success',
            success: true,
            ...buyInfo
        });

    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: 'Buy failed' })
    }
};



// ------------------------BUY HISTORY------------------------
exports.fetchBuyers = async(req, res, next) => {
    const ieoID = +req.params.ieo_id;
    const pageNumber = +req.params.page;
    const pageSize = +req.params.size;

    try {
        const buyers = await BuyHistoryModel.fetchBuyersPage(ieoID, pageNumber, pageSize)
        const total = await BuyHistoryModel.getBuyersTotal(ieoID);
        res.status(200).json({
            msg: "Fetch page successfully!",
            payload: buyers[0],
            total: total[0][0].total
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg: "Fetch page failed",
            payload: [],
            err: error,
        })
    }
}

exports.fetchBuy = async(req, res, next) => {
    const ieoID = +req.params.ieo_id;
    const pageNumber = +req.params.page;
    const pageSize = +req.params.size;
    const uid = req.params.uid;
    try {
        const buys = await BuyHistoryModel.fetchBuyPage(uid, ieoID, pageNumber, pageSize);
        const total = await BuyHistoryModel.getBuyTotal(uid, ieoID);
        res.status(200).json({
            msg: "Fetch page successfully!",
            payload: buys[0],
            total: total[0][0].total
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg: "Fetch page failed",
            payload: [],
            err: error,
        })
    }
}