import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const getActionDetails = createAsyncThunk(
  'actions/get_action_detail',
  async (data = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/action_api/get_action_detail',
        data
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getActionDetailsSlice = createSlice({
  name: 'getActionDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getActionDetails.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getActionDetails.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(getActionDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default getActionDetailsSlice.reducer;
