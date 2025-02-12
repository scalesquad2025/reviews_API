
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  summary TEXT,
  recommend BOOLEAN NOT NULL,
  response TEXT,
  reviewer_name VARCHAR(255) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  helpfulness INT DEFAULT 0
);

CREATE TABLE review_photos (
  id SERIAL PRIMARY KEY,
    review_id INT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    url VARCHAR NOT NULL
);

CREATE TABLE review_characteristics (
  id SERIAL PRIMARY KEY,
    review_id INT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    characteristic_id INT REFERENCES characteristics(id),
    name TEXT
);

CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY,
    value FLOAT,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE
);