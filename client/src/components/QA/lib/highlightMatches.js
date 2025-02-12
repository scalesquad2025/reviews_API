import React from 'react';

const highlightMatches = (text, query) => {

  const splittedText = text.split(new RegExp(`(${query})`, 'gi'));

  return splittedText.map((el, index) => {
    return el.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="qa-search-match">{el}</span>
    ) : (
      el
    )
  }
  );
};

export default highlightMatches;