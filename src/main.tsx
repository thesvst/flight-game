import React from 'react';
import ReactDOM from 'react-dom/client';
import { StoreProvider } from './providers';
import { Renderer } from './Renderer';
import '@core/Tasker/Tasker.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <Renderer />
    </StoreProvider>
  </React.StrictMode>,
);
