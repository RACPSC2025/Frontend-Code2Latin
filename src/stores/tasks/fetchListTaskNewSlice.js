import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

const initialState = {
  loading: false,
  data: [],
  error: null
};


export const fetchGetCountries = createAsyncThunk(
  'legal/get_active_countries',
  async (formData = {}, { rejectWithValue }) => {
    try {
      //const response = await axiosInstance.post('/tasklist_api/get_active_countries', formData);
      const response = await axiosInstance.get(`/message_center_api/legal_api/get_active_countries`);
      console.log("responseCountry");
      console.log(response);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchListTaskNew = createAsyncThunk(
  'task/list_tasks_new_complete',
  async (formData = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/list_tasks_new_complete', formData);
      
      console.log("responseTask");
      console.log(response);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/*
export const updateTaskProgress = createAsyncThunk(
  'tasklist_api/update_task_progress_post',
  async ({ id, progress }, { rejectWithValue }) => {
    try {
      // Preparar datos para el backend
      const formData = {
        id,
        progress
      };

      // Llamada al API
      const response = await axiosInstance.post('/tasklist_api/update_task_progress_post', formData);

      console.log("responseUpdateTaskProgress: ", response);

      return response?.data;
    } catch (error) {
      console.error("Error updateTaskProgress: ", error);
      return rejectWithValue(error.message);
    }
  }
);
*/
export const updateTaskProgress = createAsyncThunk(
  'tasklist_api/update_task_progress_post',
  async ({ id, progress }, { rejectWithValue }) => {
    try {
      // Usar FormData para enviar al backend
      const formData = new FormData();
      formData.append("id", id);
      formData.append("progress", progress);

      // Llamada al API
      const response = await axiosInstance.post(
        '/tasklist_api/update_task_progress_post',
        formData
      );

      console.log("responseUpdateTaskProgress:", response);

      return response?.data;
    } catch (error) {
      console.error("Error updateTaskProgress:", error);
      return rejectWithValue(error.message);
    }
  }
);

const fetchListTaskNewSlice = createSlice({
  name: 'fetchListTaskNew',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchListTaskNew.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchListTaskNew.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchListTaskNew.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchListTaskNewSlice.reducer;
