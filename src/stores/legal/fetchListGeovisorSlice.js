import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchListGeovisor = createAsyncThunk(
  'legal/list_geovisor',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/list_geovisor');
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

const fetchListGeovisorSlice = createSlice({
  name: 'fetchListGeovisor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchListGeovisor.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchListGeovisor.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchListGeovisor.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchListGeovisorSlice.reducer;
