const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const pgp = require('pg-promise')();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD || '')
};

const db = pgp(dbConfig);

module.exports = db;
