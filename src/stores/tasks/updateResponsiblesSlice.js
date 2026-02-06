import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const updateResponsibles = createAsyncThunk(
  'task/update_responsabels',
  async (data = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/amatia/tasklist_api/update_responsabels', data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const updateResponsiblesSlice = createSlice({
  name: 'updateResponsibles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateResponsibles.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateResponsibles.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(updateResponsibles.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default updateResponsiblesSlice.reducer;
