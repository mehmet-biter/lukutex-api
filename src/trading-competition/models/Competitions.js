const db = require('../../../database/trading-competition');

module.exports = class Competitions {
    constructor(
        competition_name,
        prize_id,
        start_date,
        end_date
    ) {
        this.competition_name = competition_name;
        this.prize_id = prize_id;
        this.start_date = start_date;
        this.end_date = end_date;

    }
};