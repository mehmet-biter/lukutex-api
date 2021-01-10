const mysql = require('mysql2');

const MYSQL_ENV_NAME = "Airdrop Production";
const MYSQL_ENV_HOST = process.env.DATABASE_HOST;
const MYSQL_ENV_DATABASE = "airdrop_production";
const MYSQL_ENV_USER = process.env.DATABASE_USERNAME;
const MYSQL_ENV_PASSWORD = process.env.DATABASE_PASSWORD;

const pool = mysql.createPool({
    namedPlaceholders: MYSQL_ENV_NAME,
    host: MYSQL_ENV_HOST,
    database: MYSQL_ENV_DATABASE,
    user: MYSQL_ENV_USER,
    password: MYSQL_ENV_PASSWORD,
});

module.exports = pool.promise();