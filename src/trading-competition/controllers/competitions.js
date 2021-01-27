const MarketsModel = require('../../../models/Markets');

const CompetitionsModel = require('../models/Competitions');

const covertMarketID = async(market_id) => {
    const units = await MarketsModel.getBaseAndQuoteUnit(market_id);
    return Promise.resolve(units[0][0].base_unit + '/' + units[0][0].quote_unit);
}

exports.fetchActiveCompetitions = async(req, res, next) => {
    try {
        const ongoingCompetitions = await CompetitionsModel.fetchActiveCompetitions();
        const upcomingCompetitions = await CompetitionsModel.fetchActiveCompetitions();
        const endedCompetitions = await CompetitionsModel.fetchActiveCompetitions();

        const mappedOngoingCompetitions = await Promise.all(ongoingCompetitions[0].map(async(competition) => {
            const marketIds = competition.market_ids.replace(/ /g, '').split('-');
            const convertedMarketIds = await Promise.all(marketIds.map(async(market_id) => {
                const newMarketID = await covertMarketID(market_id);
                return newMarketID;
            }));
            const newCompetition = {
                ...competition,
                market_ids: convertedMarketIds
            }
            return newCompetition;
        }));

        const mappedUpcomingCompetitions = await Promise.all(upcomingCompetitions[0].map(async(competition) => {
            const marketIds = competition.market_ids.replace(/ /g, '').split('-');
            const convertedMarketIds = await Promise.all(marketIds.map(async(market_id) => {
                const newMarketID = await covertMarketID(market_id);
                return newMarketID;
            }));
            const newCompetition = {
                ...competition,
                market_ids: convertedMarketIds
            }
            return newCompetition;
        }));

        const mappedEndedCompetitions = await Promise.all(endedCompetitions[0].map(async(competition) => {
            const marketIds = competition.market_ids.replace(/ /g, '').split('-');
            const convertedMarketIds = await Promise.all(marketIds.map(async(market_id) => {
                const newMarketID = await covertMarketID(market_id);
                return newMarketID;
            }));
            const newCompetition = {
                ...competition,
                market_ids: convertedMarketIds
            }
            return newCompetition;
        }));
        res.status(200).json({
            msg: "Fetch all competitions successfully.",
            payload: {
                ongoing: mappedOngoingCompetitions,
                upcoming: mappedUpcomingCompetitions,
                ended: mappedEndedCompetitions
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


exports.fetchActiveCompetitions = async(req, res, next) => {
    try {
        const activeCompetitions = await CompetitionsModel.fetchActiveCompetitions();

        const mappedActiveCompetitions = await Promise.all(activeCompetitions[0].map(async(competition) => {
            const marketIds = competition.market_ids.replace(/ /g, '').split('-');
            const convertedMarketIds = await Promise.all(marketIds.map(async(market_id) => {
                const newMarketID = await covertMarketID(market_id);
                return newMarketID;
            }));
            const newCompetition = {
                ...competition,
                market_ids: convertedMarketIds
            }
            return newCompetition;
        }));
        res.status(200).json({
            msg: "Fetch active competitions successfully.",
            payload: [...mappedActiveCompetitions]
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg: 'Fetch active competitions failed',
            payload: []
        })
    }
}

exports.fetchUpcomingCompetitions = async(req, res, next) => {
    try {
        const upcomingCompetitions = await CompetitionsModel.fetchActiveCompetitions();

        const mappedUpcomingCompetitions = await Promise.all(upcomingCompetitions[0].map(async(competition) => {
            const marketIds = competition.market_ids.replace(/ /g, '').split('-');
            const convertedMarketIds = await Promise.all(marketIds.map(async(market_id) => {
                const newMarketID = await covertMarketID(market_id);
                return newMarketID;
            }));
            const newCompetition = {
                ...competition,
                market_ids: convertedMarketIds
            }
            return newCompetition;
        }));
        res.status(200).json({
            msg: "Fetch upcoming competitions successfully.",
            payload: [...mappedUpcomingCompetitions]
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg: 'Fetch upcoming competitions failed',
            payload: []
        })
    }
}

exports.fetchEndedCompetitions = async(req, res, next) => {
    try {
        const endedCompetitions = await CompetitionsModel.fetchActiveCompetitions();

        const mappedEndedCompetitions = await Promise.all(endedCompetitions[0].map(async(competition) => {
            const marketIds = competition.market_ids.replace(/ /g, '').split('-');
            const convertedMarketIds = await Promise.all(marketIds.map(async(market_id) => {
                const newMarketID = await covertMarketID(market_id);
                return newMarketID;
            }));
            const newCompetition = {
                ...competition,
                market_ids: convertedMarketIds
            }
            return newCompetition;
        }));
        res.status(200).json({
            msg: "Fetch ended competitions successfully.",
            payload: [...mappedEndedCompetitions]
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg: 'Fetch ended competitions failed',
            payload: []
        })
    }
}