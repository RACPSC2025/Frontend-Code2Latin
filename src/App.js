import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import './App.css';
import './index.css';
import customTheme from './lib/theme';
import { LanguageProvider } from './providers/languageProvider';
import RoutesFile from './routes/RoutesFile';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <RoutesFile />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
          theme="light"
          style={{ minWidth: '350px' }}
        />
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
