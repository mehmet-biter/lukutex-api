const db = require('../../../database/ieo_production');

module.exports = class BuyHistory {
    constructor(
        ieo_id,
        uid,
        member_id,
        quantity,
        base_currency,
        total,
        quote_currency,
        status,
        created_at
    ) {
        this.ieo_id = ieo_id;
        this.uid = uid;
        this.member_id = member_id;
        this.quantity = quantity;
        this.base_currency = base_currency;
        this.total = total;
        this.quote_currency = quote_currency;
        this.status = status;
        this.created_at = created_at;
    }

    save() {
        return db.execute(`
            INSERT INTO buy_history (
                ieo_id,
                uid,
                member_id,
                quantity,
                base_currency,
                total,
                quote_currency,
                status,
                created_at
            )
            Values (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            this.ieo_id,
            this.uid,
            this.member_id,
            this.quantity,
            this.base_currency,
            this.total,
            this.quote_currency,
            this.status,
            this.created_at
        ]);
    }

    static getTotalBuyer(ieoID) {
        return db.execute("SELECT uid FROM buy_history WHERE ieo_id = ? GROUP BY uid", [ieoID]);
    }

    static fetchBuyersPage(ieoID, pageNumber, pageSize) {
        return db.execute(`SELECT id, uid, quantity, base_currency, total, quote_currency, status, created_at FROM buy_history 
        WHERE ieo_id = ? ORDER BY id DESC LIMIT ?, ?`, [ieoID, pageNumber * pageSize, pageSize]);
    }

    static getBuyersTotal(ieoID) {
        return db.execute("SELECT COUNT(ieo_id) as 'total' FROM buy_history WHERE ieo_id = ?", [ieoID]);
    }

    static fetchBuyPage(uid, ieoID, pageNumber, pageSize) {
        return db.execute(`SELECT id, uid, quantity, base_currency, total, quote_currency, status, created_at FROM buy_history 
        WHERE ieo_id = ? and uid = ? ORDER BY id DESC LIMIT ?, ?`, [ieoID, uid, pageNumber * pageSize, pageSize]);
    }

    static getBuyTotal(uid, ieoID) {
        return db.execute(`SELECT COUNT(ieo_id) as 'total' FROM buy_history WHERE ieo_id = ? and uid = ?`, [ieoID, uid]);
    }
};