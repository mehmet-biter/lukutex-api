const LuckyMoneyModel = require('../models/LuckyMoney');

exports.getAward = async(req, res, next) => {
    try {
        const awardsData = await LuckyMoneyModel.fetchAllLuckyMoney();
        const awards = awardsData[0];

        // Get 3 success award
        let success_award = [];
        let random_number = Math.floor(Math.random() * 3 + 0);
        const award = awards[random_number];
        if (award.quantity > 0) {
            success_award.push({
                lucky_id: awards[random_number].id,
                award: awards[random_number].award
            });
            awards[random_number].quantity -= 1;
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

        console.log(success_award, fail_award);

        // if (fail_award.length === 4) {
        //     res.status(200).json({
        //         msg: 'Random awards success',
        //         payload: fail_award
        //     });
        // } else {
        //     res.status(401).json({
        //         msg: 'Random awards fail',
        //         payload: []
        //     });
        // }
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Random awards fail',
            payload: []
        })
    }
}