import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchContractorList = createAsyncThunk(
  'task/list_contractor',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/list_contractor');
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchContractorListSlice = createSlice({
  name: 'fetchContractorList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchContractorList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchContractorList.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchContractorList.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchContractorListSlice.reducer;
