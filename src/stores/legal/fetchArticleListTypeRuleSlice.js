import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchArticleListTypeRule = createAsyncThunk(
    // API: '/message_center_api/legal_api/list_noram_tipo_requisito'
    'legal/list_noram_tipo_requisito', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/message_center_api/legal_api/list_noram_tipo_requisito');
    return response?.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const fetchArticleListTypeRuleSlice = createSlice({
  name: 'fetchArticleListTypeRule',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArticleListTypeRule.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchArticleListTypeRule.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchArticleListTypeRule.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchArticleListTypeRuleSlice.reducer;
