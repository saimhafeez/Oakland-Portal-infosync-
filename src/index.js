import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    // primary: {
    //   main: '#F2542D'
    // },
    // secondary: {
    //   main: '#000000'
    // }
  },
  typography: {
    "fontFamily": `"Poppins", "Roboto", "Helvetica", "Arial", sans-serif`,
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
