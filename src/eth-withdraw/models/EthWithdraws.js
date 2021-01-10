const db = require("../../../database/fee_production");

module.exports = class EthWithdraws {
    constructor(
        withdraw_id,
        member_id,
        currency_id,
        amount,
        eth_fee,
        state,
        created_at
    ) {
        this.withdraw_id = withdraw_id;
        this.member_id = member_id;
        this.currency_id = currency_id;
        this.amount = amount;
        this.eth_fee = eth_fee;
        this.state = state;
        this.created_at = created_at;
    }



    save() {
        return db.execute("INSERT INTO eth_withdraws(withdraw_id,member_id,currency_id,amount,eth_fee,state,created_at) Values(?, ?, ?, ?, ?, ?, ?)", [this.withdraw_id, this.member_id, this.currency_id, this.amount, this.eth_fee, this.state, this.created_at]);
    }

    static fetchByWithdrawMemberCurrencyID(withdraw_id, member_id, currency_id) {
        return db.execute(
            "SELECT id, withdraw_id, member_id, currency_id FROM eth_withdraws WHERE withdraw_id = ? and member_id = ? and currency_id = ?", [withdraw_id, member_id, currency_id]
        );
    }

};