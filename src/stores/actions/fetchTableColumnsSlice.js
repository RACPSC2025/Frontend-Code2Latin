import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchTableColumns = createAsyncThunk(
  'actions/dashboard_actions_table_headers',
  async (formData = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/action_api/dashboard_actions_table_headers'
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchTableColumnsSlice = createSlice({
  name: 'fetchTableColumns',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTableColumns.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchTableColumns.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchTableColumns.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchTableColumnsSlice.reducer;
