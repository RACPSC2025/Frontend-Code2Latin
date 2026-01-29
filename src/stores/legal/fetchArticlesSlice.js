import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import legalService from '../../services/legalService';

const initialState = {
  loading: false,
  data: [],
  error: null,
  page: 1,
  total: 0,
  records: 0
};

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (params, { rejectWithValue }) => {
    try {
      const response = await legalService.getChildRequisito(params);
      return response;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const fetchArticlesSlice = createSlice({
  name: 'fetchArticles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArticles.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchArticles.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.rows || [];
      state.page = action.payload.page || 1;
      state.total = action.payload.total || 0;
      state.records = action.payload.records || 0;
      state.error = null;
    });
  }
});

export default fetchArticlesSlice.reducer;
