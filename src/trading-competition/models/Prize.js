const db = require('../../../database/trading-competition');

module.exports = class Prize {
    constructor(
        rank,
        prize,
        currency,
        created_at
    ) {
        this.rank = rank;
        this.prize = prize;
        this.currency = currency;
        this.created_at = created_at;
    }

};