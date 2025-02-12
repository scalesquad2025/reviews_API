import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { fetchReviews } from '../../store/ratingsReviews/reviewsSlice.js';
import axios from 'axios';


// import components
import RatingBreakdown from './ratingBreakdown.jsx';
import ProductBreakdown from './productBreakdown.jsx';
import ReviewList from './reviewList.jsx';
import CharacteristicsTable from './CharacteristicsTable.jsx';
import ReviewImageModal from './ReviewImageModal.jsx';
import NewReviewModal from './newReviewModal.jsx';
import Breakdowns from './breakdowns.jsx';

const mockReviews = {
  reviews: [
    {
        "review_id": 1280449,
        "rating": 5,
        "summary": "I love it",
        "recommend": false,
        "response": null,
        "body": "Nothing beats it!",
        "date": "2023-08-22T00:00:00.000Z",
        "reviewer_name": "John",
        "helpfulness": 3,
        "photos": []
    },
    {
        "review_id": 1280776,
        "rating": 1,
        "summary": "HORRRIBLE",
        "recommend": false,
        "response": null,
        "body": "dont waste your time or money...",
        "date": "2023-11-30T00:00:00.000Z",
        "reviewer_name": "CC",
        "helpfulness": 1,
        "photos": []
    },
    {
        "review_id": 1280783,
        "rating": 5,
        "summary": "dasdfdsfa",
        "recommend": true,
        "response": null,
        "body": "fdsfadsdfsads",
        "date": "2023-12-01T00:00:00.000Z",
        "reviewer_name": "dsfadsfdsa",
        "helpfulness": 1,
        "photos": [
            {
                "id": 2459234,
                "url": "blob:http://13.56.234.9:3000/031772f0-cd90-4089-8be2-c2fb97bc0c0b"
            }
        ]
    },
    {
        "review_id": 1280796,
        "rating": 4,
        "summary": "This is a demo",
        "recommend": true,
        "response": null,
        "body": "This is a demo",
        "date": "2023-12-03T00:00:00.000Z",
        "reviewer_name": "demo",
        "helpfulness": 0,
        "photos": []
    },
    {
        "review_id": 1280784,
        "rating": 5,
        "summary": "dffsfd",
        "recommend": true,
        "response": null,
        "body": "ddsfsdfsdf",
        "date": "2023-12-01T00:00:00.000Z",
        "reviewer_name": "sdfsdfsdf",
        "helpfulness": 0,
        "photos": []
    }
  ],
  renderedReviews: [
    {
      "review_id": 1280449,
      "rating": 5,
      "summary": "I love it",
      "recommend": false,
      "response": null,
      "body": "Nothing beats it!",
      "date": "2023-08-22T00:00:00.000Z",
      "reviewer_name": "John",
      "helpfulness": 3,
      "photos": []
  },
  {
      "review_id": 1280776,
      "rating": 1,
      "summary": "HORRRIBLE",
      "recommend": false,
      "response": null,
      "body": "dont waste your time or money...",
      "date": "2023-11-30T00:00:00.000Z",
      "reviewer_name": "CC",
      "helpfulness": 1,
      "photos": []
  }
  ],
  filteredReviews: []
};

const mockChars = {
    characteristics: {
          "Fit": {
              "id": 135228,
              "value": "2.6790123456790123"
          },
          "Length": {
              "id": 135229,
              "value": "3.3086419753086420"
          },
          "Comfort": {
              "id": 135230,
              "value": "3.5617977528089888"
          },
          "Quality": {
              "id": 135231,
              "value": "3.7586206896551724"
          }
      }
}



const initialState = {
  reviews: mockReviews,
  productBreakdown: mockChars,
  products: { currentProduct: 40347 },
  newReviewForm: { formOpen : true }
}

jest.mock('axios');

const mockStore = configureStore([thunk]);

describe('Rating Breakdown', () => {
  let store;
  let user;

  beforeEach(() => {
    store = mockStore(initialState);
    user = userEvent.setup();
  })

  test('renders rating breakdown', async () => {
    render(
      <Provider store={store}>
        <RatingBreakdown />
      </Provider>
    );
    // avg rating of mockReviews is 4
    expect(screen.getByText(4)).toBeInTheDocument();
  });

  test('renders 1 progress bar to represent each star rating', async () => {
    render(
      <Provider store={store}>
        <RatingBreakdown />
      </Provider>
    );

    const bars = screen.getAllByTestId('star-bar');
    expect(bars.length).toBe(5);
  })

  test('renders % of customers who recommend product', async () => {
    render(
      <Provider store={store}>
        <RatingBreakdown />
      </Provider>
    );
    // 60% of the reviews recommend the product
    expect(screen.getByText('60% of reviews recommend this product')).toBeInTheDocument();
  })
});

describe('Characteristic Table', () => {
  let store;
  let user;

  beforeEach(() => {
    store = mockStore(initialState);
    user = userEvent.setup();
  })

  test('renders correct characteristics in table', async () => {
    render(
      <Provider store={store}>
        <CharacteristicsTable />
      </Provider>
    );

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    const fitRow = screen.getByRole('row', { name : /Fit/i });
    const lengthRow = screen.getByRole('row', { name : /Length/i });
    const comfortRow = screen.getByRole('row', { name : /Comfort/i });
    const qualityRow = screen.getByRole('row', { name : /Quality/i });

    expect(fitRow).toBeInTheDocument();
    expect(lengthRow).toBeInTheDocument();
    expect(comfortRow).toBeInTheDocument();
    expect(qualityRow).toBeInTheDocument();
  })
});

describe('New Review Modal', () => {
  let store;
  let user;

  beforeEach(() => {
    store = mockStore(initialState);
    user = userEvent.setup();
  })

  test('renders modal when form is open', async () => {
    render(
      <Provider store={store}>
        <NewReviewModal />
      </Provider>
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
  })

  test('renders a button to close modal without submitting a review', async () => {
    render(
      <Provider store={store}>
        <NewReviewModal />
      </Provider>
    );

    const button = screen.getByTestId('close-modal-btn');
    expect(button).toBeInTheDocument();

  })
});

describe('Review Image Modal', () => {
  let store;
  let user;

  beforeEach(() => {
    store = mockStore(initialState);
    user = userEvent.setup();
  })

  test('renders modal for image when formOpen is true', async () => {
    render(
      <Provider store={store}>
        <ReviewImageModal />
      </Provider>
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
  })

  test('renders a button to close the modal', async () => {
    render(
      <Provider store={store}>
        <ReviewImageModal />
      </Provider>
    );

    const buttonText = screen.getByText('Close Window');
    expect(buttonText).toBeInTheDocument();
  })
});


describe('Review List', () => {
  let store;
  let user;

  beforeEach(() => {
    store = mockStore(initialState);
    user = userEvent.setup();
  })

  test('renders first 2 reviews from review list', async () => {
    const mockData = { data : { results : mockReviews.reviews}};
    axios.get.mockResolvedValueOnce(mockData);
    await store.dispatch(fetchReviews());

    render(
      <Provider store={store}>
        <ReviewList />
      </Provider>
    );

    await waitFor(() => {
      const reviews = screen.getAllByTestId('review-tile');
      expect(reviews.length).toBe(2);
    })
  })

  test('renders # of reviews in list', async () => {
    const mockData = { data : { results : mockReviews.reviews}};
    axios.get.mockResolvedValueOnce(mockData);
    await store.dispatch(fetchReviews());

    render(
      <Provider store={store}>
        <ReviewList />
      </Provider>
    );

    await waitFor(() => {
      const reviewCount = screen.getByText('5 reviews, sorted by');
      expect(reviewCount).toBeInTheDocument();
    })
  })
})

describe('Product Breakdown', () => {
  let store;
  let user;

  beforeEach(() => {
    store = mockStore(initialState);
    user = userEvent.setup();
  })

  test('renders correct characteristics for current product', async () => {
    const mockData = { data : { characteristics : mockChars.characteristics}};
    axios.get.mockResolvedValueOnce(mockData);
    await store.dispatch(fetchReviews());

    render(
      <Provider store={store}>
        <ProductBreakdown />
      </Provider>
    );

    const breakdowns = screen.getAllByTestId('product-breakdown');
    expect(breakdowns.length).toBe(4);
  })
})