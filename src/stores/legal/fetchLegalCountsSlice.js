import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchLegalCounts = createAsyncThunk(
  'legal/get_legal_counts',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/message_center_api/legal_api/get_legal_counts`);
      return response?.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const fetchLegalCountsSlice = createSlice({
  name: 'fetchLegalCounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLegalCounts.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchLegalCounts.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchLegalCounts.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchLegalCountsSlice.reducer;
