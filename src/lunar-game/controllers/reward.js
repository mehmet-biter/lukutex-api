const MembersModel = require('../../../models/Members');
const AccountsModel = require('../../../models/Accounts');

const LuckyHistoryModel = require('../models/LuckyHistory');
const LuckyAwardModel = require('../models/LuckyMoney');
const LuckyMoneyModel = require('../models/LuckyMoney');
const DepositeLotsModel = require('../models/DepositeLots');

const randomWithPercentage = () => {
    let d = Math.random() * 100;
    if ((d -= 50) < 0) return 0;
    if ((d -= 30) < 0) return 1;
    if ((d -= 15) < 0) return 2;
    return 3;
}

const getAward = async() => {
    const awardsData = await LuckyMoneyModel.fetchAllLuckyMoney();
    const awards = awardsData[0];
    const remain_total = awards.map(award => award.remain).reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    }, 0);
    if (remain_total < 4) return Promise.reject({ message: 'Out of award' });

    // Get 3 success award
    let success_award = {};
    let success_random_number = randomWithPercentage();
    const award = awards[success_random_number];
    if (award.remain > 0) {
        success_award = {
            lucky_id: awards[success_random_number].id,
            award: awards[success_random_number].award
        };
        console.log(success_award);
        awards[success_random_number].remain -= 1;
    } else {
        const fin_award_index = awards.findIndex(award => award.remain > 0);
        if (fin_award_index !== -1) {
            success_award = {
                lucky_id: awards[fin_award_index].id,
                award: awards[fin_award_index].award
            };
            awards[fin_award_index].remain -= 1;
        }
    }

    // Get 3 fail award
    let fail_award = [];
    for (let i = 0; i < 3; i++) {
        let fail_random_number = 3 - i;
        const award = awards[fail_random_number];
        if (award.remain > 0) {
            fail_award.push({
                lucky_id: awards[fail_random_number].id,
                award: awards[fail_random_number].award
            });
            awards[fail_random_number].remain -= 1;
        }
    }

    const len = fail_award.length;
    const len_need = 3 - len;
    if (len_need !== 0) {
        for (let j = 0; j < len_need; j++) {
            const fin_award_index = awards.findIndex(award => award.remain > 0);
            if (fin_award_index !== -1) {
                fail_award.push({
                    lucky_id: awards[fin_award_index].id,
                    award: awards[fin_award_index].award
                });
                awards[fin_award_index].remain -= 1;
            }
        }
    }

    return Promise.resolve({
        success_award: {...success_award },
        fail_award: [...fail_award]
    });
}


exports.reward = async(req, res, next) => {
    try {
        const { uid, txid } = req.params;

        // Get member_id
        const member = await MembersModel.getMemberID(uid);
        if (!(member[0] && member[0][0])) throw Error('Incorrect UID');

        // Fetch history of user
        const user_rewards = await LuckyHistoryModel.fetchHistoryByUid(uid);
        if (user_rewards[0].length >= 3) throw Error(uid + ' has only 3 reward');

        const txids = user_rewards[0].map(reward => reward.txid);
        if ([...txids].includes(txid)) throw Error(uid + ' This txid used.');

        const awards = await getAward();
        if (awards.success_award.lucky_id === undefined || awards.fail_award.length < 3) throw Error('Out of award');

        const balance = await AccountsModel.getBalanceUserByCurrencyID(member[0][0].id, 'usdt');
        if (!(balance[0] && balance[0][0])) throw Error(uid + ' not have usdt balance');

        // substract quantity
        await LuckyAwardModel.substractQuantity(awards.success_award.lucky_id);

        // plus balance usdt
        await AccountsModel.plusBalance(member[0][0].id, 'usdt', awards.success_award.award);

        // save lucky history
        const reward_data = new LuckyHistoryModel(
            uid,
            member[0][0].id,
            txid,
            awards.success_award.award,
            new Date()
        );
        await reward_data.save();

        await DepositeLotsModel.updateState(txid);

        res.status(200).json({
            msg: "Reward success",
            success_award: awards.success_award,
            fail_award: awards.fail_award
        });
    } catch (error) {
        console.log(error.message);
        res.status(401).json({
            msg: "Reward failed",
            success_award: {},
            fail_award: [],
            error: error.message
        });
    }


}

exports.deleteAllHistory = async(req, res, next) => {
    try {
        await LuckyHistoryModel.deleteAll();
        res.status(200).json({
            msg: 'Delete all success'
        })
    } catch (error) {
        res.status(401).json({
            msg: 'Delete all failed'
        })
    }
}