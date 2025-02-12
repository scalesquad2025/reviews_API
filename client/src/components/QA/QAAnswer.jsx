import React from 'react';
import { useState, memo } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

import { fetchQuestions } from '../../store/qaSlice.js';

import QAAnswerPhotos from './QAAnswerPhotos.jsx';
import QAHighlightedText from './QAHighlightedText.jsx';

const QAAnswer = memo(({ answer }) => {
  const [helpfulTouched, setHelpfulTouched] = useState(false);
  const [reportTouched, setReportTouched] = useState(false);
  const [isLoadingHelpful, setIsLoadingHelpful] = useState(false);

  const date = format(new Date(answer.date), 'MMMM dd, yyyy');

  const handleHelpfulClick = () => {
    if (helpfulTouched) {
      return;
    }
    setIsLoadingHelpful(true);
    setHelpfulTouched(true);
    axios.put(`/api/qa/answers/${answer.id}/helpful`)
    .then((_response) => {
      setIsLoadingHelpful(false);
    })
    .catch((err) => {
      console.log(err);
      setIsLoadingHelpful(false);
    })
  };

  const handleReportClick = () => {
    if (reportTouched) {
      return;
    }
    setReportTouched(true);
    axios.put(`/api/qa/answers/${answer.id}/report`)
    .then((_response) => {
    })
    .catch((err) => {
      console.log(err);
    })
  }

  return (
    <div className="qa-answer-container">
      <p className="qa-answer">{ <QAHighlightedText text={answer.body} /> }</p>
      {answer.photos.length > 0 && <QAAnswerPhotos photos={answer.photos} />}
      <div className="qa-answer-info-container">
        <div className="qa-answer-info-item">by {answer.answerer_name}, {date}</div>
        <div className="qa-answer-info-item">Helpful? <button className="link-button" onClick={handleHelpfulClick}>Yes</button> ({isLoadingHelpful ? 'Updating...' : helpfulTouched ? answer.helpfulness + 1 : answer.helpfulness})</div>
        <div className="qa-answer-info-item">
          {
            reportTouched ? (
              <span className="qa-reported">Reported</span>
            ) : (
              <button className="link-button" onClick={handleReportClick}>Report</button>
            )
          }
        </div>
      </div>
    </div>
  )
});

export default QAAnswer;