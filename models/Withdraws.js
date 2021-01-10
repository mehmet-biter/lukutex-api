const db = require("../database/peatio_production");

module.exports = class Withdraws {
    constructor(
        id,
        member_id,
        beneficiary_id,
        currency_id,
        amount,
        fee,
        txid,
        aasm_state,
        block_number,
        sum,
        type,
        tid,
        rid,
        note,
        error,
        created_at,
        updated_at,
        completed_at
    ) {
        this.id = id;
        this.member_id = member_id;
        this.beneficiary_id = beneficiary_id;
        this.currency_id = currency_id;
        this.amount = amount;
        this.fee = fee;
        this.txid = txid;
        this.aasm_state = aasm_state;
        this.block_number = block_number;
        this.sum = sum;
        this.type = type;
        this.tid = tid;
        this.rid = rid;
        this.note = note;
        this.error = error;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.completed_at = completed_at;
    }

    static fetchByMemberIdAndCurrency(member_id, currency_id) {
        return db.execute(
            "SELECT id, member_id, currency_id, amount FROM withdraws WHERE member_id = ? and currency_id = ? and fee = 0", [member_id, currency_id]
        );
    }
};