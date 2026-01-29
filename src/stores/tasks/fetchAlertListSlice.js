import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchAlertList = createAsyncThunk(
  'task/list_alerta',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/list_alerta');
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchAlertListSlice = createSlice({
  name: 'fetchAlertList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAlertList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchAlertList.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchAlertList.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchAlertListSlice.reducer;
