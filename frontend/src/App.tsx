import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { EmailProvider } from './context/EmailContext';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <EmailProvider>
        <AppRoutes />
      </EmailProvider>
    </BrowserRouter>
  );
};

export default App;
