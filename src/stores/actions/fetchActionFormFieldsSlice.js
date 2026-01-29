import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchActionFormFields = createAsyncThunk(
  'actions/action_form',
  async (formData = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/message_center_api/action_api/action_form');
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchActionFormFieldsSlice = createSlice({
  name: 'fetchActionFormFields',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchActionFormFields.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchActionFormFields.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchActionFormFields.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchActionFormFieldsSlice.reducer;
