import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchLogtaskList = createAsyncThunk(
  'task/list_logtasks',
  async (data = {}, { rejectWithValue }) => {
    const { task_id } = data;
    try {
      const response = await axiosInstance.post(`/tasklist_api/list_logtasks/${parseInt(task_id)}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchLogtaskListSlice = createSlice({
  name: 'fetchLogtaskList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLogtaskList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchLogtaskList.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchLogtaskList.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchLogtaskListSlice.reducer;
