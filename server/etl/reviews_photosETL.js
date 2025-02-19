const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const db = require('../database/db.js');
const pgp = require('pg-promise')();

let batch = [];
const batchSize = 40000;

const seedReviewPhotos = async () => {
  try {
    console.log('Starting database seeding...');

    const reviewPhotosPath = path.join(__dirname, '../data/reviews_photos.csv');
    const fileStream = fs.createReadStream(reviewPhotosPath);

    fileStream.pipe(csv({ separator: ',' }))
      .on('data', async (row) => {
        const parsedRow = {
          id: parseInt(row.id),
          review_id: parseInt(row.review_id),
          url: row.url
        }

        batch.push(parsedRow);

        if (batch.length === batchSize) {
          fileStream.pause();
          try {
            await insertToDatabase(batch);
            console.log(`Inserted ${batchSize} rows`);
            batch = [];
            fileStream.resume();
          } catch (err) {
            console.error('Error inserting batch: ', err);
            fileStream.destroy();
          }
        }
      })
      .on('error', (err) => {
        console.error('Error reading CSV file: ', err);
      })
      .on('end', async () => {
        if (batch.length) {
          try {
            await insertToDatabase(batch);
            console.log('Final batch inserted.');
          } catch (err) {
            console.error('Error inserting final batch: ', err);
          }
        }
      });
  } catch (err) {
    console.error('Error during seeding: ', err);
  }
};

const insertToDatabase = async (batch) => {
  const columns = new pgp.helpers.ColumnSet(
    ['id', 'review_id', 'url'], { table: 'review_photos' }
  );

  try {
    const ids = new Set(batch.map(row => row.id));
    const existingRows = await db.any('SELECT id FROM review_photos WHERE id = ANY($1)', [Array.from(ids)]);
    const existingIds = new Set(existingRows.map(row => row.id));
    const rowsToAdd = batch.filter(row => !existingIds.has(row.id));

    if (rowsToAdd.length) {
      const query = pgp.helpers.insert(rowsToAdd, columns);
      await db.none(query);
      console.log(`${rowsToAdd.length} new rows inserted.`);
    } else {
      console.log('No new rows to insert.');
    }
  } catch (err) {
    console.error('Error inserting batch: ', err);
    throw err;
  }
}

seedReviewPhotos();