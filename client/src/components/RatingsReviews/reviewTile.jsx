import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReviews } from '../../store/ratingsReviews/reviewsSlice.js';
import { format } from 'date-fns';
import axios from 'axios';
import ReviewImageModal from './ReviewImageModal.jsx';

const ReviewTile = ({review}) => {
  const dispatch = useDispatch();

  const stars = {
    empty: <i className="fa-regular fa-star"></i>,
    half: <i className="fa-regular fa-star-half-stroke"></i>,
    full: <i className="fa-solid fa-star"></i>
  }

  const [ imageModal, setImageModal ] = useState(false);
  const [ imageURL, setImageURL ] = useState('');
  const [ hasRated, setHasRated ] = useState(false);
  const [ currentHelpful, setCurrentHelpful ] = useState(review.helpfulness)

  const handleClick = (url) => {
    setImageURL(url)
    setImageModal(true);
  }

  const handleRate = (isHelpful) => {
    setHasRated(true);
    if (isHelpful) {
      return axios.put(`/api/reviews/${review.review_id}/helpful`)
        .then(() => {
          setCurrentHelpful(currentHelpful + 1);
          console.log('updated helpfulness');
        })
        .catch((err) => console.error(err));
    }
  }

  const handleReport = () => {
    return axios.put(`/api/reviews/${review.review_id}/report`)
      .then(() => {
        dispatch(fetchReviews());
      })
      .catch((err) => console.error(err));
  }

  const date = format(new Date(review.date), 'MMMM dd, yyyy');

  let photos = [];
  if (review.photos.length) {
    photos = review.photos.map((photo) => {
      return <img className="review-thumbnail" key={photo.id} src={photo.url.replace(/v\d+/, 'c_fill,w_90,h_60')} onClick={() => handleClick(photo.url)}/>
    })
  }


  return (
    <div className="reviewTile" data-testid="review-tile">
      { imageModal ? <ReviewImageModal photo={imageURL} setImageModal={setImageModal} setImageURL={setImageURL}/> : null}
      <span className="reviewDate">{date}</span>
      <h3 className="reviewerName">{review.reviewer_name}</h3>
      <div>
        {review.rating >= 1 ? stars.full : review.rating >= 0.5 ? stars.half : stars.empty}
        {review.rating >= 2 ? stars.full : review.rating >= 1.5 ? stars.half : stars.empty}
        {review.rating >= 3 ? stars.full : review.rating >= 2.5 ? stars.half : stars.empty}
        {review.rating >= 4 ? stars.full : review.rating >= 3.5 ? stars.half : stars.empty}
        {review.rating >= 5 ? stars.full : review.rating >= 4.5 ? stars.half : stars.empty}
      </div>
      <h3>{review.summary}</h3>
      <p className="reviewBody">{review.body}</p>
      {photos.length ? photos : null}
      {review.recommend ? <p>I recommend this product  <i class="fa-solid fa-check"></i></p> : null}
      {review.response ? <p className="sellerResponse">review.response</p> : null}
      <p>Was this review helpful?</p>
      { hasRated ? <p>You have already rated this review</p> : <div><button className="rr-button" onClick={() => handleRate(true)}>Yes</button><button className="rr-button" onClick={() => handleRate(false)}>No</button></div>}
      <p>{currentHelpful} customers found this review helpful</p>
      <button className="rr-button" onClick={handleReport}>Report</button>
    </div>
  );

}

export default ReviewTile;