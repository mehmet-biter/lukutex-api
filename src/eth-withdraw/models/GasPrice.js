const db = require('../../../database/gas_production');

module.exports = class GasPrice {
    constructor(id, price) {
        this.id = id;
        this.price = price;
    }

    static fetchPriceByID(id) {
        return db.execute("SELECT price FROM gas_price WHERE id = ?", [id]);
    }
}