import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const getPrograms = createAsyncThunk(
  'task/get_programs',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/get_programs', data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getProgramsSlice = createSlice({
  name: 'getPrograms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPrograms.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getPrograms.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(getPrograms.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default getProgramsSlice.reducer;
