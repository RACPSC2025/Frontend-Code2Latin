import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchDashboardMessageStatistics = createAsyncThunk(
  'dashboard/dashboard_message_statistics',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/dashboard_message_statistics', data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchDashboardMessageStatisticsSlice = createSlice({
  name: 'fetchDashboardMessageStatistics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDashboardMessageStatistics.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchDashboardMessageStatistics.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchDashboardMessageStatistics.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchDashboardMessageStatisticsSlice.reducer;
