import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const editActionComments = createAsyncThunk(
  'comments/add_edit_comment',
  async (data = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/action_api/add_edit_comment',
        data
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const editActionCommentsSlice = createSlice({
  name: 'editActionComments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(editActionComments.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(editActionComments.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(editActionComments.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default editActionCommentsSlice.reducer;
