import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchTaskCounts = createAsyncThunk('task/count', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/tasklist_api/get_task_counts');
    return response?.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const fetchTaskCountsSlice = createSlice({
  name: 'fetchTaskCounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTaskCounts.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchTaskCounts.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchTaskCounts.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchTaskCountsSlice.reducer;
