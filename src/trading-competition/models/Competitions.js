const db = require('../../../database/trade_competition');

module.exports = class Competitions {
    constructor(
        currency_id,
        currency_image,
        total_prize,
        trade_list,
        next_update,
        start_date,
        end_date
    ) {
        this.currency_id = currency_id;
        this.currency_image = currency_image;
        this.total_prize = total_prize;
        this.trade_list = trade_list;
        this.next_update = next_update;
        this.start_date = start_date;
        this.end_date = end_date;
    }

    static fetchActiveCompetitions() {
        return db.execute("SELECT * FROM competitions WHERE sysdate() BETWEEN start_date and end_date");
    }

    static fetchUpcomingCompetitions() {
        return db.execute("SELECT * FROM competitions WHERE sysdate() < start_date");
    }
    static fetchEndedCompetitions() {
        return db.execute("SELECT * FROM competitions WHERE sysdate() > end_date");
    }

}