import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchTaskCounts = createAsyncThunk('task/count', async (id, { rejectWithValue }) => {
  try {
    // 🔧 CORRECCIÓN DE ENDPOINT (06/02/2026): Se ajustó la ruta según endpoints_pruebas.md
    // DOCUMENTACIÓN: https://compliance.dev.sofacto.info/amatia/tasklist_api/get_task_counts
    const response = await axiosInstance.post('/amatia/tasklist_api/get_task_counts');
    return response?.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const fetchTaskCountsSlice = createSlice({
  name: 'fetchTaskCounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTaskCounts.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchTaskCounts.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchTaskCounts.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchTaskCountsSlice.reducer;
