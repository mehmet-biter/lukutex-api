const db = require('../../../database/ieo_production');

module.exports = class IEOList {
    constructor(
        description,
        image_link,
        currency_id,
        currency_available,
        total_ieo,
        remains,
        price,
        start_date,
        end_date,
        bonus,
        social
    ) {
        this.description = description;
        this.image_link = image_link;
        this.currency_id = currency_id;
        this.currency_available = currency_available;
        this.total_ieo = total_ieo;
        this.remains = remains;
        this.price = price;
        this.start_date = start_date;
        this.end_date = end_date;
        this.bonus = bonus;
        this.social = social;
    }

    static fetchUpcomingIEO() {
        return db.execute(`SELECT * FROM ieo_list WHERE start_date > sysdate() ORDER BY id DESC`);
    }

    static fetchOngoingIEO() {
        return db.execute(`SELECT * FROM ieo_list WHERE start_date < sysdate() and sysdate() < end_date ORDER BY id DESC`);
    }

    static fetchEndedIEO() {
        return db.execute(`SELECT * FROM ieo_list WHERE end_date < sysdate() ORDER BY id DESC`);
    }

    static fetchByIEOID(ieoID) {
        return db.execute(`SELECT * FROM ieo_list WHERE id = ?`, [ieoID]);
    }

    static updateTokenRemains(ieoID, amount) {
        return db.execute('UPDATE ieo_list SET remains = remains - ? WHERE id = ?', [amount, ieoID]);
    }

};