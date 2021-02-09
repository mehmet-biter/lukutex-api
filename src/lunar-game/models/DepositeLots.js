const db = require('../../../database/lunar_game');

module.exports = class DepositeLots {
    constructor(
        deposite_id,
        member_id,
        currency_id,
        amount,
        txid,
        state,
        created_at
    ) {
        this.deposite_id = deposite_id;
        this.member_id = member_id;
        this.currency_id = currency_id;
        this.amount = amount;
        this.txid = txid;
        this.state = state;
        this.created_at = created_at;
    }

    save() {
        return db.execute(
            `
                INSERT INTO deposite_lots (deposite_id,member_id,currency_id,amount,txid,state,created_at)
                Values(?, ?, ?, ?, ?, ?, ?)
            `, [this.deposite_id, this.member_id, this.currency_id, this.amount, this.txid, this.state, this.created_at]
        )
    }

    static countMemberID(member_id) {
        return db.execute('SELECT count(id) as count FROM deposite_lots WHERE member_id = ?', [member_id]);
    }

    static getByTxid(txid) {
        return db.execute('SELECT id FROM deposite_lots WHERE txid = ?', [txid]);
    }

    static fetchByMemberID(member_id) {
        return db.execute('SELECT * FROM deposite_lots WHERE member_id = ?', [member_id]);
    }

    static updateState(txid) {
        return db.execute('UPDATE deposite_lots SET state = 1 WHERE txid = ?', [txid]);
    }

}