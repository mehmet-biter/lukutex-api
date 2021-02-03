exports.getAward = async(req, res, next) => {
    try {
        const awards = [{
                id: 'LK1',
                award: '5$',
                quantity: 0
            },
            {
                id: 'LK2',
                award: '10$',
                quantity: 2
            },
            {
                id: 'LK3',
                award: '20$',
                quantity: 0
            },
            {
                id: 'LK4',
                award: '40$',
                quantity: 2
            }
        ];

        let random_award = [];
        for (let i = 0; i < 4; i++) {
            let random_number = Math.floor(Math.random() * 3 + 0);
            const award = awards[random_number];
            if (award.quantity > 0) {
                random_award.push({
                    lucky_id: awards[random_number].id,
                    award: awards[random_number].award
                });
                awards[random_number].quantity -= 1;
            }
        }

        const len = random_award.length;
        const len_need = 4 - len;
        if (len_need !== 0) {
            for (let j = 0; j < len_need; j++) {
                const fin_award_index = awards.findIndex(award => award.quantity > 0);
                console.log(fin_award_index);
                if (fin_award_index !== -1) {
                    random_award.push({
                        lucky_id: awards[fin_award_index].id,
                        award: awards[fin_award_index].award
                    });
                    awards[fin_award_index].quantity -= 1;
                }
            }
        }

        if (random_award.length === 4) {
            res.status(200).json({
                msg: 'Random awards success',
                payload: random_award
            });
        } else {
            res.status(401).json({
                msg: 'Random awards fail',
                payload: []
            });
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Random awards fail',
            payload: []
        })
    }
}