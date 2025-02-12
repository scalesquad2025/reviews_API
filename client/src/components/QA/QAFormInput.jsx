import React from 'react';

const QAFormInput = ({ tag = 'input', name, label, mandatory, placeholder, maxLength, value, onChangeHandler, notice }) => {
  return (
    <>
      <label className="qa-form-label">{label}{mandatory && '*'}
        { tag === 'textarea' && <textarea placeholder={placeholder} maxLength={maxLength} value={value} onChange={(e) => onChangeHandler(name, e.target.value)}/>}
        { tag === 'input' && <input type="text" placeholder={placeholder} maxLength={maxLength} value={value} onChange={(e) => onChangeHandler(name, e.target.value)} /> }
      </label>
      { notice && <p className="qa-form-notice">{notice}</p> }
    </>
  )
};

export default QAFormInput;