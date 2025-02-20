import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '60s', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '1m30s', target: 1000 },
    { duration: '20s', target: 0 },
  ]
}


// const review = {
//   product_id: 1910,
//   rating: 5,
//   summary: "Very nice",
//   body: "This nice",
//   recommend: true,
//   reviewer_name: "Rogrigo Garro",
//   reviewer_email: "rodrigo@garro.com",
//   photos: [
//     "https://corinthians.com/campeao.jpg"
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



export default function () {
  // const headers = { 'Content-Type': 'application/json' };
  // const res = http.post('http://localhost:3000/reviews/1992', JSON.stringify(review), { headers });
  const res = http.get('http://localhost:3000/reviews/1992');

  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
};
