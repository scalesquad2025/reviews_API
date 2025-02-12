import React from 'react';
import { useState } from 'react';

import QAModal from './QAModal.jsx';

const QAPhoto = ({ photo }) => {
  const [expandPhoto, setExpandPhoto] = useState(false);
  const imgSrc = photo.includes('cloudinary.com') ? photo.replace(/v\d+/, 'c_fill,w_90,h_60') : photo;

  const handlePhotoClick = () => {
    setExpandPhoto(true);
  }

  return (
    <>
      {
        expandPhoto && (
          <QAModal closeModalHandler={() => setExpandPhoto(false)}>
          <div className="qa-fullsize-img-container">
          <img className="qa-fullsize-img" src={photo} />
          </div>
          </QAModal>
        )
      }
      <div className="qa-answer-thumbnail-container">
        <img className="qa-answer-thumbnail" src={imgSrc} onClick={handlePhotoClick} />
      </div>
    </>
  )
}

export default QAPhoto;