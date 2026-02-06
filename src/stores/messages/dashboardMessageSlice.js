import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const dashboardMessage = createAsyncThunk(
  'dashboard/messages',
  async (data, { rejectWithValue }) => {
    try {
      // 🔧 CORRECCIÓN DE ENDPOINT (06/02/2026): Se agregó el prefijo /amatia para corregir la ruta del API
      const response = await axiosInstance.post('/amatia/tasklist_api/dashboard_message', data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const dashboardMessageSlice = createSlice({
  name: 'dashboardMessage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(dashboardMessage.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(dashboardMessage.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(dashboardMessage.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default dashboardMessageSlice.reducer;
