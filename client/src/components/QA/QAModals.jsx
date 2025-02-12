import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideNewQuestionModal, hideNewAnswerModal } from '../../store/qaSlice.js';

import QAModal from './QAModal.jsx';
import QANewQuestionForm from './QANewQuestionForm.jsx';
import QANewAnswerForm from './QANewAnswerForm.jsx';

const QAModals = () => {
  const showNewQuestionModal = useSelector((state) => state.qa.newQuestionModal.show);
  const showNewAnswerModal = useSelector((state) => state.qa.newAnswerModal.show);

  const dispatch = useDispatch();

  return (
      <>
        {
          showNewQuestionModal &&
          <QAModal closeModalHandler={() => dispatch(hideNewQuestionModal())}>
            <QANewQuestionForm />
          </QAModal>
        }

        {
          showNewAnswerModal &&
          <QAModal closeModalHandler={() => dispatch(hideNewAnswerModal())}>
            <QANewAnswerForm />
          </QAModal>
        }
      </>
  )

};

export default QAModals;