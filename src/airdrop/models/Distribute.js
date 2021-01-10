const db = require("../../../database/airdrop_production");

module.exports = class Distribute {
    constructor(
        airdrop_id,
        member_id,
        uid,
        currency_id,
        bonus,
        distribute_at
    ) {
        this.airdrop_id = airdrop_id;
        this.member_id = member_id;
        this.uid = uid;
        this.currency_id = currency_id;
        this.bonus = bonus;
        this.distribute_at = distribute_at;
    }

    save() {
        return db.execute(
            "INSERT INTO distribute(airdrop_id, member_id, uid, currency_id, bonus, distribute_at) Values (?, ?, ?, ?, ?, ?)", [
                this.airdrop_id,
                this.member_id,
                this.uid,
                this.currency_id,
                this.bonus,
                this.distribute_at,
            ]
        );
    }
};