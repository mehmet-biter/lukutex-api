const CompetitionsModel = require('../models/Competitions');

exports.fetchAllCompetitions = async(req, res, next) => {
    try {
        const ongoingCompetitions = await CompetitionsModel.fetchOngoingCompetitions();
        const upcomingCompetitions = await CompetitionsModel.fetchUpcomingCompetitions();
        const endedCompetitions = await CompetitionsModel.fetchEndedCompetitions();

        const newOngoingCompetitions = ongoingCompetitions[0].map(competition => {
            const newComp = {
                ...competition,
                market_ids: competition.market_ids.replace(/ /g, '').split(',')
            }
            return newComp;
        });

        const newUpcomingCompetitions = upcomingCompetitions[0].map(competition => {
            const newComp = {
                ...competition,
                market_ids: competition.market_ids.replace(/ /g, '').split(',')
            }
            return newComp;
        })

        const newEndedCompetitions = endedCompetitions[0].map(competition => {
            const newComp = {
                ...competition,
                market_ids: competition.market_ids.replace(/ /g, '').split(',')
            }
            return newComp;
        })

        res.status(200).json({
            msg: "Fetch all competitions successfully.",
            payload: {
                ongoing: newOngoingCompetitions,
                upcoming: newUpcomingCompetitions,
                ended: newEndedCompetitions
            }
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg: 'Fetch all competitions failed',
            payload: []
        })
    }
}

exports.fetchCompetitionById = async(req, res, next) => {
    const competition_id = req.params.competition_id;
    try {
        const competition = await CompetitionsModel.fetchCompetitionById(competition_id);

        const newCompetition = competition[0].map(competition => {
            const newComp = {
                ...competition,
                market_ids: competition.market_ids.replace(/ /g, '').split(',')
            }
            return newComp;
        })

        res.status(200).json(newCompetition[0])
    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg: 'Fetch competition with id failed'
        })
    }
}