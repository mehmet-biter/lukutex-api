const NP = require('number-precision');

// peatio
const AccountsModel = require("../../../models/Accounts");
const MembersModel = require("../../../models/Members");
const WithdrawsModel = require("../../../models/Withdraws");

// fee
const EthWithrawsModel = require("../models/EthWithdraws");
const EthFeeModel = require("../models/EthFee");
const HistoryModel = require("../models/History");
const FailedWithdrawsModel = require("../models/FailedWithdraws");

exports.withdrawEthFee = async(req, res, next) => {
    setTimeout(async() => {
        try {
            const withdrawData = req.body;
            const uid = withdrawData.uid;
            const ethFee = await EthFeeModel.getFee();
            const withdrawEthFee = NP.strip(ethFee[0][0].fee);
            const member = await MembersModel.getMemberID(uid);
            const member_id = member[0][0].id;
            if (member_id) {
                const balance = await AccountsModel.getBalanceUser(member_id); // lấy balance cũ của user trước khi trừ tiền
                if (Number(balance[0][0].balance) < withdrawEthFee) {
                    throw { error: "Insufficient eth balance" };
                } else {
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
                        Number(ethFee[0][0].fee)
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
                }
            }
            res.status(200).json({
                msg: "Withdraw eth fee success",
            });
        } catch (error) {
            const ethFee = await EthFeeModel.getFee();
            const withdrawData = req.body;
            const failedWithdrawData = new FailedWithdrawsModel(
                withdrawData.uid,
                NP.strip(ethFee[0][0].fee),
                withdrawData.currency,
                withdrawData.amount,
                JSON.stringify(error),
                new Date()
            );
            await failedWithdrawData.save();
            console.log(error);
            res.status(404).json({
                msg: "Withdraw eth fee failed",
            });
        }
    }, 5000);
};

exports.getFee = async(req, res, next) => {
    try {
        const fee = await EthFeeModel.getFee();
        res.status(200).json({
            msg: "Get ETH fee success",
            payload: {
                fee: NP.strip(fee[0][0].fee),
            },
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg: "Get ETH fee failed",
            payload: null,
        });
    }
};