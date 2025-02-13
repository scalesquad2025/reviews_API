const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const pgp = require('pg-promise')();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD || '')
};

// const dbConfig = {
//   user: 'postgres',
//   host: 'localhost',
//   database: 'reviews_db',
//   password: '',
//   port: 5432
// };

const db = pgp(dbConfig);

db.connect()
  .then(obj => {
    console.log('Connected to DB as user:', obj.client.user);
    obj.done();
  })
  .catch(err => {
    console.error('CONNECTION ERROR:', err.message || err);
    process.exit(1);
  });

module.exports = db;


module.exports = db;
