import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChars } from '../../store/ratingsReviews/productBreakdownSlice.js';

const ProductBreakdown = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchChars());
  }, []);

  const characteristics = useSelector((state) => {
    return state.productBreakdown.characteristics;
  })

  if (!Object.keys(characteristics).length) {
    return <div>LOADING...</div>
  }


  // helper function to build slider text for each characteristic

  const findDescription = (char) => {
    let descriptors = {
      left: null,
      mid: null,
      right: null
    }
    if (char === 'Size') {
      descriptors.left = 'a size too small';
      descriptors.mid = 'perfect';
      descriptors.right = 'a size too big';
      return descriptors;
    }
    if (char === 'Width') {
      descriptors.left = 'too narrow';
      descriptors.mid = 'perfect';
      descriptors.right = 'too wide';
      return descriptors;
    }
    if (char === 'Comfort') {
      descriptors.left = 'uncomfortable';
      descriptors.mid = 'ok';
      descriptors.right = 'perfect';
      return descriptors;
    }
    if (char === 'Quality') {
      descriptors.left = 'poor';
      descriptors.mid = 'what I expected';
      descriptors.right = 'perfect';
      return descriptors;
    }
    if (char === 'Length') {
      descriptors.left = 'runs short';
      descriptors.mid = 'perfect';
      descriptors.right = 'runs long';
      return descriptors;
    }
    if (char === 'Fit') {
      descriptors.left = 'runs tight';
      descriptors.mid = 'perfect';
      descriptors.right = 'runs loose';
      return descriptors;
    }
  }

  const breakdowns = Object.keys(characteristics).map((char, index) => {
    const rating = Math.round(characteristics[char].value * 10) / 10;
    const position = Math.round((rating / 5) * 100) + '%';
    const descriptors = findDescription(char);
    return (
      <div key={index} className="rating-container" data-testid="product-breakdown">
        <span>{char}</span>
        <div className="slider">
          <div className="slider-track">
            <div className="slider-thumb" style={{left: position}}></div>
          </div>
        </div>
        <div className="descContainer">
          <span className="slider-left">{descriptors.left}</span><span className="slider-mid">{descriptors.mid}</span><span className="slider-right">{descriptors.right}</span>
        </div>
      </div>
    )
  })



  return (
    <div className="productBreakdown">{breakdowns}</div>
  );
}

export default ProductBreakdown;