import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReviews } from '../../store/relatedItemsSlice.js';

const Stars = ({item}) => {

  const dispatch = useDispatch();

  const [reviews, setReviews] = useState([]);

  const stars = {
    empty: <i className="fa-regular fa-star"></i>,
    half: <i className="fa-regular fa-star-half-stroke"></i>,
    full: <i className="fa-solid fa-star"></i>
  }

  const avgRating = () => {
    let sum = 0;
    for (let review of reviews) {
      sum += review.rating;
    }
    let avg = sum / reviews.length;
    return Math.round(avg * 2) / 2;
  };

  const avgStar = avgRating();

  useEffect(() => {
    dispatch(fetchReviews(item.id))
    .then((results) => {
      setReviews(results.payload)
    })
  }, [])

  return (
    <div className="rating" >
      {avgStar >= 1 ? stars.full : avgStar >= 0.5 ? stars.half : stars.empty}
      {avgStar >= 2 ? stars.full : avgStar >= 1.5 ? stars.half : stars.empty}
      {avgStar >= 3 ? stars.full : avgStar >= 2.5 ? stars.half : stars.empty}
      {avgStar >= 4 ? stars.full : avgStar >= 3.5 ? stars.half : stars.empty}
      {avgStar >= 5 ? stars.full : avgStar >= 4.5 ? stars.half : stars.empty}
    </div>
  )
}

export default Stars