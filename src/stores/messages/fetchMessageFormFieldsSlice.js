import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance, { fileHeader } from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchMessageFormFields = createAsyncThunk(
  'dashboard/message_form_fields',
  async (data, { rejectWithValue }) => {
    const { formData, file } = data;
    try {
      const response = await axiosInstance.post(
        '/amatia/tasklist_api/message_form_fields',
        formData,
        file && fileHeader
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchMessageFormFieldsSlice = createSlice({
  name: 'fetchMessageFormFields',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMessageFormFields.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchMessageFormFields.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchMessageFormFields.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchMessageFormFieldsSlice.reducer;
