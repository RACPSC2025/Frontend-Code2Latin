import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchTaskListStatus = createAsyncThunk('task/count', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/tasklist_api/list_task_status');
    return response?.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const fetchTaskListStatusSlice = createSlice({
  name: 'fetchTaskListStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTaskListStatus.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchTaskListStatus.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchTaskListStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchTaskListStatusSlice.reducer;
