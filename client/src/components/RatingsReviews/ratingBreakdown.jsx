import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { filterReviews, resetFilter, resetRendered } from '../../store/ratingsReviews/reviewsSlice.js';

const RatingBreakdown = () => {
  const dispatch = useDispatch();

  const [isFiltered, setIsFiltered] = useState(false);
  const [filter5, setFilter5] = useState(false);
  const [filter4, setFilter4] = useState(false);
  const [filter3, setFilter3] = useState(false);
  const [filter2, setFilter2] = useState(false);
  const [filter1, setFilter1] = useState(false);

  const reviews = useSelector((state) => {
    return state.reviews.reviews || [];
  })

  const filteredReviews = useSelector((state) => {
    return state.reviews.filteredReviews;
  })

  const avgRating = () => {
    let sum = 0;
    for (let review of reviews) {
      sum += review.rating;
    }
    let avg = sum / reviews.length;
    return Math.round(avg * 2) / 2;
  };

  const percentRec = () => {
    let recommendCount = 0;
    for (let review of reviews) {
      if (review.recommend) {
        recommendCount++;
      }
    }
    return Math.round((recommendCount / reviews.length) * 100);
  };

  // disgusting wet code I can't figure out how to pass in a star value and only make one function :(
  const fiveStar = () => {
    let starCount = 0;
    for (let review of reviews) {
      if (review.rating === 5) {
        starCount++;
      }
    }
    return Math.round((starCount / reviews.length) * 100);
  };

  const fourStar = () => {
    let starCount = 0;
    for (let review of reviews) {
      if (review.rating === 4) {
        starCount++;
      }
    }
    return Math.round((starCount / reviews.length) * 100);
  };

  const threeStar = () => {
    let starCount = 0;
    for (let review of reviews) {
      if (review.rating === 3) {
        starCount++;
      }
    }
    return Math.round((starCount / reviews.length) * 100);
  };

  const twoStar = () => {
    let starCount = 0;
    for (let review of reviews) {
      if (review.rating === 2) {
        starCount++;
      }
    }
    return Math.round((starCount / reviews.length) * 100);
  };

  const oneStar = () => {
    let starCount = 0;
    for (let review of reviews) {
      if (review.rating === 1) {
        starCount++;
      }
    }
    return Math.round((starCount / reviews.length) * 100);
  };



  const stars = {
    empty: <i className="fa-regular fa-star"></i>,
    half: <i className="fa-regular fa-star-half-stroke"></i>,
    full: <i className="fa-solid fa-star"></i>
  }

  const handleReset = () => {
    setIsFiltered(false);
    setFilter5(false);
    setFilter4(false);
    setFilter3(false);
    setFilter2(false);
    setFilter1(false);
    dispatch(resetFilter(reviews.slice(0, 2)));
  }

  const checkFilters = (stars) => {
    if (stars === 5) {
      setFilter5(true);
      return;
    }
    if (stars === 4) {
      setFilter4(true);
      return;
    }
    if (stars === 3) {
      setFilter3(true);
      return;
    }
    if (stars === 2) {
      setFilter2(true);
      return;
    }
    if (stars === 1) {
      setFilter1(true);
      return;
    }
  }

  const handleFilter = (stars) => {
    checkFilters(stars);
    for (let review of filteredReviews) {
      if (review.rating === stars) {
        handleReset();
        return;
      }
    }
    let tempArr = []
    let reviewsToAdd = reviews.filter((review) => {
      if (review.rating === stars) {
        tempArr.push(review);
      }
      return review.rating === stars;
    })
    dispatch(filterReviews(reviewsToAdd));
    if (!isFiltered) {
      dispatch(resetRendered(tempArr.slice(0, 2)));
      setIsFiltered(true);
    }
  }


  // handle async http requests or empty reviews
  if (!reviews.length) {
    return (
      <div className="ratingBreakdown">
        <h1>No Ratings</h1>
        <div className="rating">
          {stars.empty}
          {stars.empty}
          {stars.empty}
          {stars.empty}
          {stars.empty}
        </div>
        <div className="starBars">
          <p>{percentRec()}% of reviews reccomend this product</p>
          <span>5 stars</span><progress className="ratingCounter" value="0" max="100"></progress>
          <span>4 stars</span><progress className="ratingCounter" value="0" max="100"></progress>
          <span>3 stars</span><progress className="ratingCounter" value="0" max="100"></progress>
          <span>2 stars</span><progress className="ratingCounter" value="0" max="100"></progress>
          <span>1 stars</span><progress className="ratingCounter" value="0" max="100"></progress>
        </div>
      </div>
    );
  }

  // only run function once upon render now that reviews have been fetched and rendered
  const avgStar = avgRating();

  return (
    <div className="ratingBreakdown">
      <h1>{avgStar}</h1>
      <div>
        {isFiltered ? <span id="resetReviews" onClick={handleReset}>Reset Review List</span> : null}
      </div>
      <div className="rating">
        {avgStar >= 1 ? stars.full : avgStar >= 0.5 ? stars.half : stars.empty}
        {avgStar >= 2 ? stars.full : avgStar >= 1.5 ? stars.half : stars.empty}
        {avgStar >= 3 ? stars.full : avgStar >= 2.5 ? stars.half : stars.empty}
        {avgStar >= 4 ? stars.full : avgStar >= 3.5 ? stars.half : stars.empty}
        {avgStar >= 5 ? stars.full : avgStar >= 4.5 ? stars.half : stars.empty}
      </div>
      <div className="starBars">
        <p>{percentRec()}% of reviews recommend this product</p>
        <div className="ratingHover" onClick={() => handleFilter(5)} data-testid="star-bar"><p>5 stars</p><progress className="ratingCounter" value={fiveStar()} max="100"></progress>
          {filter5 ? <p className="rating-filter">showing reviews with 5 star rating</p> : null}
        </div>
        <div className="ratingHover" onClick={() => handleFilter(4)} data-testid="star-bar"><p>4 stars</p><progress className="ratingCounter" value={fourStar()} max="100"></progress>
          {filter4 ? <p className="rating-filter">showing reviews with 4 star rating</p> : null}
        </div>
        <div className="ratingHover" onClick={() => handleFilter(3)} data-testid="star-bar"><p>3 stars</p><progress className="ratingCounter" value={threeStar()} max="100"></progress>
          {filter3 ? <p className="rating-filter">showing reviews with 3 star rating</p> : null}
        </div>
        <div className="ratingHover" onClick={() => handleFilter(2)} data-testid="star-bar"><p>2 stars</p><progress className="ratingCounter" value={twoStar()} max="100"></progress>
          {filter2 ? <p className="rating-filter">showing reviews with 2 star rating</p> : null}
        </div>
        <div className="ratingHover" onClick={() => handleFilter(1)} data-testid="star-bar"><p>1 stars</p><progress className="ratingCounter" value={oneStar()} max="100"></progress>
          {filter1 ? <p className="rating-filter">showing reviews with 1 star rating</p> : null}
        </div>
      </div>
    </div>

  );
}

export default RatingBreakdown;