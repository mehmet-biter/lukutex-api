const db = require('../database/peatio_production');

module.exports = class Accounts {
    constructor(
        member_id,
        currency_id,
        amount,
        fee,
        aasm_state,
        completed_at
    ) {
        this.member_id = member_id;
        this.currency_id = currency_id;
        this.amount = amount;
        this.fee = fee;
        this.aasm_state = aasm_state;
        this.completed_at = completed_at;
    }

    static fetchValidDepositeBetweenDate(start_date, end_date) {
        return db.execute('SELECT member_id FROM deposits WHERE completed_at BETWEEN ? and ?', [start_date, end_date]);
    }
};