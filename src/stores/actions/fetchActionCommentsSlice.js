import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchActionComments = createAsyncThunk(
  'comments/list_action_comments',
  async (data = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/action_api/list_action_comments',
        data
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchActionCommentsSlice = createSlice({
  name: 'fetchActionComments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchActionComments.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchActionComments.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchActionComments.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchActionCommentsSlice.reducer;
