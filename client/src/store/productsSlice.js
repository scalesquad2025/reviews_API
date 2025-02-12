import { createSlice, createAsyncThunk, thunkAPI } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  currentProduct: 40347,
  productList: [],
  productDetails: {},
  productStyles: {},
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
}

export const getProducts = createAsyncThunk('products/getProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/products')
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const getProductDetails = createAsyncThunk('products/getProductDetails', async (_, { rejectWithValue, getState }) => {
  try {
    const productId = getState().products.currentProduct;
    const response = await axios.get(`/products/${productId}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});


export const getProductStyles = createAsyncThunk('products/getProductStyles', async (_, { rejectWithValue, getState }) => {
  try {
    const productId = getState().products.currentProduct;
    const response = await axios.get(`/products/${productId}/styles`)
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});


export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    loadProducts(state, action) {
      state.list = action.payload;
    },
    //adding a reducer here to handle clicking on related item card - bonnie
    setCurrentProduct(state, action) {
      return {
        ...state,
        currentProduct: action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, state => {
        state.status = 'loading';
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productList = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getProductDetails.pending, state => {
        state.status = 'loading';
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // state.currentProduct = action.payload.id || state.currentProduct;
        state.productDetails[state.currentProduct] = action.payload;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getProductStyles.pending, state => {
        state.status = 'loading';
      })
      .addCase(getProductStyles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // state.currentProduct = action.payload.product_id || state.currentProduct;
        state.productStyles[state.currentProduct] = action.payload;
      })
      .addCase(getProductStyles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
  }
});

//adding a reducer here to handle clicking on related item card - bonnie

export const { loadProducts, setCurrentProduct } = productsSlice.actions;

export default productsSlice.reducer;