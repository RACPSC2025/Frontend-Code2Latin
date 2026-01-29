import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const getActionLogtask = createAsyncThunk(
  'actions/get_action_detail',
  async (data = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/action_api/get_actions_for_logtask',
        data
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getActionLogtaskSlice = createSlice({
  name: 'getActionLogtask',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getActionLogtask.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getActionLogtask.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(getActionLogtask.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default getActionLogtaskSlice.reducer;
