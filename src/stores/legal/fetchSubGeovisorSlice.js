import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchSubGeovisor = createAsyncThunk(
  'legal/get_sub_geovisor',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/get_sub_geovisor', data);
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

const fetchSubGeovisorSlice = createSlice({
  name: 'fetchSubGeovisor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSubGeovisor.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchSubGeovisor.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchSubGeovisor.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchSubGeovisorSlice.reducer;
