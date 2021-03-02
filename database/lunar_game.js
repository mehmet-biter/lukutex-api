const mysql = require('mysql2');
const _ENV_CONFIG = require('../configs/env');

const MYSQL_ENV_NAME = "Lunar Game Production";
const MYSQL_ENV_DATABASE = "lunar_game";

const MYSQL_ENV_HOST = process.env.MYSQL_ENV_HOST || _ENV_CONFIG.MYSQL_ENV_HOST;
const MYSQL_ENV_USER = process.env.MYSQL_ENV_USERNAME || _ENV_CONFIG.MYSQL_ENV_USERNAME;
const MYSQL_ENV_PASSWORD = process.env.MYSQL_ENV_PASSWORD || _ENV_CONFIG.MYSQL_ENV_PASSWORD;
const pool = mysql.createPool({
    namedPlaceholders: MYSQL_ENV_NAME,
    host: MYSQL_ENV_HOST,
    database: MYSQL_ENV_DATABASE,
    user: MYSQL_ENV_USER,
    password: MYSQL_ENV_PASSWORD,
});

module.exports = pool.promise();