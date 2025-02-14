const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const db = require('../database/db.js');
const pgp = require('pg-promise')();

const batch = [];
const batchSize = 10000;

const seedProducts = async () => {
  try {
    console.log('Starting database seeding...');

    const productsPath = path.join(__dirname, '../data/product.csv');
    const fileStream = fs.createReadStream(productsPath);

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
            batch = [];
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
        if (batch.length) {
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
  const columns = new pgp.helpers.ColumnSet(
    ['id', 'name'],
    { table: 'products' }
  );

  try {
    // make a set with ids from batch
    const ids = new Set(batch.map(row => row.id));

    // query for ids that exist in db already
    const existingRows = await db.any('SELECT id FROM products WHERE id = ANY($1)', [Array.from(ids)]);
    // make a set from query result
    const existingIds = new Set(existingRows.map(row => row.id));

    // filter out existing ids to add non-existing to db
    const rowsToAdd = batch.filter(row => !existingIds.has(row.id));

    if (rowsToAdd.length > 0) {
      const query = pgp.helpers.insert(rowsToAdd, columns);
      await db.none(query);
      console.log(`${rowsToAdd.length} new rows inserted.`);
    } else {
      console.log('No new rows to insert.');
    }
  } catch (err) {
    console.error('Error inserting batch:', err.message);
    throw err;
  }
};


seedProducts();
