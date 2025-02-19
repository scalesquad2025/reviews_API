const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const db = require('../database/db.js');
const pgp = require('pg-promise')();

let batch = [];
const batchSize = 40000;

const seedReviewCharacteristics = async () => {
  try {
    console.log('Starting database seeding...');

    const reviewCharacteristicsPath = path.join(__dirname, '../data/characteristic_reviews.csv');
    const fileStream = fs.createReadStream(reviewCharacteristicsPath);

    fileStream.pipe(csv({ separator: ',' }))
      .on('data', async (row) => {

        const parsedRow = {
          id: parseInt(row.id),
          characteristic_id: parseInt(row.characteristic_id),
          review_id: parseInt(row.review_id),
          value: parseFloat(row.value),
        }

        batch.push(parsedRow);

        if (batch.length === batchSize) {
          fileStream.pause();
          try {
            await insertToDatabase(batch);
            console.log(`Inserted ${batchSize} rows`);
            batch.length = 0;
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
        console.log('CSV processing completed.');
      });
  } catch (err) {
    console.error('Error during seeding: ', err);
  }
};

const insertToDatabase = async (batch) => {
  const columns = new pgp.helpers.ColumnSet([
    'id',
    'characteristic_id',
    'review_id',
    'value'
  ], { table: 'review_characteristics' });

  try {
    const ids = new Set(batch.map(row => row.id));
    const existingRows = await db.any('SELECT id FROM review_characteristics WHERE id = ANY($1)', [Array.from(ids)]);

    const existingIds = new Set(existingRows.map(row => row.id));
    const rowsToAdd = batch.filter(row => !existingIds.has(row.id));

    if (rowsToAdd.length) {
      const query = pgp.helpers.insert(batch, columns);
      await db.none(query);
      console.log(`${rowsToAdd.length} new rows inserted.`);
    } else {
      console.log('No new rows to insert')
    }
  } catch (err) {
    console.error('Error inserting batch:', err.message);
    throw err;
  }
};


seedReviewCharacteristics();
