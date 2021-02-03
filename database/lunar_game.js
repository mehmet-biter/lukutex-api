const mysql = require('mysql2');

const MYSQL_ENV_NAME = "Lunar Game Production";
const MYSQL_ENV_HOST = process.env.DATABASE_HOST || '167.99.65.65';
const MYSQL_ENV_DATABASE = "lunar_game";
const MYSQL_ENV_USER = process.env.DATABASE_USERNAME || 'root';
const MYSQL_ENV_PASSWORD = process.env.DATABASE_PASSWORD || 'Quy1407@';

const pool = mysql.createPool({
    namedPlaceholders: MYSQL_ENV_NAME,
    host: MYSQL_ENV_HOST,
    database: MYSQL_ENV_DATABASE,
    user: MYSQL_ENV_USER,
    password: MYSQL_ENV_PASSWORD,
});

module.exports = pool.promise();