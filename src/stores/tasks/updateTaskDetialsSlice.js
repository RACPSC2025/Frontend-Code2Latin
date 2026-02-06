import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const updateTaskDetails = createAsyncThunk(
  'task/update_task_basic_details',
  async (data = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/amatia/tasklist_api/update_task_basic_details', data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const updateTaskDetailsSlice = createSlice({
  name: 'updateTaskDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateTaskDetails.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateTaskDetails.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(updateTaskDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default updateTaskDetailsSlice.reducer;
