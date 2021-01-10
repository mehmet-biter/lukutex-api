const axios = require('axios');
const NP = require('number-precision');

// peatio
const AccountsModel = require('../../../models/Accounts');
const MembersModel = require('../../../models/Members');

// ieo
const IEOListModel = require('../models/IEO');
const BuyHistoryModel = require('../models/BuyHistory');


exports.getTotalBuyers = async(req, res, next) => {
    const ieoID = req.params.ieo_id;
    try {
        const totalBuyers = await BuyHistoryModel.getTotalBuyer(ieoID);
        res.status(200).json({
            msg: "Get total buyers successfully",
            totalBuyers: totalBuyers[0].length,
        })
    } catch (error) {
        res.status(400).json({
            msg: "Get total buyers failed",
            totalBuyers: 0,
            err: error,
        })
    }
}

exports.fetchActiveIEO = async(req, res, next) => {
    try {
        const ongoingList = await IEOListModel.fetchOngoingIEO();
        const upcomingList = await IEOListModel.fetchUpcomingIEO();
        const ongoingLists = ongoingList[0].map((list) => {
            return {
                ...list,
                type: 'ongoing',
                currency_available: list.currency_available.replace(/ /g, '').split(','),
                remains: NP.strip(list.remains),
                total_ieo: NP.strip(list.total_ieo),
                price: NP.strip(list.price),
                min_buy: NP.strip(list.min_buy)
            }
        });
        const upcomingLists = upcomingList[0].map((list) => {
            return {
                ...list,
                type: 'upcoming',
                currency_available: list.currency_available.replace(/ /g, '').split(','),
                remains: NP.strip(list.remains),
                total_ieo: NP.strip(list.total_ieo),
                price: NP.strip(list.price),
                min_buy: NP.strip(list.min_buy)
            }
        });
        const activeList = [...ongoingLists, ...upcomingLists];
        res.status(200).json({
            msg: "Fetch active ieo list successfully!",
            payload: activeList,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "Fetch active ieo list failed",
            payload: [],
            err: error,
        })
    }
};

exports.fetchUpcomingIEO = async(req, res, next) => {
    try {
        const upcomingList = await IEOListModel.fetchUpcomingIEO();
        const upcomingLists = upcomingList[0].map((list) => {
            return {
                ...list,
                type: 'upcoming',
                currency_available: list.currency_available.replace(/ /g, '').split(','),
                remains: NP.strip(list.remains),
                total_ieo: NP.strip(list.total_ieo),
                price: NP.strip(list.price),
                min_buy: NP.strip(list.min_buy)
            }
        });
        res.status(200).json({
            msg: "Fetch upcoming ieo list successfully!",
            payload: upcomingLists,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "Fetch upcoming ieo list failed",
            payload: [],
            err: error,
        })
    }
};

exports.fetchOngoingIEO = async(req, res, next) => {
    try {
        const ongoingList = await IEOListModel.fetchOngoingIEO();
        const ongoingLists = ongoingList[0].map((list) => {
            return {
                ...list,
                type: 'ongoing',
                currency_available: list.currency_available.replace(/ /g, '').split(','),
                remains: NP.strip(list.remains),
                total_ieo: NP.strip(list.total_ieo),
                price: NP.strip(list.price),
                min_buy: NP.strip(list.min_buy)
            }
        });
        res.status(200).json({
            msg: "Fetch ongoing ieo list successfully!",
            payload: ongoingLists,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "Fetch ongoing ieo list failed",
            payload: [],
            err: error,
        })
    }
};

exports.fetchEndedIEO = async(req, res, next) => {
    try {
        const endedList = await IEOListModel.fetchEndedIEO();
        const endedLists = endedList[0].map((list) => {
            return {
                ...list,
                type: 'ended',
                currency_available: list.currency_available.replace(/ /g, '').split(','),
                remains: NP.strip(list.remains),
                total_ieo: NP.strip(list.total_ieo),
                price: NP.strip(list.price),
                min_buy: NP.strip(list.min_buy)
            }
        });
        res.status(200).json({
            msg: "Fetch ended ieo list successfully!",
            payload: endedLists,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "Fetch ended ieo list failed",
            payload: [],
            err: error,
        })
    }
};

exports.fetchByIEOID = async(req, res, next) => {
    try {
        const ieo_id = req.params.ieo_id;
        const ieo = await IEOListModel.fetchByIEOID(ieo_id);
        const startDate = new Date(ieo[0][0].start_date);
        const endDate = new Date(ieo[0][0].end_date);
        const now = new Date();
        let type;
        if (now < startDate) {
            type = 'upcoming';
        } else if (now > startDate && now < endDate) {
            type = 'ongoing'
        } else if (now > endDate) {
            type = 'ended';
        }
        const newbonus = ieo[0][0].bonus.replace(/ /g, '').split('&').map(b => {
            const bonusRange = b.split('=')[0];
            const bonusValue = b.split('=')[1];

            return {
                [bonusRange]: bonusValue
            };
        })
        const newIEO = {
            ...ieo[0][0],
            type: type,
            currency_available: ieo[0][0].currency_available.replace(/ /g, '').split(','),
            social: JSON.parse(ieo[0][0].social),
            bonus: newbonus,
            remains: NP.strip(ieo[0][0].remains),
            total_ieo: NP.strip(ieo[0][0].total_ieo),
            price: NP.strip(ieo[0][0].price),
            min_buy: NP.strip(ieo[0][0].min_buy)
        }
        res.status(200).json({
            msg: "Fetch ieo by id successfully!",
            payload: newIEO,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "Fetch ieo by id failed",
            payload: undefined,
            err: error,
        })
    }
};

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
    const baseBalanceAccount = await AccountsModel.getBalanceUserByCurrencyID(memberID, base_currency);
    if (baseBalanceAccount[0].length) {
        return Number(baseBalanceAccount[0][0].balance);
    } else {
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

const getPrice = async(fsym, tsyms) => {
    const COMPARE_BASE_API_URL = 'https://min-api.cryptocompare.com/data/price';
    const API_KEY = '25fc5392e29e67321a0bfb9ff465ea0671c5c3b741266b0e04dc79264efb9ee3';
    if (tsyms == 'KOBE') {
        try {
            const kobePrice = await axios.get('https://lukutex.com/api/v2/peatio/public/markets/kobeusdt/tickers');
            return Number(kobePrice.data.ticker.last);
        } catch (error) {
            console.log(error);
            throw new Error('Can not get price of selected currency.');
        }

    } else if (tsyms == 'ESC') {
        try {
            const escPrice = await axios.get('https://lukutex.com/api/v2/peatio/public/markets/escusdt/tickers');
            return Number(escPrice.data.ticker.last);
        } catch (error) {
            console.log(error);
            throw new Error('Can not get price of selected currency.');
        }

    } else {
        try {
            const price = await axios.get(`${COMPARE_BASE_API_URL}?fsym=${fsym}&tsyms=${tsyms}&api_key=${API_KEY}`);
            return price.data[tsyms];
        } catch (error) {
            throw new Error('Can not get price of selected currency.');
        }
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
        if (remains < totalQuantity) {
            throw new Error('Sorry. Out of tokens to ieo');
        }

        // Check quote_currency in currency_available of ieo
        const currency_available = ieoInfo.currency_available.replace(/ /g, '').split(',');
        if (!currency_available.includes(quote_currency)) {
            throw new Error('Selected Quote currency is not correct');
        }

        // Buy & Purchase Balance Of User
        await getBaseBalanceAccount(memberID, base_currency);
        const purchaseBalance = await getQuoteBalanceAccount(memberID, quote_currency);
        const price = await getPrice('USD', String(quote_currency).toUpperCase());
        const totalPurchase = NP.times(price, totalQuantity, ieoInfo.price); // price of currency (CopmareCrypt) * quantity * defaultPrice on database
        if (purchaseBalance >= totalPurchase) {
            try {
                await IEOListModel.updateTokenRemains(ieoID, totalQuantity);
            } catch (error) {
                console.log(error);
                throw new Error('Something is wrong.');
            }

            try {
                // Do substract balance purchase
                await AccountsModel.substractBalance(memberID, quote_currency, totalPurchase);
            } catch (error) {
                throw new Error('Can not substract your balance');
            }


            try {
                // Do substract balance purchase
                await AccountsModel.plusBalance(memberID, base_currency, totalQuantity);
            } catch (error) {
                console.log(error);

                throw new Error('Can not plus your balance');
            }
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

                throw new Error('Save buy history fail');
            }

            res.status(200).json({
                msg: 'Buy success',
                success: true,
                ...buyInfo
            });
        } else {
            // Do something if balance < fee
            throw new Error(`You don\'t have enough ${String(quote_currency).toUpperCase()} balance to purchase.`);
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message })
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