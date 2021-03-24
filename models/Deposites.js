const db = require('../database/peatio_production');

module.exports = class Deposits {
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

    static fetch_all() {
        return db.execute("SELECT member_id, sum(amount) as total FROM deposits group by member_id");
    }

    static fetchByMemberIdAndDate(member_id, start_date, end_date) {
        return db.execute(`
        SELECT 
            member_id, 
            currency_id,
            amount,
            txid,
            completed_at
        FROM deposits
        WHERE
            member_id = ? and
            (currency_id = 'btc' or currency_id = 'eth' or currency_id = 'usdt') and
            aasm_state = 'collected' and
            completed_at BETWEEN ? and ?
        ORDER BY completed_at ASC LIMIT 3`, [member_id, start_date, end_date]);
    }
};