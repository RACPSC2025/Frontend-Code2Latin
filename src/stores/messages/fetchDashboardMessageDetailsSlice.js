import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchDashboardMessageDetails = createAsyncThunk(
  'dashboard/dashboard_message_detail',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/dashboard_message_detail', data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchDashboardMessageDetailsSlice = createSlice({
  name: 'fetchDashboardMessageDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDashboardMessageDetails.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchDashboardMessageDetails.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchDashboardMessageDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchDashboardMessageDetailsSlice.reducer;
