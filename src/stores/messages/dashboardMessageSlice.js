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
      const response = await axiosInstance.post('/tasklist_api/dashboard_message', data);
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
