import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchListLegals = createAsyncThunk(
  'legal/list_legals',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/message_center_api/legal_api/list_legals`);
      //console.log("ResponseLegals");
      //console.log(response?.data);
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

const fetchListLegalsSlice = createSlice({
  name: 'fetchListLegals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchListLegals.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchListLegals.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchListLegals.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchListLegalsSlice.reducer;
/*
export {
  fetchListLegalsSlice,
  fetchListLegals,
  fetchListLegalsComplete,
}
  */

