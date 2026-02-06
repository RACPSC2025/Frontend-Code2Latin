import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const getLogtaskComments = createAsyncThunk(
  'task/get_logtask_comments',
  async (data = {}, { rejectWithValue }) => {
    const { logtask_id, formData } = data;
    try {
      const response = await axiosInstance.post(
        `/amatia/tasklist_api/get_logtask_comments/${logtask_id}`,
        formData
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getLogtaskCommentsSlice = createSlice({
  name: 'getLogtaskComments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLogtaskComments.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getLogtaskComments.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(getLogtaskComments.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default getLogtaskCommentsSlice.reducer;
