import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const getResponsibles = createAsyncThunk(
  'task/get_responsabels',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/amatia/tasklist_api/get_responsabels', data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getResponsiblesSlice = createSlice({
  name: 'getResponsibles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getResponsibles.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getResponsibles.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(getResponsibles.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default getResponsiblesSlice.reducer;
