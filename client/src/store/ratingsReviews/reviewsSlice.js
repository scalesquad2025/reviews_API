import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  reviews: [],
  renderedReviews: [],
  filteredReviews: [],
  error: ''
};

export const fetchReviews = createAsyncThunk('reviews/fetchReviews', async (sortOptions, thunkAPI) => {
  const sortBy = sortOptions || 'relevant';
  const product_id = thunkAPI.getState().products.currentProduct;

  return axios
    .get(`/api/reviews/?product_id=${product_id}&sort=${sortBy}&count=200&page=1`)
    .then((response) => {
        return response.data.results;
    })
})

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    moreReviews:  (state, action) => {
      state.renderedReviews = state.renderedReviews.concat(action.payload);
    },
    filterReviews: (state, action) => {
      state.filteredReviews = state.filteredReviews.concat(action.payload);
    },
    resetFilter: (state, action) => {
      state.filteredReviews = [];
      state.renderedReviews = action.payload;
    },
    resetRendered: (state, action) => {
      state.renderedReviews = [];
      state.renderedReviews = state.renderedReviews.concat(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchReviews.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(fetchReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload;
      state.renderedReviews = action.payload.slice(0, 2);
      state.filteredReviews = [];
      state.error = '';
    })
    builder.addCase(fetchReviews.rejected, (state, action) => {
      state.loading = false;
      state.reviews = [];
      state.renderedReviews = [];
      state.filteredReviews = [];
      state.error = action.error.message;
    })
  }
})

export const { moreReviews, filterReviews, resetFilter, resetRendered } = reviewsSlice.actions;

export default reviewsSlice.reducer;


