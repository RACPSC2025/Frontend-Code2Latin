import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchActionFormModel = createAsyncThunk(
  'actions/get_empty_response_action_form',
  async (formData = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/action_api/get_empty_response_action_form'
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchActionFormModelSlice = createSlice({
  name: 'fetchActionFormModel',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchActionFormModel.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchActionFormModel.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchActionFormModel.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchActionFormModelSlice.reducer;
