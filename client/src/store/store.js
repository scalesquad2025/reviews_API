import { configureStore } from '@reduxjs/toolkit';
import reviewsReducer from './ratingsReviews/reviewsSlice.js';
import newReviewFormReducer from './ratingsReviews/newReviewFormSlice.js';
import productBreakdownReducer from './ratingsReviews/productBreakdownSlice.js';
import relatedItemsReducer from './relatedItemsSlice.js';
import qaReducer from './qaSlice.js';
import productsReducer from './productsSlice.js';
import cartReducer from './cartSlice.js';


export const store = configureStore({
  reducer: {
    reviews: reviewsReducer,
    newReviewForm: newReviewFormReducer,
    productBreakdown: productBreakdownReducer,
    relatedItems: relatedItemsReducer,
    qa: qaReducer,
    products: productsReducer,
    cart: cartReducer,
  }
});