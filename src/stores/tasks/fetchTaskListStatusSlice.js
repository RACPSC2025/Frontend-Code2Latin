import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';
import { mockTasksAPI } from './mockTaskData';

// TOGGLE THIS TO SWITCH BETWEEN MOCK AND REAL API
const USE_MOCK_DATA = true;

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchTaskListStatus = createAsyncThunk('task/count', async (id, { rejectWithValue }) => {
  try {
    if (USE_MOCK_DATA) {
      console.log("🎭 Using MOCK data for fetchTaskListStatus");
      const mockResponse = await mockTasksAPI.listTaskStatus();
      return mockResponse;
    } else {
      const response = await axiosInstance.post('/tasklist_api/list_task_status');
      return response?.data;
    }
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
