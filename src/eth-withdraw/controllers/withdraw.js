const NP = require('number-precision');

// peatio
const AccountsModel = require("../../../models/Accounts");
const MembersModel = require("../../../models/Members");
const WithdrawsModel = require("../../../models/Withdraws");

// fee
const EthWithrawsModel = require("../models/EthWithdraws");
const HistoryModel = require("../models/History");
const FailedWithdrawsModel = require("../models/FailedWithdraws");
const CurrencyModel = require('../models/Currency');
const GasPriceModel = require("../models/GasPrice");

const DEFAULT_GAS_PRICE_TYPE = 3; // 1: low, 2: normal, 3: high
const GAS_NUMBER = 1000000000; // 10^9
const GAS_POINT = 0.01; // admin set number

exports.getFee = async(req, res, next) => {
    console.log("Get fee");
    try {
        const currencies = await CurrencyModel.fetch();
        const gasPrice = await GasPriceModel.fetchPriceByID(DEFAULT_GAS_PRICE_TYPE);

        if (!currencies[0]) throw Error("Can not fetch currencies");
        if (!gasPrice[0]) throw Error("Can not get gas price.");

        const gas_price = gasPrice[0][0].price;
        const fee_currencies = [...currencies[0]].map(currency => {
            const limit_price = NP.times(currency.gas_limit, gas_price);
            const divided = NP.divide(limit_price, GAS_NUMBER);
            const fee = NP.plus(divided, GAS_POINT);
            const new_currency = {
                currency_id: currency.currency_id,
                fee: fee
            };
            return new_currency;
        })

        res.status(200).json({
            msg: "Get ETH fee success",
            payload: fee_currencies
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg: "Get ETH fee failed",
            payload: null,
        });
    }
};

exports.withdrawEthFee = async(req, res, next) => {
    setTimeout(async() => {
        try {
            const withdrawData = req.body;
            const uid = withdrawData.uid;
            const currency = await CurrencyModel.fetchById(withdrawData.currency);
            if (!currency[0][0]) throw Error('Unavailable currency');

            // GET GAS PRICE
            const gasPrice = await GasPriceModel.fetchPriceByID(DEFAULT_GAS_PRICE_TYPE);
            if (!gasPrice[0]) throw Error("Can not get gas price.");
            const gas_price = gasPrice[0][0].price;

            const limit_price = NP.times(currency[0][0].gas_limit, gas_price);
            const divided = NP.divide(limit_price, GAS_NUMBER);
            const fee = NP.plus(divided, GAS_POINT);
            const withdrawEthFee = fee;
            const member = await MembersModel.getMemberID(uid);
            if (!member[0][0]) throw Error('Incorrect uid');
            const member_id = member[0][0].id;
            const balance = await AccountsModel.getBalanceUser(member_id); // lấy balance cũ của user trước khi trừ tiền
            if (!balance[0][0]) throw Error('Invalid balance');
            if (Number(balance[0][0].balance) < withdrawEthFee) throw { error: "Insufficient eth balance" };
            const substractData = new HistoryModel(
                member_id,
                withdrawEthFee,
                "-",
                NP.strip(balance[0][0].balance),
                NP.minus(Number(balance[0][0].balance), Number(withdrawEthFee)),
                new Date()
            );
            await substractData.save(); // lưu lịch sử trả tiền.

            await AccountsModel.substractEthBalance(
                member_id,
                Number(withdrawEthFee)
            ); // trừ balance eth của user

            const withdrawHistories = await WithdrawsModel.fetchByMemberIdAndCurrency(
                member_id,
                withdrawData.currency
            );
            for await (const withdrawHistory of withdrawHistories[0]) {
                const existEthWithdraw = await EthWithrawsModel.fetchByWithdrawMemberCurrencyID(
                    withdrawHistory.id,
                    withdrawHistory.member_id,
                    withdrawHistory.currency_id
                );
                if (existEthWithdraw[0].length === 0) {

                    const ethWithDraws = new EthWithrawsModel(
                        withdrawHistory.id,
                        member_id,
                        withdrawData.currency,
                        withdrawHistory.amount,
                        withdrawEthFee,
                        0,
                        new Date()
                    );
                    await ethWithDraws.save();
                }
            }
            res.status(200).json({
                msg: "Withdraw eth fee success",
            });
        } catch (error) {
            const withdrawData = req.body;
            const failedWithdrawData = new FailedWithdrawsModel(
                withdrawData.uid,
                0,
                withdrawData.currency,
                withdrawData.amount,
                JSON.stringify(error),
                new Date()
            );
            await failedWithdrawData.save();
            console.log(error);
            res.status(404).json({
                msg: "Withdraw failed",
            });
        }
    }, 5000);
};