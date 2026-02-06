import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

// Acción para crear un comentario en un logtask
export const createLogtaskComment = createAsyncThunk(
  'task/create_logtask_comment',
  async (formData, { rejectWithValue }) => {
    try {
      // Usar FormData para compatibilidad con backend PHP/Symfony
      const response = await axiosInstance.post(`/amatia/tasklist_api/create_logtask_comment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log("📨 Respuesta crear comentario:", response?.data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const createLogtaskCommentSlice = createSlice({
  name: 'createLogtaskComment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createLogtaskComment.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createLogtaskComment.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(createLogtaskComment.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default createLogtaskCommentSlice.reducer;
