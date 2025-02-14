const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const db = require('../database/db.js');
const pgp = require('pg-promise')();

const batch = [];
const batchSize = 10000;

const seedReviewCharacteristics = async () => {
  try {
    console.log('Starting database seeding...');

    const reviewCharacteristicsPath = path.join(__dirname, '../data/characteristic_reviews.csv');
    const fileStream = fs.createReadStream(reviewCharacteristicsPath);

    fileStream.pipe(csv({ separator: ',' }))
      .on('data', async (row) => {

        const parsedRow = {
          id: parseInt(row.id),
          name: row.name
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
            console.error('Error inserting batch:', err);
            fileStream.destroy();
          }
        }
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
      })
      .on('end', async () => {
        if (batch.length > 0) {
          try {
            await insertToDatabase(batch);
            console.log('Final batch inserted.');
          } catch (err) {
            console.error('Error inserting final batch:', err);
          }
        }
        console.log('CSV processing completed.');
      });
  } catch (err) {
    console.error('Error during seeding:', err);
  }
};

const insertToDatabase = async (batch) => {
  const columns = new pgp.helpers.ColumnSet([
    'review_id',
    'characterictic_id'
  ], { table: 'review_characteristics' });

  const query = pgp.helpers.insert(batch, columns);

  try {
    await db.none(query);
    console.log('Batch added successfully');
  } catch (err) {
    console.error('Error inserting batch:', err.message);
    throw err;
  }
};


seedReviewCharacteristics();
