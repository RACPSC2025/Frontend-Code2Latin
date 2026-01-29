import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchPhases = createAsyncThunk(
  'task/list_fases',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/list_fases');
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchPhasesSlice = createSlice({
  name: 'fetchPhases',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPhases.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchPhases.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchPhases.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchPhasesSlice.reducer;
