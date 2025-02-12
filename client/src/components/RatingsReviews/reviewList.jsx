import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReviews, moreReviews, filterReviews } from '../../store/ratingsReviews/reviewsSlice.js';
import{ isFormOpen } from '../../store/ratingsReviews/newReviewFormSlice.js';

const ReviewList = () => {
  const dispatch = useDispatch();

  const product_id = useSelector((state) => {
    return state.products.currentProduct;
  })

  // fetch reviews for current product upon mounting
  useEffect(() => {
    dispatch(fetchReviews())
  }, [product_id]);

  // STATE that holds list of all reviews
  const reviews = useSelector((state) => {
    return state.reviews.reviews || [];
  });

  const filteredReviews = useSelector((state) => {
    return state.reviews.filteredReviews;
  })

  // STATE that holds only rendered reviews, starts with 2, add 2 whenever click 'more reviews'
  const renderedReviews = useSelector((state) => {
    return state.reviews.renderedReviews || [];
  })

  // will make this its own component eventually
  let reviewCards = renderedReviews.map((review) => {
    return (
      <ReviewTile key={review.review_id} review={review} />
    );
  })


  // add next 2 more reviews from total list to rendered list
  const handleMoreReviews = () => {
    let start = renderedReviews.length;
    if (!filteredReviews.length) {
      let reviewsToAdd = reviews.slice(start, start + 2);
      dispatch(moreReviews(reviewsToAdd));
    } else {
      let reviewsToAdd = filteredReviews.slice(start, start + 2);
      dispatch(moreReviews(reviewsToAdd));
    }
  }

  // sorting requests
  const handleSort = () => {
    const sortOption = document.getElementById('sortBtn').value;
    dispatch(fetchReviews(sortOption));
  }

  return (
    <div className="reviewList">
      {filteredReviews.length ? <h3>{filteredReviews.length} reviews, sorted by</h3> : <h3>{reviews.length} reviews, sorted by</h3>}
      <select  id="sortBtn" onChange={handleSort}>
      <option value="relevant">Relevant</option>
        <option value="newest">Newest</option>
        <option value="helpful">Helpful</option>
      </select>
      <div id="review-container">
        {reviewCards}
      </div>
      {filteredReviews.length && reviewCards.length < filteredReviews.length  ? <button className="rr-button" onClick={handleMoreReviews}>MORE REVIEWS</button> : !filteredReviews.length && reviewCards.length < reviews.length  ? <button className="rr-button" onClick={handleMoreReviews}>MORE REVIEWS</button> : null}

      <button className="rr-button" onClick={() => dispatch(isFormOpen())}>ADD A REVIEW +</button>
    </div>
  );
}


import ReviewTile from './reviewTile.jsx';
export default ReviewList;