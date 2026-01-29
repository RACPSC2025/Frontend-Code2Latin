import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const submitActionForm = createAsyncThunk(
  'actions/action_form_submit',
  async (data = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/action_api/action_form_submit',
        data
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const submitActionFormSlice = createSlice({
  name: 'submitActionForm',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(submitActionForm.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(submitActionForm.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(submitActionForm.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default submitActionFormSlice.reducer;
