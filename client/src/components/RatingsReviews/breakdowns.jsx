import React from 'react';


const Breakdowns = () => {

  return (
    <div className="breakdowns">
      <RatingBreakdown data-testid="breakdown"/>
      <ProductBreakdown data-testid="breakdown"/>
    </div>
  );
}

import RatingBreakdown from './ratingBreakdown.jsx';
import ProductBreakdown from './productBreakdown.jsx';
export default Breakdowns;