import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const getSettings = createAsyncThunk(
  'task/get_settings',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/get_settings');
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getSettingsSlice = createSlice({
  name: 'getSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSettings.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getSettings.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(getSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default getSettingsSlice.reducer;
