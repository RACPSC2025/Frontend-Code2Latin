import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const getSubPrograms = createAsyncThunk(
  'task/get_sub_programs',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/get_sub_programs', data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getSubProgramsSlice = createSlice({
  name: 'getSubPrograms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSubPrograms.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getSubPrograms.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(getSubPrograms.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default getSubProgramsSlice.reducer;
