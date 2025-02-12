import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';

import QAModals from '../QAModals.jsx';
import QANewQuestionForm from '../QANewQuestionForm.jsx';
import QANewAnswerForm from '../QANewAnswerForm.jsx';
import QANotification from '../QANotification.jsx';
import QAPhotoUploader from '../QAPhotoUploader.jsx';
import validateFormData from '../lib/validateFormData.js';
import QAFormInput from '../QAFormInput.jsx';


//state.qa.newAnswerForm.question
const initialState = {
  qa: {
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
  },
  products: {
    currentProduct:
    40348,
    productDetails: {
     '40348': {
      name: 'Test Product Name'
     }
    }
  }
};

const mockStore = configureStore([thunk]);

// QAModals Component
describe('QAModals Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  })

  test('Displays QANewQuestionForm component when showNewQuestionModal state is true', () => {
    const newState = {
      ...initialState,
      qa: {
        ...initialState.qa,
        newQuestionModal: {
          show:true
        }
      }
    }
    render(
      <Provider store={mockStore(newState)}>
        <QAModals />
      </Provider>
    )
    expect(screen.getByText('Ask Your Question')).toBeInTheDocument();
  });

  test('Displays QANewAnswerForm component when showNewAnswerModal state is true', () => {
    const newState = {
      ...initialState,
      qa: {
        ...initialState.qa,
        newAnswerModal: {
          show:true
        }
      }
    }
    render(
      <Provider store={mockStore(newState)}>
        <QAModals />
      </Provider>
    )
    expect(screen.getByText('Submit Your Answer')).toBeInTheDocument();
  });
});

// QA Notification
describe('QANotification Component', () => {
  test('Returns a div element with a correct classname corresponding to the type of the notification', () => {
    const {container} = render(
      <QANotification type="error" msg='Test message' />
    )
    const notificationDiv = container.querySelector('div');

    expect(notificationDiv).toHaveClass('qa-notification-error');
    expect(screen.getByText('Test message')).toBeInTheDocument();
  })
});

QAPhotoUploader
describe('QAPhotoUploader Component', () => {
  test('Uploads a photo and updates form data', async () => {
    const mockSetFormData = jest.fn();

    render(
      <QAPhotoUploader formPhotos={[]} formThumbnails={[]} setFormData={mockSetFormData} />
    )

    const file = new File(['photo'], 'photo.jpg', {type: 'image/jpeg'});
    const input = screen.getByLabelText(/Upload a photo/i);

    fireEvent.change(input, { target: { files: [file] } });

    const loadingMessage = await screen.findByText(/Uploading your photo. Please wait.../i);

    expect(loadingMessage).toBeInTheDocument();

    await waitFor(() => {
      expect(mockSetFormData).toHaveBeenCalledWith(
        expect.objectContaining({
          photos: expect.any(Array),
          thumbnails: expect.any(Array)
        })
      );
    });
  })
})

// validateFormData
describe('validateFormData helper function', () => {
  test('Returns correct error message', () => {
    const testData = {
      'name': '',
      'email': 'test'
    }
    expect(validateFormData(testData)).toBe('Your name.\nYour email in correct format.\n');
  })
});

// QAFormInput
describe('QAFormInput Component', () => {
  test('Displays correct label and placeholder of the input element', () => {
    const onChangeMock = jest.fn();
    render(
      <QAFormInput tag={'input'} name={'firstName'} label={'First Name'} mandatory={true} placeholder={'Enter your first name'} maxLength={60} value={''} onChangeHandler={onChangeMock} notice={'Some notice'} />
    )
    const input = screen.getByRole('textbox');
    expect(screen.getByLabelText('First Name*')).toBeInTheDocument();
    expect(screen.getByText('Some notice')).toBeInTheDocument();
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Andrew' } });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(expect.objectContaining({ target: { value: 'Andrew' } }));
  })

  test('Displays correct label and placeholder of the textarea element', () => {
    const onChangeMock = jest.fn();
    render(
      <QAFormInput tag={'textarea'} name={'firstName'} label={'First Name'} mandatory={true} placeholder={'Enter your first name'} maxLength={60} value={''} onChangeHandler={jest.fn()} notice={'Some notice'} />
    )
    const textarea = screen.getByRole('textbox');
    expect(screen.getByLabelText('First Name*')).toBeInTheDocument();
    expect(screen.getByText('Some notice')).toBeInTheDocument();
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: 'Testing' } });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(expect.objectContaining({ target: { value: 'Testing' } }));
  })
})