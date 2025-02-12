import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import RelatedItems from '../RelatedItems.jsx'
import ComparisonCard from '../ComparisonCard.jsx';
import addToOutfit from '../../../store/relatedItemsSlice.js';

const relatedItemIds = [
  40344,
  40345,
  40347,
  40348,
  40351
]

const relatedItemDetails = [
  {
    "id": 40344,
    "campus": "hr-rfp",
    "name": "Camo Onesie",
    "slogan": "Blend in to your crowd",
    "description": "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
    "category": "Jackets",
    "default_price": "140.00",
    "created_at": "2021-08-13T14:38:44.509Z",
    "updated_at": "2021-08-13T14:38:44.509Z",
    "features": [
        {
            "feature": "Fabric",
            "value": "Canvas"
        },
        {
            "feature": "Buttons",
            "value": "Brass"
        }
    ]
},
{
  "id": 40345,
  "campus": "hr-rfp",
  "name": "Bright Future Sunglasses",
  "slogan": "You've got to wear shades",
  "description": "Where you're going you might not need roads, but you definitely need some shades. Give those baby blues a rest and let the future shine bright on these timeless lenses.",
  "category": "Accessories",
  "default_price": "69.00",
  "created_at": "2021-08-13T14:38:44.509Z",
  "updated_at": "2021-08-13T14:38:44.509Z",
  "features": [
      {
          "feature": "Lenses",
          "value": "Ultrasheen"
      },
      {
          "feature": "UV Protection",
          "value": null
      },
      {
          "feature": "Frames",
          "value": "LightCompose"
      }
  ]
},
{
  "id": 40347,
  "campus": "hr-rfp",
  "name": "Slacker's Slacks",
  "slogan": "Comfortable for everything, or nothing",
  "description": "I'll tell you how great they are after I nap for a bit.",
  "category": "Pants",
  "default_price": "65.00",
  "created_at": "2021-08-13T14:38:44.509Z",
  "updated_at": "2021-08-13T14:38:44.509Z",
  "features": [
      {
          "feature": "Fabric",
          "value": "99% Cotton 1% Elastic"
      },
      {
          "feature": "Cut",
          "value": "Loose"
      }
  ]
}
]

const currentProductDetails = {
  "id": 40347,
  "campus": "hr-rfp",
  "name": "Slacker's Slacks",
  "slogan": "Comfortable for everything, or nothing",
  "description": "I'll tell you how great they are after I nap for a bit.",
  "category": "Pants",
  "default_price": "65.00",
  "created_at": "2021-08-13T14:38:44.509Z",
  "updated_at": "2021-08-13T14:38:44.509Z",
  "features": [
      {
          "feature": "Fabric",
          "value": "99% Cotton 1% Elastic"
      },
      {
          "feature": "Cut",
          "value": "Loose"
      }
  ]
}

const comparisonProductDetails = {
  "id": 40348,
  "campus": "hr-rfp",
  "name": "Heir Force Ones",
  "slogan": "A sneaker dynasty",
  "description": "Now where da boxes where I keep mine? You should peep mine, maybe once or twice but never three times. I'm just a sneaker pro, I love Pumas and shell toes, but can't nothin compare to a fresh crispy white pearl",
  "category": "Kicks",
  "default_price": "99.00",
  "created_at": "2021-08-13T14:38:44.509Z",
  "updated_at": "2021-08-13T14:38:44.509Z",
  "features": [
      {
          "feature": "Sole",
          "value": "Rubber"
      },
      {
          "feature": "Material",
          "value": "FullControlSkin"
      },
      {
          "feature": "Mid-Sole",
          "value": "ControlSupport Arch Bridge"
      },
      {
          "feature": "Stitching",
          "value": "Double Stitch"
      }
  ]
}

const comparisonFeatures = [
  {
    currentObject: [
      {
          "feature": "Fabric",
          "value": "99% Cotton 1% Elastic"
      },
      {
          "feature": "Cut",
          "value": "Loose"
      }
  ],
    currentObjectId: 40347
  },
  {
    currentObject: [
      {
          "feature": "Sole",
          "value": "Rubber"
      },
      {
          "feature": "Material",
          "value": "FullControlSkin"
      },
      {
          "feature": "Mid-Sole",
          "value": "ControlSupport Arch Bridge"
      },
      {
          "feature": "Stitching",
          "value": "Double Stitch"
      }
  ],
    currentObjectId: 40348
  }

]



jest.mock('axios');

const mockStore = configureStore([thunk]);

const initialState = {
  relatedItems: {
    detailView: false,
    relatedItems: relatedItemDetails,
    relatedItemIds: relatedItemIds,
    currentCardIndex: 0,
    status: 'idle',
    outfit: [
      {category: 'Jackets', name: 'Camo Onesie', price: '140.00'},
      {category: 'Accessories', name: 'Bright Future Sunglasses', price: '69.00'},
      {category: 'Pants', name: "Slacker's Slacks", price: '65.00'}
    ],
    error: null,
    relatedItemDetails: [],
    currentProductDetails: currentProductDetails,
    comparisonFeatures: comparisonFeatures
  },
  products: { currentProduct: 40347 }
};

describe('Add to Outfit reducer', () => {
  it('should add an outfit to outfit array', () => {
    const initialState = { outfit:
      [{category: 'Accessories', name: 'Bright Future Sunglasses', price: '69.00'}]};
    const action = {
      type: 'relatedItem/addToOutfit',
      payload: {category: 'Jackets', name: 'Camo Onesie', price: '140.00'}
    }
    const expectedState = {outfit: [{category: 'Accessories', name: 'Bright Future Sunglasses', price: '69.00'}, {category: 'Jackets', name: 'Camo Onesie', price: '140.00'}]}
    expect(addToOutfit(initialState, action)).toEqual(expectedState)

  })

})

describe('RelatedItems', () => {
  let store;
  let user;

  beforeEach(() => {
    store = mockStore(initialState);
    user = userEvent.setup();
  })

  test('renders related item names on cards', async () => {
    render(
      <Provider store={store}>
        <RelatedItems />
      </Provider>
    );

    expect(screen.getAllByText('Camo Onesie')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Bright Future Sunglasses')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Slacker\'s Slacks')[0]).toBeInTheDocument();
  });

  test('renders related item prices on cards', async () => {
    render(
      <Provider store={store}>
        <RelatedItems />
      </Provider>
    );

    expect(screen.getByText('140.00')).toBeInTheDocument();
    expect(screen.getByText('69.00')).toBeInTheDocument();
    expect(screen.getByText('65.00')).toBeInTheDocument();
  });

  test('renders comparison cards', async () => {
    render(
      <Provider store = {store}>
        <ComparisonCard item = {comparisonProductDetails}/>
      </Provider>
    )
    expect(screen.getByText('Mid-Sole')).toBeInTheDocument();
    expect(screen.getByText('Double Stitch')).toBeInTheDocument();
    expect(screen.getByText('FullControlSkin')).toBeInTheDocument();
    expect(screen.getByText('99% Cotton 1% Elastic')).toBeInTheDocument();
  })


});

