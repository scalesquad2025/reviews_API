import React from 'react';
import { useSelector } from 'react-redux';
import highlightMatches from './lib/highlightMatches.js';

import { selectSearchQuery } from './qaSelectors.js';

const QAHighlightedText = ({ text }) => {
  const query = useSelector(selectSearchQuery);

  return query.length > 2 ? highlightMatches(text, query) : text;
}

export default QAHighlightedText;