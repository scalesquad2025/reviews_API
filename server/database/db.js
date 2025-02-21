const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const pgp = require('pg-promise')();

// const dbConfig = {
// user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   password: String(process.env.DB_PASSWORD || '')
//   port: process.env.DB_PORT,
// };

const dbConfig = {
  user: 'postgres',
  host: '34.222.11.57',
  database: 'reviews_db',
  password: String(process.env.DB_PASSWORD || ''),
  port: 5432,
};


const db = pgp(dbConfig);


// db.one('SELECT NOW()')
//   .then(data => console.log('Connected to DB:', data))
//   .catch(error => console.error('Error connecting:', error));

module.exports = db;
