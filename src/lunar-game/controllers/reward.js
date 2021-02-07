const MembersModel = require('../../../models/Members');
const AccountsModel = require('../../../models/Accounts');

const LuckyHistoryModel = require('../models/LuckyHistory');
const LuckyAwardModel = require('../models/LuckyMoney');
const LuckyMoneyModel = require('../models/LuckyMoney');

const getAward = async() => {
    const awardsData = await LuckyMoneyModel.fetchAllLuckyMoney();
    const awards = awardsData[0];
    console.log(awards.map(award => award.remain));
    const remain_total = awards.map(award => award.remain).reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    }, 0);
    if (remain_total < 4) return Promise.reject({ message: 'Out of award' });

    // Get 3 success award
    let success_award = {};
    let random_number = Math.floor(Math.random() * 3 + 0);
    const award = awards[random_number];
    if (award.quantity > 0) {
        success_award = {
            lucky_id: awards[random_number].id,
            award: awards[random_number].award
        };
        awards[random_number].quantity -= 1;
    } else {
        const fin_award_index = awards.findIndex(award => award.quantity > 0);
        if (fin_award_index !== -1) {
            success_award = {
                lucky_id: awards[fin_award_index].id,
                award: awards[fin_award_index].award
            };
            awards[fin_award_index].quantity -= 1;
        }
    }

    // Get 3 fail award
    let fail_award = [];
    for (let i = 0; i < 3; i++) {
        let random_number = Math.floor(Math.random() * 3 + 0);
        const award = awards[random_number];
        if (award.quantity > 0) {
            fail_award.push({
                lucky_id: awards[random_number].id,
                award: awards[random_number].award
            });
            awards[random_number].quantity -= 1;
        }
    }

    const len = fail_award.length;
    const len_need = 3 - len;
    if (len_need !== 0) {
        for (let j = 0; j < len_need; j++) {
            const fin_award_index = awards.findIndex(award => award.quantity > 0);
            if (fin_award_index !== -1) {
                fail_award.push({
                    lucky_id: awards[fin_award_index].id,
                    award: awards[fin_award_index].award
                });
                awards[fin_award_index].quantity -= 1;
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
        if (user_rewards[0].length >= 3) throw Error('User has only 3 reward');

        const txids = user_rewards[0].map(reward => reward.txid);
        if ([...txids].includes(txid)) throw Error('This txid used.');

        const awards = await getAward();
        if (awards.success_award.lucky_id === undefined || awards.fail_award.length < 3) throw Error('Out of award');

        // plus balance usdt
        await AccountsModel.plusBalance(member[0][0].id, 'usdt', awards.success_award.award);

        // substract quantity
        await LuckyAwardModel.substractQuantity(awards.success_award.lucky_id);

        // save lucky history
        const reward_data = new LuckyHistoryModel(
            uid,
            member[0][0].id,
            txid,
            awards.success_award.award,
            new Date()
        );
        await reward_data.save();

        // console.log(reward_data);
        res.status(401).json({
            msg: "Reward success",
            success_award: awards.success_award,
            fail_award: awards.fail_award
        });
    } catch (error) {
        console.log(error);
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