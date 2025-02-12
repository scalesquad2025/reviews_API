import React from 'react';
import App from './components/App.jsx';
import styles from './index.css';
import { Provider } from 'react-redux';
import { store } from './store/store.js';

import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

