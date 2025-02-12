import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  detailView: false,
  relatedItems: [],
  relatedItemIds: [],
  currentCardIndex: 0,
  status: 'idle',
  outfit: [],
  error: null,
  relatedItemDetails: [],
  relatedItemURLs: {},
  currentOutfitCardIndex: 0,
  currentProductDetails: {},
  comparisonFeatures: []

}

export const getRelatedItems = createAsyncThunk('products/related', async (_, thunkAPI) => {
  try {
    const productId = thunkAPI.getState().products.currentProduct;
    const response = await axios.get(`/api/products/${productId}/related`)
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
})

export const getRelatedItemDetails = createAsyncThunk('products/related/details', async (productId, thunkAPI) => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message)
    }
})

export const getRelatedItemURLs = createAsyncThunk('products/related/URL', async (productId, thunkAPI) => {
  try {
    const response = await axios.get(`/api/products/${productId}/styles`);

    if (response.data.results[0].photos[0].url === null) {
      var data = {};
      data[productId] = 'https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg';
      return data;
    } else {
      var data = {};
      data[productId] = response.data.results[0].photos[0].url
      return data;
    }
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const getCurrentProductDetails = createAsyncThunk('products/current', async (_, thunkAPI) => {
  try {
    const productId = thunkAPI.getState().products.currentProduct;
    const response = await axios.get(`/api/products/${productId}`)
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
})

export const fetchReviews = createAsyncThunk('relatedItems/fetchReviews', async (productId, thunkAPI) => {
  return axios
    .get(`/api/reviews/?product_id=${productId}&sort=relevant&count=200`)
    .then((response) => {
      return response.data.results;
    })
})

export const relatedItemsSlice = createSlice({
  name: 'relatedItem',
  initialState,
  reducers: {
    showNextCard: (state) => {
      if (state.currentCardIndex !== state.relatedItems.length - 3) {
        return {
          ...state,
          currentCardIndex: state.currentCardIndex + 1
        }
      }
    },
    showPreviousCard: (state) => {
      if (state.currentCardIndex !== 0) {
        state.currentCardIndex -= 1;
      }
    },
    addToOutfit: (state, action) => {
      if (!state.outfit.includes(action.payload)) {
        state.outfit = [...state.outfit, action.payload]
      }
    },
    removeFromOutfit: (state, action) => {
      var index = action.payload;
      state.outfit.splice(index, 1)
    },
    showNextOutfitCard: (state) => {
      if (state.currentOutfitCardIndex !== state.outfit.length - 1) {
        state.currentOutfitCardIndex += 1;
      }
    },
    showPreviousOutfitCard: (state, action) => {
      if (state.currentOutfitCardIndex !== 0) {
        state.currentOutfitCardIndex -= 1;
      }
    },
    clearRelatedItems: (state, action) => {
      state.relatedItems = [];
    },
    clearIndex: (state, action) => {
      state.currentCardIndex = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRelatedItems.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getRelatedItems.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        state.relatedItemIds = action.payload;

      })
      .addCase(getRelatedItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getRelatedItemDetails.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getRelatedItemDetails.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        var comparisonFeatures = action.payload.features
        var comparisonObject = {
          currentObject: comparisonFeatures,
          currentObjectId: action.payload.id
        }
        state.comparisonFeatures = [...state.comparisonFeatures, comparisonObject]
        state.relatedItemDetails = [...state.relatedItemDetails, action.payload];
        state.relatedItems = [...state.relatedItems, action.payload];

      })
      .addCase(getRelatedItemDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getRelatedItemURLs.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getRelatedItemURLs.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        state.relatedItemURLs = {...state.relatedItemURLs, ...action.payload};
      })
      .addCase(getRelatedItemURLs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getCurrentProductDetails.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getCurrentProductDetails.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        var comparisonFeatures = action.payload.features
        var comparisonObject = {
          currentObject: comparisonFeatures,
          currentObjectId: action.payload.id
        }
        state.comparisonFeatures = [...state.comparisonFeatures, comparisonObject];
        state.currentProductDetails = action.payload;
      })
      .addCase(getCurrentProductDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchReviews.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = 'fulfilled'
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
  }
})

export const { showNextCard, showPreviousCard, addToOutfit, clearRelatedItems, showPreviousOutfitCard, showNextOutfitCard, removeFromOutfit, clearIndex } = relatedItemsSlice.actions;

export default relatedItemsSlice.reducer;