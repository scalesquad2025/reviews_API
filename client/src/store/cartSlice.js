
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
  cart: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
}

export const getCart = createAsyncThunk('cart/getCart', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/cart', {
    })
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
})

export const postCart = createAsyncThunk('cart/postCart', async ({ sku_id, count }, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/cart', { sku_id, count })
    return { response: response.data, sku_id: sku_id, count: Number(count) };
  } catch (err) {
    return rejectWithValue(err.message);
  }
})

export const putCart = createAsyncThunk('cart/putCart', async ({ sku_id }, { rejectWithValue }) => {
  try {
    const response = await axios.put('/api/cart', { sku_id })
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    loadCart(state, action) {
      state.cart = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, state => {
        state.status = 'loading';
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(postCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { sku_id, count } = action.payload;
        const item = state.cart.find(item => item.sku_id === sku_id);
        if (item) item.count += count;
        else state.cart.push({ sku_id, count });
      })
      .addCase(putCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { sku_id, count } = action.payload;
        const item = state.cart.find(item => item.sku_id === sku_id);
        if (item) {
          item.count--;
          if (item.count <= 0) {
            state.cart = state.cart.filter(element => element.sku_id !== sku_id);
          }
        }
      })
  }
});


export const { loadCart } = cartSlice.actions;

export default cartSlice.reducer;