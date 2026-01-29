import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchTaskTags = createAsyncThunk(
  'task/list_tags',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/list_tags');
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchTaskTagsSlice = createSlice({
  name: 'fetchTaskTags',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTaskTags.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchTaskTags.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchTaskTags.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchTaskTagsSlice.reducer;
