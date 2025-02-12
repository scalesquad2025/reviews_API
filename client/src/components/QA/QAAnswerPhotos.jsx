import React from 'react';
import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import QAPhoto from './QAPhoto.jsx';

const QAAnswerPhotos = ({ photos }) => {

  const stablePhotoIds = useRef(photos.map((photo) => uuidv4()));

  return (
    <div className="qa-answer-thumbnails-container">
      {
        photos.map((photo, i) => {
          return (
            <QAPhoto photo={photo} key={stablePhotoIds.current[i]} />
          )
        })
      }
    </div>
  )
}

export default QAAnswerPhotos;