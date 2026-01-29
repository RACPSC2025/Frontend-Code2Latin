import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchPMASList = createAsyncThunk(
  'task/list_pmas',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/list_pmas');
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchPMASListSlice = createSlice({
  name: 'fetchPMASList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPMASList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchPMASList.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchPMASList.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchPMASListSlice.reducer;
