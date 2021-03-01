const DistributeModel = require("../models/Distribute");
const RanksModel = require('../models/Ranks');

const AccountsModel = require("../../../models/Accounts");

const competiton_prize = {
    competition_id: 1,
    prizes: [{
            rank: '1',
            award: [{
                bonus: 200,
                token: 'usdt'
            }, ]
        },
        {
            rank: '2',
            award: [{
                bonus: 75,
                token: 'usdt'
            }, ]
        },
        {
            rank: '3',
            award: [{
                bonus: 50,
                token: 'usdt'
            }, ]
        },
        {
            rank: '4',
            award: [{
                bonus: 25,
                token: 'usdt'
            }, ]
        },
        {
            rank: '5',
            award: [{
                bonus: 25,
                token: 'usdt'
            }, ]
        },
        {
            rank: '6',
            award: [{
                bonus: 25,
                token: 'usdt'
            }, ]
        },
        {
            rank: '7',
            award: [{
                bonus: 25,
                token: 'usdt'
            }, ]
        },
        {
            rank: '8',
            award: [{
                bonus: 25,
                token: 'usdt'
            }, ]
        },
        {
            rank: '9',
            award: [{
                bonus: 25,
                token: 'usdt'
            }, ]
        },
        {
            rank: '10',
            award: [{
                bonus: 25,
                token: 'usdt'
            }, ]
        }
    ]
};

exports.distribute = async(req, res, next) => {
    const competition_id = +req.params.competition_id;
    try {
        const success_distributes = [];
        console.log("Ready for distribute");
        const rankings = await RanksModel.fetchByCompetitionID(competition_id);
        for (let index = 0; index < rankings[0].length; index++) {
            const rank = rankings[0][index];
            const member_id = rank.member_id;
            console.log(rank.rank);
            const rank_prize = competiton_prize.prizes.find(competition => competition.rank == rank.rank);
            if (!rank_prize) {
                success_distributes.push({
                    competition_id: competition_id,
                    uid: rank.uid,
                    currency_id: null,
                    bonus: 0,
                    distribute_at: new Date(),
                    state: 'fail'
                });
            } else {
                const prizes = rank_prize.award;

                for (let prize_index = 0; prize_index < prizes.length; prize_index++) {
                    const prize = prizes[prize_index];
                    const members = await AccountsModel.getAllMemberID(prize.token);
                    const existMembers = await members[0].map(member => member.member_id);

                    const distribute = new DistributeModel(
                        competition_id,
                        rank.uid,
                        prize.token,
                        prize.bonus,
                        new Date()
                    );

                    if (existMembers.includes(member_id)) {
                        await AccountsModel.updateBalance(member_id, prize.token, prize.bonus);

                        success_distributes.push({...distribute, state: 'success' });
                        await distribute.save();
                    } else {
                        success_distributes.push({...distribute, state: 'fail' });
                    }

                }
            }

        }

        res.status(200).json(success_distributes);
    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg: "Find airdrop by airdrop_id failed",
            payload: [],
            err: error,
        });
    }
};