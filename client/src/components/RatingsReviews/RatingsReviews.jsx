import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

const RatingsReviews = () => {


  const isOpen = useSelector((state) => {
    return state.newReviewForm.formOpen;
  })

  return (
    <div className="ratings-reviews">
      <h1 className="rrHeader, section-title">Ratings & Reviews</h1>
      <div className="ratingsReviews">
        <Breakdowns />
        <ReviewList />
        { isOpen ? <NewReviewModal /> : null}
      </div>
    </div>
  )
}

import ReviewList from './reviewList.jsx';
import RatingBreakdown from './ratingBreakdown.jsx';
import ProductBreakdown from './productBreakdown.jsx';
import NewReviewModal from './newReviewModal.jsx';
import Breakdowns from './breakdowns.jsx';

export default RatingsReviews;