import { createSelector } from '@reduxjs/toolkit';

export const selectQuestions = (state) => {
  return state.qa.questions.list;
}

export const selectShowAllQuestions = (state) => {
  return state.qa.questions.showAllQuestions;
}

export const selectSearchQuery = (state) => {
  return state.qa.searchQuery.query;
}

export const selectQuestionsToDisplay= createSelector(
  [selectQuestions, selectShowAllQuestions, selectSearchQuery],
  (questions, showAll, query) => {
    if (query.length > 2) {
      return questions.filter((question) => {
        const answerBodies = Object.values(question.answers).map((answer) => answer.body);

        return (
          question.question_body.toLowerCase().includes(query.toLowerCase()) ||
          answerBodies.some((answerBody) => answerBody.toLowerCase().includes(query.toLowerCase()))
        )

      })
    }
    return showAll ? questions : questions.slice(0, 2);
  }
)

export const selectDisplayShowMoreQuestionsBtn = createSelector(
  [selectQuestionsToDisplay, selectSearchQuery],
  (questions, query) => {
  return (query.length < 3 || questions.length > 2) ? true : false;
  }
)