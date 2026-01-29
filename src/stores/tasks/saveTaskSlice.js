import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const saveTask = createAsyncThunk(
  'task/save_task',
  async (data = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/taskcreate_api/save_task', data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const saveTaskSlice = createSlice({
  name: 'saveTask',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(saveTask.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(saveTask.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(saveTask.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default saveTaskSlice.reducer;
