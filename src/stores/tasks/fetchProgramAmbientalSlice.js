import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchProgramAmbiental = createAsyncThunk(
  'task/list_programa_ambiental',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/list_programa_ambiental');
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchProgramAmbientalSlice = createSlice({
  name: 'fetchProgramAmbiental',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProgramAmbiental.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchProgramAmbiental.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchProgramAmbiental.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchProgramAmbientalSlice.reducer;
