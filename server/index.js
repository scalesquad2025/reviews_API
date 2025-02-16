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
// app.use('/api', auth);

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
    // const page = parseInt(req.query.page) || 1;
    // const count = parseInt(req.query.count) || 5;
    // const offset = (page - 1) * count;

    const query = `SELECT
    id as review_id,
    rating,
    summary,
    recommend,
    response,
    body,
    date,
    reviewer_name,
    helpfulness
    FROM reviews WHERE product_id = $1`;

    const reviewRes = await db.any(query, [id]);
    const reviewsIds = reviewRes.map(review => review.review_id);

    const photosQuery = `SELECT
    id,
    review_id,
    url
    FROM review_photos
    WHERE review_id = ANY($1)
    `
    const photosRes = await db.any(photosQuery, [reviewsIds]);
    const response = reviewRes.map(review => {
      return {
        ...review,
        photos: photosRes
          .filter(photo => (photo.review_id === review.review_id))
          .map(element => ({
            id: element.id,
            url: element.url
          }))
      }
    })

    if (!reviewRes.length) return res.status(400).send('Reviews not found');
    res.status(200).json({
      product: id,
      results: response
    });
  } catch (err) {
    console.error(`Error getting reviews for product id: ${id}`, err);
    res.status(500).send(err);
  }
});


app.get('/reviews/meta/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send('ID required');
  try {
    const reviewQuery = `SELECT
     rating,
     recommend
     FROM reviews
     WHERE product_id = $1`;
    const reviewRes = await db.any(reviewQuery, [id]);

    const characQuery = `SELECT
    id,
    name
    FROM characteristics
    WHERE product_id = $1`

    const characRes = await db.any(characQuery, [id]);

    const characIds = characRes.map(char => char.id);
    const reviewCharacQuery = `SELECT
    id,
    value
    FROM review_characteristics
    WHERE characteristic_id = ANY($1)`

    const reviewCharacRes = await db.any(reviewCharacQuery, [characIds]);

    console.log('REVCHAR', reviewCharacRes);
    console.log('CHAR', characRes);



    const charchar = {};

    for (let char of characRes) {
      const matches = reviewCharacRes.filter(revChar => revChar.characteristic_id === char.id);

      const average = matches.length ? matches.reduce((sum, revChar) => sum + revChar.value, 0) / matches.length : 0;

      charchar[char.name] = { id: char.id, value: average.toFixed(4) };
    }

    console.log(charchar, '**CHAR')




    // if (response.length === 0) return res.status(400).send('Reviews meta data not found');
    res.status(200).json({
      product_id: id,
      reviewRes
    });
  } catch (err) {
    console.error(`Error getting reviews meta for product id: ${id}`, err);
    res.status(500).send(err);
  }
});


app.post('/reviews/:id', async (req, res) => {

});


app.put('/reviews/:review_id/helpful', async (req, res) => {

});


app.put('/reviews/:review_id/report', async (req, res) => {

});



app.listen(3000, () => {
  console.log('currently listening on port 3000');
})