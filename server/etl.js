const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');


const seedReviews = () => {

  const reviewsPath = path.join(__dirname, './data/reviews.csv');
  const fileStream = fs.createReadStream(reviewsPath)

  fileStream.pipe(parse({ delimiter: ',', from_line: 2 }))
    .on('data', (row) => {
      console.log('ROW', row)
      const parsedRow = {
        id: parseInt(row[0]),
        product_id: parseInt(row[1]),
        rating: parseInt(row[2]),
        date: new Date(parseInt(row[3])),
        summary: row[4],
        body: row[5],
        recommend: row[6],
        reported: row[7],
        reviewer_name: row[8],
        reviewer_email: row[9],
        response: row[10],
        helpfulness: row[11]
      }

      console.log("PARSED: ", parsedRow);
    })


}

seedReviews();

// fs.createReadStream()
//   .pipe(parse({ delimiter: ',', from_line: 2 }))
//   .on('data', (row) => {
//     console.log(row)
//   })