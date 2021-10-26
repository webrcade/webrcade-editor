import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

ReactDOM.render(
  <React.StrictMode>
    {/* <ThemeProvider theme={theme}> */}
      <CssBaseline />
      <App />
    {/* </ThemeProvider> */}
  </React.StrictMode>,
  document.getElementById('root')
);
