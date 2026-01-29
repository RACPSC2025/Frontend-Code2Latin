import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const getLegalTree = createAsyncThunk(
  'legal/get_legal_tree',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/get_legal_tree', data);
      return response?.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const getLegalTreeSlice = createSlice({
  name: 'getLegalTree',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLegalTree.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getLegalTree.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(getLegalTree.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default getLegalTreeSlice.reducer;
