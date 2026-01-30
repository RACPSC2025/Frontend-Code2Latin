import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  loginStep: 1, // 1: Email, 'recaptcha': reCAPTCHA, 2: Password, 'welcome': Success Screen
  loading: false,
  error: null,
  tempEmail: ''
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginStep: (state, action) => {
      state.loginStep = action.payload;
    },
    setTempEmail: (state, action) => {
      state.tempEmail = action.payload;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loginStep = 'welcome';
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loginStep = 1;
      state.tempEmail = '';
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  setLoginStep, 
  setTempEmail, 
  loginSuccess, 
  logout, 
  setAuthError, 
  clearAuthError 
} = authSlice.actions;

export default authSlice.reducer;
