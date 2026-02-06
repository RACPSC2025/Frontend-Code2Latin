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

export const getLogtaskDetails = createAsyncThunk(
  'task/get_logtask_details',
  async (data = {}, { rejectWithValue }) => {
    const { logtask_id } = data;
    try {
      if (USE_MOCK_DATA) {
        console.log("🎭 Using MOCK data for getLogtaskDetails");
        const mockResponse = await mockTasksAPI.getLogtaskDetails(logtask_id);
        return mockResponse;
      } else {
        const response = await axiosInstance.post('/tasklist_api/get_logtask_details', data);
        return response?.data;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getLogtaskDetailsSlice = createSlice({
  name: 'getLogtaskDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLogtaskDetails.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getLogtaskDetails.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(getLogtaskDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default getLogtaskDetailsSlice.reducer;
