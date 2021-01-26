const mysql = require('mysql2');

const MYSQL_ENV_NAME = "Peatio Production";
const MYSQL_ENV_HOST = process.env.DATABASE_HOST || '128.199.83.213';
const MYSQL_ENV_DATABASE = "peatio_production";
const MYSQL_ENV_USER = process.env.DATABASE_USERNAME || 'root';
const MYSQL_ENV_PASSWORD = process.env.DATABASE_PASSWORD || 'Quycon1209@';

const pool = mysql.createPool({
    namedPlaceholders: MYSQL_ENV_NAME,
    host: MYSQL_ENV_HOST,
    database: MYSQL_ENV_DATABASE,
    user: MYSQL_ENV_USER,
    password: MYSQL_ENV_PASSWORD,
});

module.exports = pool.promise();