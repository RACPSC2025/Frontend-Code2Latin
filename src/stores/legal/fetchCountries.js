import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchLegalCounts = createAsyncThunk('task/count', async (id, { rejectWithValue }) => {
  try {
    //const response = await axiosInstance.post('/message_center_api/action_api/list_action_categories');
    const response = await axiosInstance.post('/message_center_api/action_api/list_action_categories');
    console.log("Countries");
    console.log(response);
    return response?.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const fetchLegalCountsSlice = createSlice({
  name: 'fetchLegalCounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLegalCounts.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchLegalCounts.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchLegalCounts.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchLegalCountsSlice.reducer;
