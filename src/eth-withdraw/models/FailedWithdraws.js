const db = require("../../../database/fee_production");

module.exports = class FailedWithdraws {
    constructor(
        uid,
        eth_fee,
        currency_id,
        amount,
        reason,
        created_at
    ) {
        this.uid = uid;
        this.currency_id = currency_id;
        this.amount = amount;
        this.eth_fee = eth_fee;
        this.reason = reason;
        this.created_at = created_at;
    }

    save() {
        return db.execute("INSERT INTO failed_withdraws(uid,eth_fee,currency_id,amount,reason,created_at) Values(?, ?, ?, ?, ?, ?)", [this.uid, this.eth_fee, this.currency_id, this.amount, this.reason, this.created_at]);
    }
};