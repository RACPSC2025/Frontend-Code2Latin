import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const submitMessageData = createAsyncThunk(
  'dashboard/message_form_data_submit',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/message_form_data_submit', data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const submitMessageSliceData = createSlice({
  name: 'submitMessageData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(submitMessageData.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(submitMessageData.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(submitMessageData.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default submitMessageSliceData.reducer;
