import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import Roboto from '../assets/fonts/Roboto/Roboto-Regular.ttf';

let theme = createTheme({
  palette: {
    primary: {
      main: '#19AABB'
    },
    black: {
      main: '#2B303B'
    },
    blue: {
      main: '#285064',
      light: '#EDF4F5'
    },
    blue2: {
      main: '#EFF7F9'
    },
    green: {
      main: '#16B9AC'
    },
    red: {
      main: '#F0627D'
    },
    yellow: {
      main: '#D6CB6F'
    },
    icon: {
      main: '#929FBA'
    }
  },
  typography: {
    fontSize: 12, // This sets the base font size to 10px
    // You can also customize other typography properties here
    fontFamily: 'Roboto, sans-serif'
  },
  spacing: 10,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1366, // Custom breakpoint
      xxl: 1920 // Custom breakpoint
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Roboto'), local('Roboto-Regular'), url(${Roboto}) format('ttf');
        }
      `
    }
  }
});

theme = responsiveFontSizes(theme);

export default theme;
