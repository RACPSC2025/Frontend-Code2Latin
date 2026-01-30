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

export const deleteLogtask = createAsyncThunk(
  'task/delete_logtask',
  async (data = {}, { rejectWithValue }) => {
    try {
      if (USE_MOCK_DATA) {
        console.log("🎭 Using MOCK data for deleteLogtask");
        // Extract logtask_id from FormData if needed
        const logtask_id = data.get ? data.get('logtask_id') : data.logtask_id;
        const mockResponse = await mockTasksAPI.deleteLogtask(logtask_id);
        return mockResponse;
      } else {
        const response = await axiosInstance.post(`/tasklist_api/delete_logtask`, data);
        return response?.data;
      }
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
