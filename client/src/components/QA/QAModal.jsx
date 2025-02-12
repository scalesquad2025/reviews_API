import React from 'react';

const QAModal = ({ children, closeModalHandler }) => {

  return (
    <div className="qa-modal-background">
      <div className="qa-modal-container">
        <button className="qa-btn-close-modal" onClick={closeModalHandler}><i class="fa-solid fa-xmark"></i></button>
        {children}
      </div>
    </div>
  )
};

export default QAModal;