import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchAdministratorsList = createAsyncThunk(
  'task/list_administradores',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/list_administradores');
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchAdministratorsListSlice = createSlice({
  name: 'fetchAdministratorsList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAdministratorsList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchAdministratorsList.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchAdministratorsList.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchAdministratorsListSlice.reducer;
