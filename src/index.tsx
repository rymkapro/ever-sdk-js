import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BinaryLibrary, TonClient } from '@eversdk/core';
import { libWeb } from '@eversdk/lib-web';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// eslint-disable-next-line react-hooks/rules-of-hooks
TonClient.useBinaryLibrary(() => {
  const promise = libWeb();
  return promise as unknown as Promise<BinaryLibrary>;
});
