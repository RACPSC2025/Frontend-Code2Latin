import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';
import qs from "qs"; // Para formatear los datos como application/x-www-form-urlencoded

const initialState = {
  loading: false,
  data: [],
  error: null
};
//const url = `${API_URL}/message_center_api/legal_api/get_dropdown_options`;

export const fetchLegalData = createAsyncThunk(
  'legal/get_dropdown_options',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/message_center_api/legal_api/get_dropdown_options`);
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

const fetchLegalDataSlice = createSlice({
  name: 'fetchLegalData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLegalData.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchLegalData.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchLegalData.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchLegalDataSlice.reducer;
