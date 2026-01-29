import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchTaskListLevel = createAsyncThunk(
  'task/list-level',
  async (data, { rejectWithValue }) => {
    const { level, formData = {} } = data;
    const levelUrl = level == 1 ? 'list_level1' : `get_level${level}`;

    try {
      const response = await axiosInstance.post(`/tasklist_api/${levelUrl}`, formData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchTaskListLevelSlice = createSlice({
  name: 'fetchTaskListLevel',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTaskListLevel.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchTaskListLevel.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchTaskListLevel.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchTaskListLevelSlice.reducer;
