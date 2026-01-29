import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchListLevelExecutor = createAsyncThunk(
  'task/list_level_ejecutor',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/tasklist_api/list_level_ejecutor`, data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchListLevelExecutorSlice = createSlice({
  name: 'fetchListLevelExecutor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchListLevelExecutor.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchListLevelExecutor.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchListLevelExecutor.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchListLevelExecutorSlice.reducer;
