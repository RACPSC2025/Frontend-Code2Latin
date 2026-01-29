import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchEventsList = createAsyncThunk(
  'event/dashboard',
  async (formData = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/events_api/dashboard_events',
        formData
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchEventsListSlice = createSlice({
  name: 'fetchEventsList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchEventsList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchEventsList.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchEventsList.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchEventsListSlice.reducer;
