import { createSlice } from '@reduxjs/toolkit';



const initialState = {
  formOpen: false
};

const newReviewFormSlice = createSlice({
  name: 'newReviewForm',
  initialState,
  reducers: {
    isFormOpen: (state) => {
      state.formOpen = !state.formOpen;
    }
  }
});

export const { isFormOpen } = newReviewFormSlice.actions;

export default newReviewFormSlice.reducer;