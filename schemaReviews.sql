
-- id,name,slogan,description,category,default_price
CREATE TABLE products (
  id PRIMARY KEY,
  name VARCHAR NOT NULL
);

-- id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness
CREATE TABLE reviews (
  id PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  summary TEXT,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN DEFAULT FALSE,
  response TEXT,
  reviewer_name VARCHAR(255) NOT NULL,
  reviewer_email VARCHAR(255) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  helpfulness INT DEFAULT 0
);

-- id,review_id,url
CREATE TABLE review_photos (
  id PRIMARY KEY,
  review_id INT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  url VARCHAR NOT NULL
);

-- id,characteristic_id,review_id,value
CREATE TABLE review_characteristics (
  id PRIMARY KEY,
  review_id INT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  characteristic_id INT REFERENCES characteristics(id),
  name TEXT
);

-- id,product_id,name
CREATE TABLE characteristics (
  id PRIMARY KEY,
  value FLOAT,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE
);