import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const getLegalDetails = createAsyncThunk(
  'legal/get_legal_details',
  async (data, { rejectWithValue }) => {
    try {
      /*
      const response = await axiosInstance.post(
        '/message_center_api/legal_api/get_legal_details',
        data
      );
      */
      const response = await axiosInstance.post(
        '/legal/get_data_requisito',
        data
      );
      //console.log("GetData", response?.data);
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

const getLegalDetailsSlice = createSlice({
  name: 'getLegalDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLegalDetails.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getLegalDetails.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(getLegalDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default getLegalDetailsSlice.reducer;
