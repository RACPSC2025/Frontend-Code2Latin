import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchConvenioList = createAsyncThunk(
  'task/list_convineo',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/list_convineo');
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchConvenioListSlice = createSlice({
  name: 'fetchConvenioList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchConvenioList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchConvenioList.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchConvenioList.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchConvenioListSlice.reducer;
