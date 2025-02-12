import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectSearchQuery } from './qaSelectors.js';

import QAAnswer from './QAAnswer.jsx';

const QAAnswersList = ({ question }) => {
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const query = useSelector(selectSearchQuery);
  const answers = Object.keys(question.answers).map((answerId) => question.answers[answerId]).sort((a, b) => b.helpfulness - a.helpfulness);

  let answersToDisplay = answers;

  if (query.length > 2) {
    answersToDisplay = answers.filter((answer) => {
      return answer.body.toLowerCase().includes(query.toLowerCase());
    })
  } else if (!showAllAnswers) {
    answersToDisplay = answers.slice(0, 2);
  }

  const handleLoadAnswersClick = () => {
    setShowAllAnswers((prev) => !prev);
  }

  return (
    <div className="qa-answers-list-container">
      {
          answers.length > 0 && (
            <>
              <div className="qa-a">A:</div>
              <div>

                <div className="qa-answers-list">
                  {
                    answersToDisplay.map((answer) => {
                      return (
                        <QAAnswer answer={answer} key={answer.id} />
                      )
                    })
                  }

                  {
                    answers.length > 2 && query.length < 3 && (
                      <div>
                        <button className="qa-more-answers-btn" onClick={handleLoadAnswersClick}>{showAllAnswers ? 'Collapse answers' : 'Load more answers'}</button>
                      </div>
                    )
                  }
                </div>

              </div>
            </>
          )
      }
    </div>
  )
};

export default QAAnswersList;