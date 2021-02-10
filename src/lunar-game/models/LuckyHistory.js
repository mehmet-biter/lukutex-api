const db = require('../../../database/lunar_game');

module.exports = class LuckyHistory {
    constructor(
        uid,
        member_id,
        txid,
        reward,
        created_at
    ) {
        this.uid = uid;
        this.member_id = member_id;
        this.txid = txid;
        this.reward = reward;
        this.created_at = created_at;
    }

    save() {
        return db.execute(
            `
                INSERT INTO lucky_history (uid, member_id, txid, reward, created_at)
                Values(?, ?, ?, ?, ?)
            `, [this.uid, this.member_id, this.txid, this.reward, this.created_at]
        )
    }

    static fetchTxid(member_id) {
        return db.execute('SELECT id, member_id, txid FROM lucky_history WHERE member_id = ?', [member_id]);
    }

    static fetchRewardByTxid(txid) {
        return db.execute('SELECT id, txid, reward FROM lucky_history WHERE txid = ?', [txid]);
    }

    static fetchHistoryByUid(uid) {
        return db.execute('SELECT id, txid FROM lucky_history WHERE uid = ?', [uid]);
    }

    static deleteAll() {
        return db.execute('DELETE FROM lucky_history');
    }

}