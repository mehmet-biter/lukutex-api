const IEOListModel = require('../models/IEO');
const NP = require('number-precision');

exports.fetchActiveIEO = async(req, res, next) => {
    try {
        const ongoingList = await IEOListModel.fetchOngoingIEO();
        const upcomingList = await IEOListModel.fetchUpcomingIEO();
        const ongoingLists = ongoingList[0].map((list) => {
            return {
                ...list,
                type: 'ongoing',
                currency_available: list.currency_available.replace(/ /g, '').split(','),
                remains: NP.strip(list.remains).toFixed(0),
                total_ieo: NP.strip(list.total_ieo),
                price: NP.strip(list.price),
                min_buy: NP.strip(list.min_buy)
            }
        });
        const upcomingLists = upcomingList[0].map((list) => {
            return {
                ...list,
                type: 'upcoming',
                currency_available: list.currency_available.replace(/ /g, '').split(','),
                remains: NP.strip(list.remains).toFixed(0),
                total_ieo: NP.strip(list.total_ieo),
                price: NP.strip(list.price),
                min_buy: NP.strip(list.min_buy)
            }
        });
        const activeList = [...ongoingLists, ...upcomingLists];
        res.status(200).json({
            msg: "Fetch active ieo list successfully!",
            payload: activeList,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "Fetch active ieo list failed",
            payload: [],
            err: error,
        })
    }
};

exports.fetchUpcomingIEO = async(req, res, next) => {
    try {
        const upcomingList = await IEOListModel.fetchUpcomingIEO();
        const upcomingLists = upcomingList[0].map((list) => {
            return {
                ...list,
                type: 'upcoming',
                currency_available: list.currency_available.replace(/ /g, '').split(','),
                remains: NP.strip(list.remains).toFixed(0),
                total_ieo: NP.strip(list.total_ieo),
                price: NP.strip(list.price),
                min_buy: NP.strip(list.min_buy)
            }
        });
        res.status(200).json({
            msg: "Fetch upcoming ieo list successfully!",
            payload: upcomingLists,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "Fetch upcoming ieo list failed",
            payload: [],
            err: error,
        })
    }
};

exports.fetchOngoingIEO = async(req, res, next) => {
    try {
        const ongoingList = await IEOListModel.fetchOngoingIEO();
        const ongoingLists = ongoingList[0].map((list) => {
            return {
                ...list,
                type: 'ongoing',
                currency_available: list.currency_available.replace(/ /g, '').split(','),
                remains: NP.strip(list.remains).toFixed(0),
                total_ieo: NP.strip(list.total_ieo),
                price: NP.strip(list.price),
                min_buy: NP.strip(list.min_buy)
            }
        });
        res.status(200).json({
            msg: "Fetch ongoing ieo list successfully!",
            payload: ongoingLists,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "Fetch ongoing ieo list failed",
            payload: [],
            err: error,
        })
    }
};

exports.fetchEndedIEO = async(req, res, next) => {
    try {
        const endedList = await IEOListModel.fetchEndedIEO();
        const endedLists = endedList[0].map((list) => {
            return {
                ...list,
                type: 'ended',
                currency_available: list.currency_available.replace(/ /g, '').split(','),
                remains: NP.strip(list.remains).toFixed(0),
                total_ieo: NP.strip(list.total_ieo),
                price: NP.strip(list.price),
                min_buy: NP.strip(list.min_buy)
            }
        });
        res.status(200).json({
            msg: "Fetch ended ieo list successfully!",
            payload: endedLists,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "Fetch ended ieo list failed",
            payload: [],
            err: error,
        })
    }
};

exports.fetchByIEOID = async(req, res, next) => {
    try {
        const ieo_id = req.params.ieo_id;
        const ieo = await IEOListModel.fetchByIEOID(ieo_id);
        const startDate = new Date(ieo[0][0].start_date);
        const endDate = new Date(ieo[0][0].end_date);
        const now = new Date();
        let type;
        if (now < startDate) {
            type = 'upcoming';
        } else if (now > startDate && now < endDate) {
            type = 'ongoing'
        } else if (now > endDate) {
            type = 'ended';
        }
        const newbonus = ieo[0][0].bonus.replace(/ /g, '').split('&').map(b => {
            const bonusRange = b.split('=')[0];
            const bonusValue = b.split('=')[1];

            return {
                [bonusRange]: bonusValue
            };
        })
        const newIEO = {
            ...ieo[0][0],
            type: type,
            currency_available: ieo[0][0].currency_available.replace(/ /g, '').split(','),
            social: JSON.parse(ieo[0][0].social),
            bonus: newbonus,
            remains: NP.strip(ieo[0][0].remains).toFixed(0),
            total_ieo: NP.strip(ieo[0][0].total_ieo),
            price: NP.strip(ieo[0][0].price),
            min_buy: NP.strip(ieo[0][0].min_buy)
        }
        res.status(200).json({
            msg: "Fetch ieo by id successfully!",
            payload: newIEO,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "Fetch ieo by id failed",
            payload: undefined,
            err: error,
        })
    }
};