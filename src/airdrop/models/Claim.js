const db = require("../../../database/airdrop_production");

module.exports = class Claim {
    constructor(airdrop_id, user_uid, email, bonus, timer_claim, facebook_id, twitter_username, telegram_username, user_ip, claim_status) {
        this.airdrop_id = airdrop_id;
        this.user_uid = user_uid;
        this.email = email;
        this.bonus = bonus;
        this.timer_claim = timer_claim;
        this.facebook_id = facebook_id;
        this.twitter_username = twitter_username;
        this.telegram_username = telegram_username;
        this.user_ip = user_ip;
        this.claim_status = claim_status; // 0 - pending, 1 - success, 2 - fail
    }

    save() {
        return db.execute(
            `INSERT INTO Claim (airdrop_id, user_uid, email, bonus, timer_claim, facebook_id, twitter_username, telegram_username, user_ip, claim_status)
      Values(?, ? ,?, ?, ?, ?, ?, ?, ?, ?)`, [
                this.airdrop_id,
                this.user_uid,
                this.email,
                this.bonus,
                this.timer_claim,
                this.facebook_id,
                this.twitter_username,
                this.telegram_username,
                this.user_ip,
                this.claim_status
            ]
        );
    }

    static fetchAll(airdropID) {
        return db.execute("SELECT * FROM Claim WHERE airdrop_id = ?", [airdropID]);
    }

    static getTotal(airdropID) {
        return db.execute("SELECT COUNT(claim_id) as 'total' FROM Claim WHERE airdrop_id = ?", [airdropID]);
    }

    static fetchPage(airdropID, pageNumber, pageSize) {
        return db.execute(`SELECT claim_id, airdrop_id, user_uid, email, bonus, timer_claim, claim_status FROM Claim WHERE airdrop_id = ${airdropID} ORDER BY claim_id DESC LIMIT ${pageNumber * pageSize}, ${pageSize}`);
    }

    static findUserIP(airdropID, userIP) {
        return db.execute("SELECT user_uid, email FROM Claim WHERE airdrop_id = ? AND user_ip = ?", [airdropID, userIP]);
    }

    static findFacebookID(airdropID, facebookID) {
        return db.execute("SELECT * FROM Claim WHERE airdrop_id = ? AND facebook_id = ?", [airdropID, facebookID]);
    }

    static findTwitterUsername(airdropID, twitterUsername) {
        return db.execute("SELECT * FROM Claim WHERE airdrop_id = ? AND twitter_username = ?", [airdropID, twitterUsername]);
    }

    static findTelegramUsername(airdropID, telegramUsername) {
        return db.execute("SELECT * FROM Claim WHERE airdrop_id = ? AND telegram_username = ?", [airdropID, telegramUsername]);
    }

    static findByUserId(airdropID, user_uid) {
        return db.execute("SELECT * FROM Claim WHERE airdrop_id = ? AND user_uid = ?", [airdropID, user_uid]);
    }

    static findByAirdropId(airdrop_id) {
        return db.execute("SELECT * FROM Claim WHERE airdrop_id = ?", [airdrop_id]);
    }

    static updateSuccessClaimStatus(airdrop_id, user_uid) {
        return db.execute("UPDATE Claim SET claim_status = ? WHERE airdrop_id = ? and user_uid = ?", [1, airdrop_id, user_uid]);
    }
};