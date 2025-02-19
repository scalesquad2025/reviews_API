const request = require("supertest");
const { app, server } = require("../index");

afterAll((done) => {
  server.close(done);
});

describe("GET /products", () => {
  it("should return all products", async () => {
    const res = await request(app).get("/products");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
}, 10000);


describe("GET /reviews/:id", () => {
  it("should return all reviews for a product", async () => {
    const res = await request(app).get("/reviews/40349");
    console.log("Response body:", res.body); 
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

});

describe("POST /reviews", () => {
  it("test case for creating a user", async () => {
    const review = await request(app).post("/reviews").send({
      product_id: 40349,
      rating: 5,
      summary: "Great product",
      body: "This nice.",
      recommend: true,
      reviewer_name: "Mac Demo",
      reviewer_email: "demo@demo.com",
      photos: [
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.jpg"
      ],
      characteristics: {
        "Fit": {
          "id": 135005,
          "value": 5
        },
        "Length": {
          "id": 135006,
          "value": 4
        }
      }
    });
    console.log("response after creating review", review);
    expect(review.status).toBe(201);
    expect(review.body.summary).toBe("Great product");
    expect(review.body.recommend).toBe(true);
  });
});

describe("PUT /reviews/:review_id/helpful", () => {
  it("should update a product", async () => {
    const currentReview = await request(app).get("/reviews/232960");
    const helpfulCount = currentReview.body.helpful || 0;

    const res = await request(app)
      .put("/reviews/232960/helpful")
      .send({ helpful: helpfulCount + 1 });

    expect(res.statusCode).toBe(200);
  });
});