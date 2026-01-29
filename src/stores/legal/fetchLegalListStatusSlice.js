import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchLegalListStatus = createAsyncThunk(
  'legal/list_legal_status',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/message_center_api/legal_api/list_legal_status`);
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

const fetchLegalListStatusSlice = createSlice({
  name: 'fetchLegalListStatus',
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

export default fetchLegalListStatusSlice.reducer;
