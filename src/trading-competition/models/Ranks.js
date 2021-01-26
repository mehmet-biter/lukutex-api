const db = require('../../../database/trade_competition');

module.exports = class Ranks {
    constructor(
        competition_id,
        uid,
        member_id,
        rank,
        volumn,
        created_at,
        updated_at
    ) {
        this.competition_id = competition_id;
        this.uid = uid;
        this.member_id = member_id;
        this.rank = rank;
        this.volumn = volumn;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static fetchMemberID(competition_id) {
        return db.execute('SELECT member_id FROM ranks WHERE competition_id = ?', [competition_id]);
    }

    static fetchRanks(competition_id, quantity) {
        return db.execute('SELECT * FROM ranks WHERE competition_id = ? LIMIT ? ORDER BY rank DESC', [competition_id, quantity]);
    }

    static updateRank(competition_id, member_id, rank) {
        return db.execute('UPDATE ranks SET rank = ?, updated_at = ? WHERE competition_id = ? and member_id = ?', [rank, new Date(), competition_id, member_id]);
    }

    save() {
        return db.execute(`
            INSERT INTO ranks (competition_id, uid, member_id, rank, volumn, created_at, updated_at)
            Values(?,?,?,?,?,?,?)
        `, [this.competition_id, this.uid, this.member_id, this.rank, this.volumn, this.created_at, this.updated_at]);
    }

}