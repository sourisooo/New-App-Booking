import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import AppLoader from './Homepage/HOC/AppLoader';
import AppRouter from './Homepage/router/AppRouter';
import './scss/app.scss';
import theme from './theme';



const App = () => {
  return (
    <AppLoader>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter />
      </ThemeProvider>
      <ToastContainer />
    </AppLoader>
  );
};

export default App;
