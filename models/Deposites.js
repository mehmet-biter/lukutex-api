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

    static fetchByMemberIdAndDate(member_id, start_date, end_date) {
        return db.execute(`
        SELECT 
            member_id, 
            currency_id,
            amount,
            completed_at
        FROM deposits
        WHERE
            member_id = ?
            aasm_state = 'collected' and
            completed_at BETWEEN ? and ?`, [member_id, start_date, end_date]);
    }
};