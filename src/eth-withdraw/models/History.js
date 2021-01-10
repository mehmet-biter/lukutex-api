const db = require("../../../database/fee_production");

module.exports = class SubstractHistory {
    constructor(
        member_id,
        eth_fee,
        type,
        balance,
        new_balance,
        created_at
    ) {
        this.member_id = member_id;
        this.eth_fee = eth_fee;
        this.type = type;
        this.balance = balance;
        this.new_balance = new_balance;
        this.created_at = created_at;
    }

    save() {
        return db.execute(
            "INSERT INTO history(member_id,eth_fee,type,balance,new_balance,created_at) Values(?, ?, ?, ?, ?, ?)", [
                this.member_id,
                this.eth_fee,
                this.type,
                this.balance,
                this.new_balance,
                this.created_at,
            ]
        );
    }
};