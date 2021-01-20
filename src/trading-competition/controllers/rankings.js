const axios = require('axios');
const NP = require('number-precision');
NP.enableBoundaryChecking(false);

const DepositesModel = require('../../../models/Deposites');

exports.fetchRankings = async(req, res, next) => {
    const deposites = await DepositesModel.fetchValidDepositeBetweenDate('2021-01-01', '2021-01-12');
    const depositeList = [...deposites[0]];
    const currencyList = depositeList.map(deposite => deposite.currency_id);

    // CURRENCY LIST (REMOVE DUPLCATE) TO GET PRICE FROM COMPARECRYPTO API
    const newCurrencyList = currencyList.reduce((acc, item) => {
        if (!acc.includes(item)) {
            acc.push(item);
        }
        return acc;
    }, []);
    const currenciesString = newCurrencyList.join(',');

    // GET PRICE FROM ABOVE CURRENCY LIST
    const priceOfCurrenciesData = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${currenciesString}`);
    const priceOfCurrencies = priceOfCurrenciesData.data;

    // DEPOSITES WITH TOTAL MERGE FROM AMOUNT OF CURRENCY * PRICE
    const depositeListWithTotal = depositeList.map(deposite => {
        const newDeposite = {
            member_id: deposite.member_id,
            total: NP.strip(NP.times(priceOfCurrencies[String(deposite.currency_id).toUpperCase()], deposite.amount))
        }
        return newDeposite;
    });

    // MERGE TOTAL THAT DUPLCATED MEMBER_ID 
    const mergedDeposite = [];
    depositeListWithTotal.forEach(deposite => {
        const index = mergedDeposite.findIndex(des => des.member_id === deposite.member_id);
        if (index === -1) {
            mergedDeposite.push(deposite);
        } else {
            mergedDeposite[index].total = NP.plus(mergedDeposite[index].total, deposite.total);
        }
    });
    const desSortedDeposites = mergedDeposite.sort((prev, next) => next.total - prev.total);

    res.status(200).json(desSortedDeposites);
}