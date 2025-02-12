import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import highlightMatches from './lib/highlightMatches.js';

import { fetchQuestions, showNewAnswerModal } from '../../store/qaSlice.js';

import QAAnswersList from './QAAnswersList.jsx';
import QAHighlightedText from './QAHighlightedText.jsx';


const QAListItem = ({ question }) => {
  const [helpfulTouched, setHelpfulTouched] = useState(false);
  const [isLoadingHelpful, setIsLoadingHelpful] = useState(false);

  const dispatch = useDispatch();

  const handleHelpfulClick = () => {
    if (helpfulTouched) {
      return;
    }
    setIsLoadingHelpful(true);
    setHelpfulTouched(true);
    axios.put(`/api/qa/questions/${question.question_id}/helpful`)
    .then((_response) => {
      setIsLoadingHelpful(false);
    })
    .catch((err) => {
      console.log(err);
      setIsLoadingHelpful(false);
    })
  };

  return (
    <div className="qa-list-item">

      <div className="qa-question-container">
        <div className="qa-question">
          <div>Q:</div>
          <h4>{ <QAHighlightedText text={question.question_body} /> }</h4>

        </div>
        <div className="qa-question-info-container">
          <div className="qa-question-info-item">Helpful? <button className="link-button" onClick={handleHelpfulClick}>Yes</button> ({isLoadingHelpful ? 'Updating...' : helpfulTouched ? question.question_helpfulness + 1 : question.question_helpfulness})</div>
          <div className="qa-question-info-item"><button className="link-button" onClick={() => dispatch(showNewAnswerModal({questionBody: question.question_body, questionId: question.question_id}))}>Add Answer</button></div>
        </div>
      </div>

      <QAAnswersList question={question} />


    </div>
  )
};

export default QAListItem;