const db = require("../database/peatio_production");

module.exports = class Members {
    constructor(
        id,
        uid,
        email,
        level,
        role,
        group,
        state,
        created_at,
        updated_at
    ) {
        this.id = id;
        this.uid = uid;
        this.email = email;
        this.level = level;
        this.role = role;
        this.group = group;
        this.state = state;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static getMemberID(uid) {
        return db.execute("SELECT id FROM members WHERE uid = ?", [uid]);
    }

};