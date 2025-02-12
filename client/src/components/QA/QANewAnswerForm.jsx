import React from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import validateFormData from './lib/validateFormData.js';
import { addAnswer } from '../../store/qaSlice.js';

import QAFormInput from './QAFormInput.jsx';
import QAPhotoUploader from './QAPhotoUploader.jsx';
import QANotification from './QANotification.jsx';

const QANewAnswerForm = () => {
  const productId = useSelector((state) => state.products.currentProduct);
  const productName = useSelector((state) => state.products.productDetails[productId].name);
  const question = useSelector((state) => state.qa.newAnswerForm.question);

  const newAnswerFormStatus = useSelector((state) => state.qa.newAnswerForm.status);

  const initialFormState = {
    answer: '',
    nickname: '',
    email: '',
    photos: [],
    thumbnails: []
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errMsg, setErrMsg] = useState('');

  const dispatch = useDispatch();

  const handleInputChange = (name, value) => {
    setFormData((formData) => {
      return {
        ...formData,
        [name]: value
      }
    });
  };


  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrMsg('');

    const errStr = validateFormData(formData);
    if (errStr !== '') {
      setErrMsg(errStr);
    } else {
      dispatch(addAnswer(formData));
      setFormData(initialFormState);
    }
  }

  return (
    <div className="qa-form-wrapper">
      {
        (newAnswerFormStatus === 'active' ||  newAnswerFormStatus === 'loading') && (
          <>
            <h4 className="qa-modal-title">Submit Your Answer <span className="qa-modal-subtitle">{productName}: {question}</span></h4>
            <form onSubmit={handleFormSubmit}>
              <QAFormInput
              tag="textarea"
              name="answer"
              label="Your answer"
              mandatory={true}
              placeholder="Please type your answer..."
              maxLength={1000}
              value={formData.answer}
              onChangeHandler={handleInputChange}
              />

              <QAFormInput
              name={"nickname"}
              label="Your nickname"
              mandatory={true}
              placeholder="Example: jack543!"
              maxLength={60}
              value={formData.nickname}
              onChangeHandler={handleInputChange}
              notice="For privacy reasons, do not use your full name or email address"
              />

              <QAFormInput
              name={"email"}
              label="Your email"
              mandatory={true}
              placeholder="Example: jack@email.com"
              maxLength={60}
              value={formData.email}
              onChangeHandler={handleInputChange}
              notice="For authentication reasons, you will not be emailed"
              />

              <QAPhotoUploader formPhotos={formData.photos} formThumbnails={formData.thumbnails} setFormData={setFormData} />

              {
                errMsg &&
                <div className="qa-form-err-msg-container">
                  <p className="qa-form-err-msg-title">You must enter the following:</p>
                  <div>{ errMsg.split('\n').map((msg, i) => <p className="qa-form-err-msg" key={i}>{msg}</p>) }</div>
                </div>
              }

              <button className="qa-submit-btn" disabled={newAnswerFormStatus === 'loading'}>{newAnswerFormStatus === 'loading' ? 'Submitting your answer...' : 'Submit answer'}</button>
            </form>
          </>
        )
      }

      {
        newAnswerFormStatus === 'success' && (
          <QANotification type="success" msg="Thank you for submitting your answer!" />
        )
      }

      {
        newAnswerFormStatus === 'error' && (
          <QANotification type="error" msg="Your answer was not added. Please try again." />
        )
      }
    </div>
  )
};

export default QANewAnswerForm;