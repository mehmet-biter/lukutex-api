const db = require("../../../database/airdrop_production");

module.exports = class Airdrop {
    constructor(
        airdrop_name,
        total_tokens,
        tokens_per_claim,
        remain_tokens,
        token_name,
        max_participants,
        start_date,
        end_date,
        deliver_date
    ) {
        this.airdrop_name = airdrop_name;
        this.total_tokens = total_tokens;
        this.tokens_per_claim = tokens_per_claim;
        this.remain_tokens = remain_tokens;
        this.token_name = token_name;
        this.max_participants = max_participants;
        this.start_date = start_date;
        this.end_date = end_date;
        this.deliver_date = deliver_date;
    }

    save() {
        return db.execute(
            `INSERT INTO Airdrop (
          airdrop_name,
          total_tokens,
          tokens_per_claim,
          remain_tokens,
          token_name,
          max_participants,
          start_date,
          end_date,
          deliver_date
        ) 
          Values(?, ? ,?, ?, ? ,?, ?, ? ,?)`, [
                this.airdrop_name,
                this.total_tokens,
                this.tokens_per_claim,
                this.remain_tokens,
                this.token_name,
                this.max_participants,
                this.start_date,
                this.end_date,
                this.deliver_date,
            ]
        );
    }

    static fetchAll() {
        return db.execute("SELECT * FROM Airdrop");
    }

    static fetchWaitingAirdrop(pageNumber, pageSize) {
        return db.execute(`SELECT * FROM Airdrop WHERE start_date > sysdate() ORDER BY airdrop_id DESC LIMIT ${pageNumber * pageSize}, ${pageSize}`);
    }

    static getWaitingTotal() {
        return db.execute("SELECT COUNT(airdrop_id) as 'total' FROM Airdrop WHERE start_date > sysdate()");
    }

    static fetchOpeningAirdrop(pageNumber, pageSize) {
        return db.execute(`SELECT * FROM Airdrop WHERE start_date < sysdate() and end_date > sysdate() ORDER BY airdrop_id DESC LIMIT ${pageNumber * pageSize}, ${pageSize}`);
    }

    static getOpeningTotal() {
        return db.execute("SELECT COUNT(airdrop_id) as 'total' FROM Airdrop WHERE start_date < sysdate() and end_date > sysdate()");
    }

    static fetchDelieveringAirdrop(pageNumber, pageSize) {
        return db.execute(`SELECT * FROM Airdrop WHERE end_date < sysdate() and deliver_date > sysdate() ORDER BY airdrop_id DESC LIMIT ${pageNumber * pageSize}, ${pageSize}`);
    }

    static getDeliveringTotal() {
        return db.execute("SELECT COUNT(airdrop_id) as 'total' FROM Airdrop WHERE end_date < sysdate() and deliver_date > sysdate()");
    }

    static fetchDeliveredAirdrop(pageNumber, pageSize) {
        return db.execute(`SELECT * FROM Airdrop WHERE deliver_date < sysdate() ORDER BY airdrop_id DESC LIMIT ${pageNumber * pageSize}, ${pageSize}`);
    }

    static getDeliveredTotal() {
        return db.execute("SELECT COUNT(airdrop_id) as 'total' FROM Airdrop WHERE deliver_date < sysdate()");
    }

    static findByAirdropId(airdrop_id) {
        return db.execute("SELECT * FROM Airdrop WHERE airdrop_id = ?", [airdrop_id]);
    }

    static updateRemainTokensAfterClaim(airdrop_id, tokens) {
        return db.execute("UPDATE Airdrop SET remain_tokens=remain_tokens - ? WHERE airdrop_id = ? AND remain_tokens >= ?", [tokens, airdrop_id, tokens]);
    }
};