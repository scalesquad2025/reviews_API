import React from 'react';

const ReviewImageModal = ({photo, setImageModal, setImageURL}) => {

  const handleClose = () => {
    setImageModal(false);
    setImageURL('');
  }

  return (
    <dialog className="reviewImageModal" open>
      <button onClick={handleClose}>Close Window</button>
      <img src={photo}/>
    </dialog>
  );
}

export default ReviewImageModal;