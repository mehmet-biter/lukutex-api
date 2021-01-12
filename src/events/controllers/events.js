const EventsModel = require('../models/Events');

exports.getEventList = async(req, res, next) => {
    try {
        const events = await EventsModel.fetch();
        res.status(200).json({
            msg: 'Fetch event list successfully',
            events: events[0]
        });
    } catch (error) {
        res.status(401).json({
            msg: 'Fetch event list failed',
            events: []
        })
    }

}