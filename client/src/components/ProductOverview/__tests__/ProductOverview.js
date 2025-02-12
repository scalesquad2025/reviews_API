import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import axios from 'axios';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import ProductOverview from '../ProductOverview.jsx';
import productsReducer from '../../../store/productsSlice.js';
import cartReducer from '../../../store/cartSlice.js';
import { postCart } from '../../../store/cartSlice.js';

const mockProducts = [
  {
    id: 40344,
    campus: "hr-rfp",
    name: "Camo Onesie",
    slogan: "Blend in to your crowd",
    description: "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
    category: "Jackets",
    default_price: "140.00",
    created_at: "2021-08-13T14:38:44.509Z",
    updated_at: "2021-08-13T14:38:44.509Z"
  },
];

const mockProductDetails = {
  id: 40344,
  name: "Camo Onesie",
  category: "Jackets",
  default_price: "140.00",
  features: [
    { feature: "Fabric", value: "Canvas" },
    { feature: "Buttons", value: "Brass" }
  ]
};

const mockProductStyles = {
  product_id: "40344",
  results: [
    {
      style_id: 240500,
      name: "Forest Green & Black",
      original_price: "140.00",
      "default?": true,
      photos: [
        {
          thumbnail_url: "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80",
          url: "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
        },
        {
          thumbnail_url: "https://images.unsplash.com/photo-1534011546717-407bced4d25c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80",
          url: "https://images.unsplash.com/photo-1534011546717-407bced4d25c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2734&q=80"
        },
      ],
      skus: {
        "1394769": { quantity: 8, size: "XS" },
        "1394770": { quantity: 16, size: "S" }
      }
    }
  ]
};

function createTestStore() {
  return configureStore({
    reducer: {
      products: productsReducer,
      cart: cartReducer
    },
    preloadedState: {
      products: {
        currentProduct: 40344,
        productList: [mockProducts],
        productDetails: { '40344': mockProductDetails },
        productStyles: { '40344': mockProductStyles },
        status: 'succeeded',
        error: null
      },
      cart: {
        cart: [],
        status: 'succeeded',
        error: null
      }
    }
  });
}

jest.mock('axios', () => ({
  post: jest.fn(),
}));

describe('ProductOverview Component', () => {
  let store;
  let user;

  beforeEach(() => {
    store = createTestStore();
    user = userEvent.setup();
    global.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders product details correctly', async () => {
    render(
      <Provider store={store}>
        <ProductOverview />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/camo onesie/i)).toBeInTheDocument();
      expect(screen.getByText(/jackets/i)).toBeInTheDocument();
      expect(screen.getByText(/\$140\.00/)).toBeInTheDocument();
    });
  });

  test('displays correct style options', async () => {
    render(
      <Provider store={store}>
        <ProductOverview />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/forest green & black/i)).toBeInTheDocument();
    });
  });

  test('handles size selection', async () => {
    render(
      <Provider store={store}>
        <ProductOverview />
      </Provider>
    );

    await screen.findByText(/camo onesie/i);

    const sizeSelect = screen.getByTestId('size-selector');
    await user.selectOptions(sizeSelect, 'XS');
    expect(sizeSelect).toHaveValue('XS');

    const quantitySelect = screen.getByTestId('quantity-selector');
    expect(quantitySelect).not.toBeDisabled();
  });

  test('handles quantity selection', async () => {
    render(
      <Provider store={store}>
        <ProductOverview />
      </Provider>
    );

    await screen.findByText(/camo onesie/i);

    const sizeSelect = screen.getByTestId('size-selector');
    await user.selectOptions(sizeSelect, 'XS');
    expect(sizeSelect).toHaveValue('XS');

    const quantitySelect = screen.getByTestId('quantity-selector');
    await user.selectOptions(quantitySelect, '2');
    expect(quantitySelect).toHaveValue('2');
  });

  test('handles add to cart', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    render(
      <Provider store={store}>
        <ProductOverview />
      </Provider>
    );

    const sizeSelect = screen.getByTestId('size-selector');
    await user.selectOptions(sizeSelect, 'XS');
    expect(sizeSelect).toHaveValue('XS');

    const quantitySelect = screen.getByTestId('quantity-selector');
    await user.selectOptions(quantitySelect, '2');
    expect(quantitySelect).toHaveValue('2');

    const addToCartButton = screen.getByTestId('add-to-bag-button');
    await user.click(addToCartButton);

    await waitFor(() => {
      const cart = store.getState().cart.cart;
      expect(cart.length).toBe(1);
      expect(cart[0].sku_id).toBe('1394769');
      expect(cart[0].count).toBe(2);
    });
  });
});
