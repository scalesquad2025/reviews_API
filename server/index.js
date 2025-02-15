require('dotenv').config();
const express = require('express');
const path = require('path');
const auth = require('./middleware/authorization.js');
const axios = require('axios');
const db = require('./database/db.js');
const pgp = require('pg-promise')();

const app = express();

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());

// attach auth key to all routes
// app.use('/', auth);


// example
// app.get('/', async (req, res) => {
//   try {
//     const result = await db.query('SELECT * FROM users');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// });

app.get('/products', (req, res) => {
  // console.log('GETTING ALL PRODUCTS');
});

app.get('/products/:id', (req, res) => {
  // console.log('GETTING PRODUCT ID: ', req.params.id);
});

app.get('/products/:id/styles', (req, res) => {
  // console.log('GETTING STYLES: ', req.params.id);
});

app.get('/reviews/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send('ID required');
  try {
    const query = 'SELECT * FROM reviews WHERE product_id = $1';
    const response = await db.any(query, [id]);
    if (response.length === 0) return res.status(400).send('Reviews not found');
    res.status(200).send(response);
  } catch (err) {
    console.error(`Error getting reviews for product id: ${id}`, err);
    res.status(500).send(err);
  }
});

app.listen(3000, () => {
  console.log('currently listening on port 3000');
})