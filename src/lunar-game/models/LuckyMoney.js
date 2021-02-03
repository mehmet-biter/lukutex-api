const db = require('../../../database/lunar_game');

module.exports = class LuckyMoney {
    constructor(
        award,
        quantity,
        remain
    ) {
        this.award = award;
        this.quantity = quantity;
        this.remain = remain;
    }

    static fetchAllLuckyMoney() {
        return db.execute('SELECT * FROM lucky_money');
    }

}