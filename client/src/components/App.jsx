import React, { useRef } from 'react';
import RelatedItems from './RelatedItems/RelatedItems.jsx';
import ProductOverview from './ProductOverview/ProductOverview.jsx';
import ProductDetails from './ProductOverview/ProductDetails.jsx';
import QA from './QA/QA.jsx';
import RatingsReviews from './RatingsReviews/RatingsReviews.jsx';
import '../index.css';

var App = (props) => {
  return (
    <div>
      <ProductOverview />
      <RelatedItems />
      <QA />
      <RatingsReviews />
    </div>
  );
};

export default App;