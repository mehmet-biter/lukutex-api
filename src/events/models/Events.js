const db = require('../../../database/info_production');

module.exports = class BuyHistory {
    constructor(
        name,
        description,
        image,
        link,
        created_at
    ) {
        this.name = name;
        this.description = description;
        this.image = image;
        this.link = link;
        this.created_at = created_at;
    }

    static fetch() {
        return db.execute('SELECT * FROM events');
    }
};