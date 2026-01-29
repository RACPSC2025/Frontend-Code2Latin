import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchSubPhases = createAsyncThunk(
  'task/get_subfases',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/get_subfases', data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchSubPhasesSlice = createSlice({
  name: 'fetchSubPhases',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSubPhases.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchSubPhases.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchSubPhases.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchSubPhasesSlice.reducer;
