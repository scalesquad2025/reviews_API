const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const db = require('../database/db.js'); 
const pgp = require('pg-promise')();

const batch = [];
const batchSize = 4;

const seedReviews = async () => {
  try {
    console.log('Starting database seeding...');

    const reviewsPath = path.join(__dirname, '../data/reviews.csv');
    const fileStream = fs.createReadStream(reviewsPath);

    fileStream.pipe(csv({ separator: ',' }))
      .on('data', async (row) => {
        const parsedRow = {
          product_id: parseInt(row.product_id),
          rating: parseInt(row.rating),
          date: new Date(parseInt(row.date)).toISOString().replace('T', ' ').replace('Z', ''),
          summary: row.summary,
          body: row.body,
          recommend: row.recommend === 'true',
          reported: row.reported === 'true',
          reviewer_name: row.reviewer_name,
          reviewer_email: row.reviewer_email,
          response: row.response === 'null' ? null : row.response,
          helpfulness: parseInt(row.helpfulness),
        };

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
    'product_id',
    'rating',
    'date',
    'summary',
    'body',
    'recommend',
    'reported',
    'reviewer_name',
    'reviewer_email',
    'response',
    'helpfulness',
  ], { table: 'reviews' });

  const query = pgp.helpers.insert(batch, columns);

  try {
    await db.none(query);
    console.log('Batch added successfully');
  } catch (err) {
    console.error('Error inserting batch:', err.message);
    throw err;
  }
};


seedReviews();
