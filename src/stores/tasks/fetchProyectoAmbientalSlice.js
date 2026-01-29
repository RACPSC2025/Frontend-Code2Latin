import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchProyectoAmbiental = createAsyncThunk(
  'task/list_proyecto',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/list_proyecto');
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchProyectoAmbientalSlice = createSlice({
  name: 'fetchProyectoAmbiental',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProyectoAmbiental.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchProyectoAmbiental.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchProyectoAmbiental.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchProyectoAmbientalSlice.reducer;
