const db = require('../../../database/fee_production');

module.exports = class EthFee {
    constructor(fee) {
        this.fee = fee;
    }

    static getFee() {
        return db.execute('SELECT fee FROM eth_fee WHERE id = 1');
    }
}