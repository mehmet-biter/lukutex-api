const db = require("../database/peatio_production");

module.exports = class Trades {
    constructor(
        base_unit,
        quote_unit
    ) {
        this.base_unit = base_unit;
        this.quote_unit = quote_unit;
    }

    static getBaseAndQuoteUnit(id) {
        return db.execute('SELECT id, base_unit, quote_unit FROM markets WHERE id = ?', [id]);
    }

};