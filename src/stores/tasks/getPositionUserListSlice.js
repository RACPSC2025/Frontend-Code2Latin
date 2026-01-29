import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const getPositionUserList = createAsyncThunk(
  'task/get_position_user_list',
  async (data = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/get_position_user_list');
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getPositionUserListSlice = createSlice({
  name: 'getPositionUserList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPositionUserList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getPositionUserList.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(getPositionUserList.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default getPositionUserListSlice.reducer;
