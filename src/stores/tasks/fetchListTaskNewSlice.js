import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';
import { mockTasksAPI } from './mockTaskData';

/* 🎭 Data Mock - Preservado para referencia (Migración: 05/02/2026)
const USE_MOCK_DATA = true;
*/
// ✅ API Real - Migración Sofactia (05/02/2026)
const USE_MOCK_DATA = false;

const initialState = {
  loading: false,
  data: [],
  error: null,
  // ✅ Nuevos campos para paginación (API Real)
  currentPage: 1,
  totalPages: 1,
  totalTasks: 0,
  hasNextPage: false,
  hasPrevPage: false
};


export const fetchGetCountries = createAsyncThunk(
  'legal/get_active_countries',
  async (formData = {}, { rejectWithValue }) => {
    try {
      //const response = await axiosInstance.post('/tasklist_api/get_active_countries', formData);
      // 🔧 CORRECCIÓN DE ENDPOINT (06/02/2026): Se restauró el prefijo /amatia según documentación oficial
      const response = await axiosInstance.get(`/amatia/message_center_api/legal_api/get_active_countries`);
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
      /* 🎭 Data Mock - Bloque preservado (Migración: 05/02/2026)
      if (USE_MOCK_DATA) {
        console.log("🎭 Using MOCK data for fetchListTaskNew");
        const mockResponse = await mockTasksAPI.listTasksNewComplete(formData);
        console.log("responseMockTask", mockResponse);
        return mockResponse;
      }
      */
      
      // ✅ API Real - Migración Sofactia (05/02/2026)
      // Agregar parámetros de paginación si no están presentes
      const requestData = {
        page: formData.page || 1,
        limit: formData.limit || 10,
        ...formData
      };
      
      console.log("🚀 Fetching tasks from Sofactia API:", requestData);
      
      // 🔧 CORRECCIÓN DE ENDPOINT (06/02/2026): Se restauró el prefijo /amatia según documentación oficial
      const response = await axiosInstance.post(
        '/amatia/tasklist_api/list_tasks_new_complete',
        requestData
      );
      
      console.log("✅ API Response:", response.data);
      
      // Validar respuesta de la API
      if (response.data.messages !== 'Success') {
        throw new Error(response.data.messages || 'API Error');
      }
      
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
      
      // Mensaje de error user-friendly
      const errorMessage = error.response?.data?.messages 
        || error.message 
        || 'Error al cargar tareas. Por favor, intente nuevamente.';
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTaskProgress = createAsyncThunk(
  'tasklist_api/update_task_progress_post',
  async ({ id, progress }, { rejectWithValue }) => {
    try {
      if (USE_MOCK_DATA) {
        // Use mock data
        console.log("🎭 Using MOCK data for updateTaskProgress");
        const mockResponse = await mockTasksAPI.updateTaskProgress(id, progress);
        console.log("responseMockUpdateTask:", mockResponse);
        return mockResponse;
      } else {
        // Use real API
        const formData = new FormData();
        formData.append("id", id);
        formData.append("progress", progress);

        const response = await axiosInstance.post(
          '/tasklist_api/update_task_progress_post',
          formData
        );

        console.log("responseUpdateTaskProgress:", response);
        return response?.data;
      }
    } catch (error) {
      console.error("Error updateTaskProgress:", error);
      return rejectWithValue(error.message);
    }
  }
);

const fetchListTaskNewSlice = createSlice({
  name: 'fetchListTaskNew',
  initialState,
  reducers: {
    // ✅ Nuevos reducers para control de paginación (API Real)
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    resetTaskList: (state) => {
      state.data = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalTasks = 0;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchListTaskNew.pending, (state, action) => {
      state.loading = true;
      state.error = null; // ✅ Limpiar errores previos
    });
    builder.addCase(fetchListTaskNew.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.payload || action.error.message; // ✅ Usar mensaje personalizado
    });
    builder.addCase(fetchListTaskNew.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      
      const payload = action.payload;
      
      // ✅ Manejar respuesta de API real con paginación
      if (payload?.data) {
        state.data = payload.data;
        state.totalTasks = payload.data.length;
        state.totalPages = payload.total_pages || Math.ceil(state.totalTasks / 10);
        state.hasNextPage = state.currentPage < state.totalPages;
        state.hasPrevPage = state.currentPage > 1;
      } else {
        // Fallback si no hay datos
        state.data = [];
        state.totalTasks = 0;
        state.totalPages = 1;
      }
    });
  }
});

// ✅ Exportar acciones para uso en componentes
export const { setCurrentPage, resetTaskList } = fetchListTaskNewSlice.actions;
export default fetchListTaskNewSlice.reducer;
