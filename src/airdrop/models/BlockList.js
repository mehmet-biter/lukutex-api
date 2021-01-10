const db = require("../../../database/airdrop_production");

module.exports = class BlockList {
    constructor(user_uid) {
        this.user_uid = user_uid;
    }
    save() {
        return db.execute(
            `INSERT INTO BlockList (user_uid)
      Values(?)`, [
                this.user_uid,
            ]
        );
    }

    static fetchAll() {
        return db.execute("SELECT * FROM BlockList");
    }

    static findUserID(userID) {
        return db.execute("SELECT block_id, user_uid FROM BlockList WHERE user_uid = ?", [userID]);
    }
}