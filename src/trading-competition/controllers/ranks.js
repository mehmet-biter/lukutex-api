const RanksModel = require('../models/Ranks');

exports.fetchRanksByCompetitionId = async(req, res, next) => {
    const competition_id = req.params.competition_id;
    try {
        const ranks = await RanksModel.fetchRanksByCompetitionID(competition_id, 20);
        res.status(200).json({
            msg: "Fetch ranks by competition id successfully.",
            payload: ranks[0]
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg: 'Fetch ranks by competition id failed',
            payload: [null]
        })
    }
}

exports.fetchRanksByUid = async(req, res, next) => {
    const competition_id = req.params.competition_id;
    const uid = req.params.uid;
    try {
        const ranks = await RanksModel.fetchRanksByUid(competition_id, uid);
        res.status(200).json({
            msg: "Fetch rank by competition and uid successfully.",
            payload: ranks[0][0]
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg: 'Fetch rank by uid failed',
            payload: [null]
        })
    }
}