import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

/*
export const uploadCommentAttachments = createAsyncThunk(
  'comments/upload_comment_attachments',
  async (data = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('tasklist_api/upload_comment_attachments', data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
*/

export const uploadCommentAttachments = createAsyncThunk(
  'comments/upload_comment_attachments',
  async (data = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('tasklist_api/upload_comment_attachments', data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const uploadCommentAttachmentsSlice = createSlice({
  name: 'uploadCommentAttachments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(uploadCommentAttachments.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(uploadCommentAttachments.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(uploadCommentAttachments.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default uploadCommentAttachmentsSlice.reducer;
