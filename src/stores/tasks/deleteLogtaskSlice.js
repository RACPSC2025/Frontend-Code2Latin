import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const deleteLogtask = createAsyncThunk(
  'task/delete_logtask',
  async (data = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/tasklist_api/delete_logtask`, data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const deleteLogtaskSlice = createSlice({
  name: 'deleteLogtask',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(deleteLogtask.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteLogtask.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(deleteLogtask.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default deleteLogtaskSlice.reducer;
