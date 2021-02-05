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

    static getLuckyMoneyById(lucky_id) {
        return db.execute('SELECT * FROM lucky_money WHERE id = ?', [lucky_id]);
    }

    static substractQuantity(id) {
        return db.execute('UPDATE lucky_money SET remain = remain - 1 where id = ?', [id])
    }
}