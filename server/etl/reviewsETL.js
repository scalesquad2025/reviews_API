const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');


const seedReviews = () => {

  const reviewsPath = path.join(__dirname, '../data/reviews.csv');
  const fileStream = fs.createReadStream(reviewsPath);

  const batch = [];

  fileStream.pipe(parse({ delimiter: ',', from_line: 2 }))
    .on('data', (row) => {
      console.log('START')
      console.log('ROW', row)
      const parsedRow = {
        id: parseInt(row[0]),
        product_id: parseInt(row[1]),
        rating: parseInt(row[2]),
        date: new Date(parseInt(row[3])).toISOString().replace('T', ' ').replace('Z', ''),
        summary: row[4],
        body: row[5],
        recommend: row[6] === 'true',
        reported: row[7] === 'true',
        reviewer_name: row[8],
        reviewer_email: row[9],
        response: row[10] === 'null' ? null : row[10],
        helpfulness: parseInt(row[11])
      }
      console.log("PARSED: ", parsedRow);

      batch.push(parsedRow);

      if (batch.length === 1000) {
        // ADD TO DATABASE
        // CLEAR BATCH ARRAY
        // RESTART PROCESS
      }
    })
    .on('error', (err) => {
      console.error('Error reading csv file: ', err);
    })
    .on('end', () => {
      console.log('END');
    })

}


seedReviews();