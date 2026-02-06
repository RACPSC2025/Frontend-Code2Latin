import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const updateLogtaskDetails = createAsyncThunk(
  'task/update_task_basic_details',
  async (data = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/amatia/tasklist_api/update_logtask_details', data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const updateLogtaskDetailsSlice = createSlice({
  name: 'updateLogtaskDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateLogtaskDetails.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateLogtaskDetails.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(updateLogtaskDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default updateLogtaskDetailsSlice.reducer;
