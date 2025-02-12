import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isFormOpen } from '../../store/ratingsReviews/newReviewFormSlice.js';
import { fetchReviews } from '../../store/ratingsReviews/reviewsSlice.js';
import axios from 'axios';

const NewReviewModal = () => {
  const dispatch = useDispatch();
  const { useState } = React;

  // state
  const [ rating, setRating ] = useState(0);
  const [ summary, setSummary ] = useState('');
  const [ body, setBody ] = useState('');
  const [ reviewer, setReviewer ] = useState('');
  const [ recommend, setRecommend ] = useState(false);
  const [ email, setEmail ] = useState('');
  const [ images, setImages] = useState([])

  // table state
  const [ size, setSize ] = useState(null);
  const [ width, setWidth ] = useState(null);
  const [ comfort, setComfort ] = useState(null);
  const [ quality, setQuality ] = useState(null);
  const [ prodLength, setProdLength ] = useState(null);
  const [ fit, setFit ] = useState(null);

  const product_id = useSelector((state) => {
    return state.products.currentProduct;
  })


  // Toggle Modal Window
  const isOpen = useSelector((state) => {
    return state.newReviewForm.formOpen;
  })

  // set charaacteristics object for submission of form
  const checkChars = () => {
    let postChars = {};

    if (size) {
      postChars['135232'] = size;
    }
    if (width) {
      postChars['135233'] = width;
    }
    if (comfort) {
      postChars['135230'] = comfort;
    }
    if (quality) {
      postChars['135231'] = quality;
    }
    if (prodLength) {
      postChars['135229'] = prodLength;
    }
    if (fit) {
      postChars['135228'] = fit;
    }
    return postChars;
  }

  const handleSubmit = () => {
    let chars = checkChars();
    let reviewData = {
      product_id: Number(product_id),
      rating: Number(rating),
      summary: summary,
      recommend: recommend,
      body: body,
      name: reviewer,
      email: email,
      photos: images,
      characteristics: chars
    }
    return axios.post(`/api/reviews`, reviewData)
      .then(() => {
        dispatch(fetchReviews());
      })
  }


  // Handlers for form data setting state
  const handleRating = (e) => {
    e.preventDefault();
    setRating(e.target.value);
  }

  const handleRec = (isRecommended) => {
    if (isRecommended) {
      setRecommend(true);
    } else {
      setRecommend(false);
    }
  }

  const handleSummary = (e) => {
    e.preventDefault();
    setSummary(e.target.value);
  }

  const handleBody = (e) => {
    e.preventDefault();
    setBody(e.target.value);
  }

  const handleReviewer = (e) => {
    e.preventDefault();
    setReviewer(e.target.value);
  }

  const handleEmail = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  }

  const handleImage = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const  fileURL = URL.createObjectURL(file);
      console.log(fileURL);
      setImages([...images, fileURL]);
    }
  }



  const stars = {
    empty: <i className="fa-regular fa-star"></i>,
    half: <i className="fa-regular fa-star-half-stroke"></i>,
    full: <i className="fa-solid fa-star"></i>
  }

  if (!isOpen) return null;

  return (
    <dialog className="reviewModalContainer" open>
      <button  className="rr-button" onClick={() => dispatch(isFormOpen())} data-testid='close-modal-btn'>Close Without Saving</button>
      <div className="reviewModal">
        <form onSubmit={handleSubmit}>
          {/* rating */}
          <label>Rate this product 1-5 stars!
            <input type="number" id="newReviewStars" min="0" max="5" value={rating} onChange={handleRating} required/>
          </label>
          <div>
            {rating >= 1 ? stars.full : rating >= 0.5 ? stars.half : stars.empty}
            {rating >= 2 ? stars.full : rating >= 1.5 ? stars.half : stars.empty}
            {rating >= 3 ? stars.full : rating >= 2.5 ? stars.half : stars.empty}
            {rating >= 4 ? stars.full : rating >= 3.5 ? stars.half : stars.empty}
            {rating >= 5 ? stars.full : rating >= 4.5 ? stars.half : stars.empty}
          </div>
          {/* recommend */}
          <p>Would you recommend this product?</p>
          <div>
            <input type="radio" name="recRadio" value={recommend} onClick={() => handleRec(true)}/>
            <label>Yes</label>
            <input type="radio" name="recRadio" value={recommend} onClick={() => handleRec(false)}/>
            <label>No</label>
          </div>
          {/* characteristics go here */}
          <CharacteristicsTable setSize={setSize} setWidth={setWidth} setComfort={setComfort} setQuality={setQuality} setProdLength={setProdLength} setFit={setFit}/>
          {/* Summary */}
          <div>
            <p>Summary</p>
            <textarea id="newSummary" rows="2" cols="30" maxLength="60" value={summary} onChange={handleSummary} placeholder="Example: Best purchase ever!"/>
          </div>
          <div>
            <p>Review</p>
              <textarea id="newBody" rows="5" cols="75" maxLength="1000" value={body} onChange={handleBody} minLength="50"/>
          </div>
          {/* Photo Upload */}
          <label>Upload photos of this product
            <input id="uploadPic" type="file" accept="image/*" onChange={handleImage}/>
          </label><br></br>
          {/* Nickname */}
          <label>Enter your nickname:
            <input type="text" maxLength="60" placeholder="Example: Jackson11!" value={reviewer} onChange={handleReviewer}/>
          </label>
          <p>For privacy reasons, do not enter your full name or email address</p>
          {/* email */}
          <label>Email:
            <input id="email" type="text" placeholder="Example: jackson11@email.com" value={email} onChange={handleEmail}/>
          </label>
          <p>For authentication reasons, you will not be emailed</p>
          <input id="submit-review" type="submit" value="Submit Review" />
        </form>
      </div>
    </dialog>

  );
}

import CharacteristicsTable from './CharacteristicsTable.jsx';
export default NewReviewModal;