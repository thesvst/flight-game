import React from 'react';
import ReactDOM from 'react-dom/client';
import { StoreProvider } from './providers';
import '@core/Tasker/Tasker.css';
import { AccessTokenProvider } from '@providers';
import { GameInitializer } from './GameInitializer';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <AccessTokenProvider>
        <GameInitializer />
      </AccessTokenProvider>
    </StoreProvider>
  </React.StrictMode>,
);
