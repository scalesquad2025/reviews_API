import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchQuestions, toggleShowAllQuestions, showNewQuestionModal } from '../../store/qaSlice.js';
import { selectShowAllQuestions, selectQuestionsToDisplay, selectDisplayShowMoreQuestionsBtn, selectSearchQuery } from './qaSelectors.js';

import QASearch from './QASearch.jsx';
import QAListItem from './QAListItem.jsx';
import QANotification from './QANotification.jsx';

const QAList = () => {
  const productId = useSelector((state) => state.products.currentProduct);
  const questionsStatus = useSelector((state) => state.qa.questions.status);
  const showAllQuestions = useSelector(selectShowAllQuestions); // A Boolean
  const questionsToDisplay = useSelector(selectQuestionsToDisplay);
  const displayShowMoreQuestionsBtn = useSelector(selectDisplayShowMoreQuestionsBtn);
  const query = useSelector(selectSearchQuery);

  const dispatch = useDispatch();

  useEffect(() => {
    if (productId) {
      dispatch(fetchQuestions());
    }
  }, [productId]);

  return (
    <div className="qa-list-container">
      {
        questionsStatus === 'loading' && <QANotification type="loading" msg="Loading questions..." />
      }
      {
        questionsStatus === 'error' && <QANotification type="error" msg="Failed to load questions." />
      }
      {
        questionsStatus === 'success' &&
        <>
          {
            (questionsToDisplay.length > 0 || query.length > 2) &&
            <QASearch />
          }
          {
          questionsToDisplay.length > 0 ? (
              <div  className="qa-questions-list">
                { questionsToDisplay.map((question) => <QAListItem question={question} key={question.question_id} />) }
              </div>
          ) : (
            <QANotification type="notification" msg={query.length > 2 ? 'No matches found.' : 'Be first to ask a question!'} />
          )
          }
          <div className="qa-list-buttons">
            {
            displayShowMoreQuestionsBtn &&
            <button onClick={() => dispatch(toggleShowAllQuestions())}>{showAllQuestions ? 'Collapse Questions' : 'More Answered Questions'}</button>
            }
            <button onClick={() => dispatch(showNewQuestionModal())}>Add a Question <i class="fa-solid fa-plus"></i></button>
          </div>
        </>
      }

    </div>
  )
};

export default QAList;