import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const ProductDetails = () => {
  const dispatch = useDispatch();
  const id = useSelector(state => state.products.currentProduct) || 40347;
  const details = useSelector(state => state.products.productDetails?.[id]);
  const styles = useSelector(state => state.products.productStyles?.[id]?.results) || [];
  const status = useSelector(state => state.products.status);
  const reviews = useSelector(state => state?.reviews?.reviews) || [];

  const price = details?.sale_price ? (
    <>
      <s>${details?.default_price}</s>
      <span>${details?.sale_price}</span>
    </>
  ) : (
    <span>${details?.default_price}</span>
  );

  const avgRating = () => {
    let sum = 0;
    for (let review of reviews) {
      sum += review.rating;
    }
    let avg = sum / reviews.length;
    return Math.round(avg * 2) / 2;
  };

  const avgStar = avgRating();

  const stars = {
    empty: <i className="fa-regular fa-star"></i>,
    half: <i className="fa-regular fa-star-half-stroke"></i>,
    full: <i className="fa-solid fa-star"></i>
  }

  const handleReviewsScroll = () => {
    document.querySelector('.ratingsReviews')?.scrollIntoView({
      behavior: 'smooth'
    });
  };


  return (
    <div className='product-details'>
      {reviews.length && (
        <div className='reviews-product-details'>
          <div className="rating">
            {avgStar >= 1 ? stars.full : avgStar >= 0.5 ? stars.half : stars.empty}
            {avgStar >= 2 ? stars.full : avgStar >= 1.5 ? stars.half : stars.empty}
            {avgStar >= 3 ? stars.full : avgStar >= 2.5 ? stars.half : stars.empty}
            {avgStar >= 4 ? stars.full : avgStar >= 3.5 ? stars.half : stars.empty}
            {avgStar >= 5 ? stars.full : avgStar >= 4.5 ? stars.half : stars.empty}
          </div>
          <a onClick={handleReviewsScroll} className='reviews-link'>Read all {reviews.length} reviews</a>
        </div>
      )}
      {details ? (
        <div>
          <div className='product-info'>
            <p>{details?.category}</p>
            <h1 className='product-name'>{details?.name}</h1>
            <p>{price}</p>
          </div>
          <div className='social-media-icons'>
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-twitter"></i>
            <i className="fa-brands fa-pinterest"></i>
          </div>
        </div>
      ) : (
        <p>Loading product details...</p>
      )
      }
    </div >
  );
};

export default ProductDetails;