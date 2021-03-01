const db = require("../../../database/trade_competition");

module.exports = class Distribute {
    constructor(
        competition_id,
        uid,
        currency_id,
        bonus,
        distribute_at
    ) {
        this.competition_id = competition_id;
        this.uid = uid;
        this.currency_id = currency_id;
        this.bonus = bonus;
        this.distribute_at = distribute_at;
    }

    save() {
        return db.execute(
            "INSERT INTO distribute(competition_id, uid, currency_id, bonus, distribute_at) Values (?, ?, ?, ?, ?)", [
                this.competition_id,
                this.uid,
                this.currency_id,
                this.bonus,
                this.distribute_at,
            ]
        );
    }
};