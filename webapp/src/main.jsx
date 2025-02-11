import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
// import './bootstrap.css';
import App from './App.jsx';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a1a1a', // --bs-primary
      light: '#353a40',
    },
    secondary: {
      main: '#fff', // --bs-secondary
    },
    success: {
      main: '#4bbf73', // --bs-success
    },
    info: {
      main: '#1f9bcf', // --bs-info
    },
    warning: {
      main: '#f0ad4e', // --bs-warning
    },
    error: {
      main: '#d9534f', // --bs-danger
    },
    background: {
      default: '#fff', // --bs-light
    },
    text: {
      primary: '#343a40', // --bs-dark
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </>
  </StrictMode>
);
