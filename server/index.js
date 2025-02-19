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

// GET ALL REVIEWS FOR A PRODUCT
app.get('/reviews/:id', async (req, res) => {
  const id = Number(req.params.id);
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
    FROM reviews
    WHERE product_id = $1
    AND reported = FALSE`;

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
    });

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

// GET ALL META REVIEWS
app.get('/reviews/meta/:id', async (req, res) => {
  const id = Number(req.params.id);
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

    const characIds = characRes.map(char => Number(char.id));

    const reviewCharacQuery = `SELECT
    id,
    characteristic_id,
    value
    FROM review_characteristics
    WHERE characteristic_id = ANY($1)`

    const reviewCharacRes = await db.any(reviewCharacQuery, [characIds]);


    const ratings = {};
    for (let review of reviewRes) {
      if (!ratings[review.rating]) ratings[review.rating] = 1;
      else ratings[review.rating]++;
    };

    const recommended = {};
    for (let review of reviewRes) {
      let key = Number(review.recommend);
      if (!recommended[key]) recommended[key] = 1;
      else recommended[key]++;
    };

    const characteristics = {};
    for (let char of characRes) {
      const matches = reviewCharacRes.filter(revChar => revChar.characteristic_id === char.id);
      const average = matches.length ? matches.reduce((sum, revChar) => sum + revChar.value, 0) / matches.length : 0;
      characteristics[char.name] = { id: char.id, value: average.toFixed(4) };
    };

    res.status(200).json({
      product_id: id,
      ratings: ratings,
      recommended: recommended,
      characteristics: characteristics
    });
  } catch (err) {
    console.error(`Error getting reviews meta for product id: ${id}`, err);
    res.status(500).send(err);
  }
});

// ADD NEW REVIEW
app.post('/reviews', async (req, res) => {
  const review = {
    product_id: req.body.product_id,
    rating: req.body.rating,
    summary: req.body.summary,
    body: req.body.body,
    recommend: req.body.recommend,
    reviewer_name: req.body.reviewer_name,
    reviewer_email: req.body.reviewer_email,
    photos: req.body.photos,
    characteristics: req.body.characteristics
  };

  // const review = {
  //   product_id: 40349,
  //   rating: 5,
  //   summary: "Great product",
  //   body: "This nice.",
  //   recommend: true,
  //   reviewer_name: "Mac Demo",
  //   reviewer_email: "demo@demo.com",
  //   photos: [
  //     "https://example.com/photo1.jpg",
  //     "https://example.com/photo2.jpg"
  //   ],
  //   characteristics: {
  //     "Fit": {
  //       "id": 135005,
  //       "value": 5
  //     },
  //     "Length": {
  //       "id": 135006,
  //       "value": 4
  //     }
  //   }
  // }

  try {
    const newReviewQuery = `INSERT INTO
    reviews(
    product_id,
    rating,
    summary,
    body,
    recommend,
    reviewer_name,
    reviewer_email
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING id, product_id`;

    const postReview = await db.one(newReviewQuery, [
      review.product_id,
      review.rating,
      review.summary,
      review.body,
      review.recommend,
      review.reviewer_name,
      review.reviewer_email
    ]);

    // console.log('POST', postReview)

    // insert photos
    if (review.photos) {
      for (let photo of review.photos) {
        const photoQuery = `INSERT INTO review_photos (review_id, url) VALUES ($1, $2)`;
        await db.none(photoQuery, [postReview.id, photo]);
      }
    };

    // insert characteristics
    if (review.characteristics) {
      for (let characName of Object.keys(review.characteristics)) {
        // check if characteristics name exists
        const characNameQuery = `SELECT id FROM characteristics WHERE product_id = $1 AND id = $2`;
        const characNameRes = await db.oneOrNone(characNameQuery, [postReview.product_id, postReview.id]);

        // add if it doesn't
        if (!characNameRes) {
          const insertCharacName = `INSERT INTO characteristics (name, product_id) VALUES ($1, $2)`;
          await db.none(insertCharacName, [characName, postReview.product_id]);
        }
      }

      // insert to review_characteristics
      for (let characteristic of Object.values(review.characteristics)) {
        const { id: characteristicsId, value: characteristicsValue } = characteristic;
        const characteristicsQuery = `INSERT INTO review_characteristics (review_id, characteristic_id, value) VALUES ($1, $2, $3)`
        await db.none(characteristicsQuery, [postReview.id, characteristicsId, characteristicsValue])
      }
    }

    res.status(201).send({ message: 'Successfully added a review' });
  } catch (err) {
    console.error('Error adding a review', err);
    res.status(500).send(err);
  }
});


app.put('/reviews/:review_id/helpful', async (req, res) => {
  const reviewId = Number(req.params.review_id);

  try {
    const updateQuery = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = $1`
    const updatedHelpfulness = await db.none(updateQuery, [reviewId]);

    // if (updatedHelpfulness.rowCount === 0) return res.status(404).send({ message: 'Error marking a review helpful' });
    res.status(204).end();
  } catch (err) {
    console.error(`Error updating review helpfulness`, err);
    res.status(500).send(err);
  }
});


app.put('/reviews/:review_id/report', async (req, res) => {
  const reviewId = Number(req.params.review_id);

  try {
    const updateQuery = `UPDATE reviews SET reported = TRUE WHERE id = $1`
    const updatedReport = await db.none(updateQuery, [reviewId]);

    if (updatedReport.rowCount === 0) return res.status(404).send({ message: 'Error reporting a review' })
    res.status(204).end();
  } catch (err) {
    console.error(`Error reporting a review`, err);
    res.status(500).send(err);
  }
});



const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };