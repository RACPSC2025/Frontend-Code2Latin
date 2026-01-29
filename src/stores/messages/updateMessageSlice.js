import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const updateMessage = createAsyncThunk(
  'dashboard/update_message',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/update_message', data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const updateMessageSlice = createSlice({
  name: 'updateMessage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateMessage.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateMessage.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(updateMessage.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default updateMessageSlice.reducer;
