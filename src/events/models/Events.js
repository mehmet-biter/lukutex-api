const db = require('../../../database/info_production');

module.exports = class BuyHistory {
    constructor(
        event_name,
        description,
        image_link,
        ref_link,
        created_at
    ) {
        this.event_name = event_name;
        this.description = description;
        this.image_link = image_link;
        this.ref_link = ref_link;
        this.created_at = created_at;
    }

    static fetch() {
        return db.execute('SELECT * FROM events');
    }
};