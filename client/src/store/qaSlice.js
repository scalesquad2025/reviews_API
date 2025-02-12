import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// THUNKS
export const fetchQuestions = createAsyncThunk(
  'qa/fetchQuestions',
  async (_, thunkAPI) => {
    const productId = thunkAPI.getState().products.currentProduct;
    try {
      const response = await axios.get(`/api/qa/questions?product_id=${productId}&page=1&count=500`);
      return response.data;
    } catch(err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const addQuestion = createAsyncThunk(
  'qa/addQuestion',
  async (formData, thunkAPI) => {
    const productId = Number(thunkAPI.getState().products.currentProduct);
    const question = {
      body: formData.question,
      name: formData.nickname,
      email: formData.email,
      product_id: productId
    }
    console.log(question);
    try {
      const response = await axios.post('/api/qa/questions', question);
      return response.data;
    } catch(err) {
      return thunkAPI.rejectWithValue(err.message);
    }

  }
);

export const addAnswer = createAsyncThunk(
  'qa/addAnswer',
  async (formData, thunkAPI) => {
    const questionId = thunkAPI.getState().qa.newAnswerForm.questionId;
    const answer = {
      body: formData.answer,
      name: formData.nickname,
      email: formData.email,
      photos: formData.photos
    }
    try {
      const response = await axios.post(`/api/qa/questions/${questionId}/answers`, answer);
      return response.data;
    } catch(err) {
      return thunkAPI.rejectWithValue(err.message);
    }

  }
);

const initialState = {
  questions: {
    productId: null,
    list: [],
    // idle, loading, success, error
    status: 'idle',
    showAllQuestions: false
  },
  searchQuery: {
    query: ''
  },
  newQuestionModal: {
    show: false,
  },
  newAnswerModal: {
    show: false,
  },
  newQuestionForm: {
    // active, loading, success, error
    status: 'active'
  },
  newAnswerForm: {
    // active, loading, success, error
    status: 'active',
    question: '',
    questionId: null
  }
}

export const qaSlice = createSlice({
  name: 'qa',
  initialState,
  reducers: {
    // Search:
    setSearchQuery: (state, action) => {
      state.searchQuery.query = action.payload;
    },
    // Questions:
    setShowAllQuestions: (state, action) => {
      state.questions.showAllQuestions = action.payload;
    },
    toggleShowAllQuestions: (state) => {
      state.questions.showAllQuestions = !state.questions.showAllQuestions;
    },
    // Modals:
    showNewQuestionModal: (state) => {
      state.newQuestionModal.show = true;
    },
    hideNewQuestionModal: (state) => {
      state.newQuestionModal.show = false;
      state.newQuestionForm.status = 'active';
    },
    showNewAnswerModal: (state, action) => {
      state.newAnswerModal.show = true;
      state.newAnswerForm.question = action.payload.questionBody;
      state.newAnswerForm.questionId = action.payload.questionId;
    },
    hideNewAnswerModal: (state) => {
      state.newAnswerModal.show = false;
      state.newAnswerForm.status = 'active';
    }
  },
  extraReducers: (builder) => {
    // Fetch Questions
    builder.addCase(fetchQuestions.pending, (state) => {
      state.questions.status = 'loading';
    });
    builder.addCase(fetchQuestions.fulfilled, (state, action) => {
      state.questions.list = action.payload.results;
      state.questions.productId = action.payload.product_id;
      state.questions.status = 'success';
    });
    builder.addCase(fetchQuestions.rejected, (state, action) => {
      console.log('Failed to fetch questions.', action.payload);
      state.questions.status = 'error';
    });

    // Add a Question
    builder.addCase(addQuestion.pending, (state) => {
      state.newQuestionForm.status = 'loading';
    });
    builder.addCase(addQuestion.fulfilled, (state) => {
      state.newQuestionForm.status = 'success';
    });
    builder.addCase(addQuestion.rejected, (state, action) => {
      console.log('Failed to add a question.', action.payload);
      state.newQuestionForm.status = 'error';
    });

    // Add an Answer
    builder.addCase(addAnswer.pending, (state) => {
      state.newAnswerForm.status = 'loading';
    });
    builder.addCase(addAnswer.fulfilled, (state) => {
      state.newAnswerForm.status = 'success';
    });
    builder.addCase(addAnswer.rejected, (state, action) => {
      console.log('Failed to submit an answer.', action.payload);
      state.newAnswerForm.status = 'error';
    });
  }
})

export const { setSearchQuery, setShowAllQuestions, toggleShowAllQuestions, showNewQuestionModal, hideNewQuestionModal, showNewAnswerModal, hideNewAnswerModal } = qaSlice.actions;

export default qaSlice.reducer;