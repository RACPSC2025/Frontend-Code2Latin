import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchRisksList = createAsyncThunk(
  'risks/list_risks',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/message_center_api/risk_api/list_risks');
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

const fetchRisksListSlice = createSlice({
  name: 'fetchRisksList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRisksList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchRisksList.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchRisksList.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchRisksListSlice.reducer;
