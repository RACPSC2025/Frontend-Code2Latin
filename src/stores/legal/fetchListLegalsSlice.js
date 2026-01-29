import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';
import qs from "qs"; // Para formatear los datos como application/x-www-form-urlencoded

const initialState = {
  loading: false,
  data: [],
  error: null
};

export const fetchListLegals = createAsyncThunk(
  'legal/list_legals',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/message_center_api/legal_api/list_legals`);
      console.log("requirementsResponse");
      console.log(response?.data);
      return response?.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);


export const fetchListLegalsComplete = createAsyncThunk(
  'legal/list_legals',
  async (data, { rejectWithValue }) => {
    try {
      //console.log(query);
      const response = await axiosInstance.post('/message_center_api/legal_api/list_legals');
      //const response = await axiosInstance.post('/message_center_api/legal_api/get_data_requisito');
      ///message_center_api/legal_api/list_legals
      ///message_center_api/legal_api/get_legal_details
      //get_legal_tree
      ///tasklist_api/list_tasks
      //dashboard_tasks
      /*
      const response = await axiosInstance.post('/message_center_api/legal_api/get_data_requisito', {
        query
        //variables: filters
      },);
      */
      
      //console.log("TestResponse");
      //console.log(response?.data);
      return response?.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

/*
export const fetchDataConection = createAsyncThunk(
  'legal/data_conection',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/message_center_api/legal_api/data_conection');
      return response?.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
*/

/*
export const evalWithIA = createAsyncThunk(
  'tasklegal/legal/invoke',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/message_center_api/tasklegal/legal/invoke');    
      console.log("TestResponse");
      console.log(response?.data);
      return response?.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
*/

/*
export const evalWithIA = createAsyncThunk(
  'tasklegal/legal/invoke',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/tasklegal/legal/invoke',
        { dato: data } // Enviamos el texto como campo `dato`
      );
      console.log("TestResponse");
      console.log(response?.data);
      return response?.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
*/

export const evalWithIA = createAsyncThunk(
  //'tasklegal/legal/invoke',
  'task/get_requirements_ia',
  async (text, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        //'/tasklegal/legal/invoke',
        //'/message_center_api/tasklegal/legal/get_requirements_ia',
        '/message_center_api/legal_api/get_requirements_ia',
        //'/tasklist_api/get_requirements_ia',
        { dato: text } // ← aquí solo se envía el texto
      );
      //console.log("TestResponseIA");
      //console.log(response?.data);
      return response?.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);


export const evalWithIAComplete = createAsyncThunk(
  'task/get_requirements_complete_ia',
  async (text, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/legal_api/get_requirements_complete_ia',
        { dato: text } // ← aquí solo se envía el texto
      );
      //console.log("TestResponseIA");
      //console.log(response?.data);
      return response?.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const generateTasksFromArticlesWithIA = createAsyncThunk(
  'task/get_task_form_articles_ia',
  async (text, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/legal_api/get_task_form_articles_ia',
        { dato: text } 
      );
      return response?.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

/*
export const evalWithIAresume = createAsyncThunk(
  'legal/get_resume_ia',
  async (text, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/legal_api/get_resume_ia',
        { dato: text } // ← aquí solo se envía el texto
      );
      //console.log("TestResponseIA");
      //console.log(response?.data);
      return response?.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
*/

export const evalWithIAresume = createAsyncThunk(
  'legal/get_resume_ia',
  async (text, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/legal_api/get_resume_ia',
        { dato: text }
      );

      // Aseguramos que la respuesta tenga el formato esperado
      const iaData = response?.data;

      // Si existe contenido de texto
      const resumenIA =
        iaData?.content && iaData.content.length > 0
          ? iaData.content[0].text
          : 'Sin resumen disponible';

      return resumenIA; // ← devolvemos solo el texto útil
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const evalWithIAcorrection = createAsyncThunk(
  'legal/get_correction_ia',
  async (text, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/legal_api/get_correction_ia',
        { dato: text }
      );

      // Aseguramos que la respuesta tenga el formato esperado
      const iaData = response?.data;

      // Si existe contenido de texto
      const resumenIA =
        iaData?.content && iaData.content.length > 0
          ? iaData.content[0].text
          : 'Sin corrección disponible';

      return resumenIA; // ← devolvemos solo el texto útil
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const evalAnalysis = createAsyncThunk(
  //'tasklegal/legal/invoke',
  'task/get_standard_analysis',
  async (text, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        //'/tasklegal/legal/invoke',
        //'/message_center_api/tasklegal/legal/get_requirements_ia',
        '/message_center_api/legal_api/get_standard_analysis',
        //'/tasklist_api/get_requirements_ia',
        { dato: text } // ← aquí solo se envía el texto
      );
      //console.log("TestResponseIA");
      //console.log(response?.data);
      return response?.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const evalpdfIA = createAsyncThunk(
  '/legal_api/get_requirements_attachments_ia',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/legal_api/get_requirements_attachments_ia',
        formData, 
      );
      //console.log("TestResponseIA");
      //console.log(response?.data);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error desconocido');
    }
  }
);

// Thunk para subir PDF
export const upload_legal_pdf = createAsyncThunk(
  'legal/upload_pdf',
  async ({ formData, requisito_id }, { rejectWithValue }) => {
    try {
      // Añadir requisito_id al FormData
      formData.append('requisito_id', requisito_id);
      /*
      const response = await axiosInstance.post(
        '/message_center_api/legal_api/upload_pdf_attachments_ia',
        formData
      );
      */
      const response = await axiosInstance.post(
        '/message_center_api/legal_api/upload_pdf_attachments_ia',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error desconocido');
    }
  }
);

// Thunk para consultar progreso
export const check_progress_pdf = createAsyncThunk(
  'legal/check_progress',
  async ({ id_requisito, job_id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        '/message_center_api/legal_api/check_progress',
        { 
          params: { 
            id_requisito, 
            job_id 
          } 
        }
      );

      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error desconocido');
    }
  }
);

// Thunk para obtener texto segmentado
export const get_segmented_text = createAsyncThunk(
  'legal/get_segmented_text',
  async ({ doc_id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        '/message_center_api/legal_api/get_segmented_text',
        { params: { doc_id } }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error desconocido');
    }
  }
);

// ============================================
// THUNK 1: Consulta con prompt personalizado
// ============================================
export const bedrock_query = createAsyncThunk(
  'legal/bedrock_query',
  async ({ prompt, sessionId = null }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/legal_api/bedrock_query',
        {
          prompt,
          sessionId
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error en consulta Bedrock');
    }
  }
);

// ============================================
// THUNK 2: Obtener artículos con prompt predefinido
// ============================================
export const get_articles_knowledge_base = createAsyncThunk(
  'legal/get_articles_knowledge_base',
  async ({ doc_id = null, filter_type = 'obligations' }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/legal_api/get_articles_knowledge_base',
        {
          doc_id,
          filter_type
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error obteniendo artículos');
    }
  }
);

export const evalpdfAnalysisStandard = createAsyncThunk(
  '/tasklist_api/get_pdfstandard_analysis',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/message_center_api/legal_api/get_pdfstandard_analysis',
        //'/tasklist_api/get_requirements_attachments_ia', 
        formData, 
      );
      //console.log("TestResponseIA");
      //console.log(response?.data);
      return response?.data;
    } catch (error) {
      //console.error("Error en evalpdfIA:", error);
      return rejectWithValue(error.response?.data || 'Error desconocido');
    }
  }
);

//export const obtenerRequisitoData = async (id) => {
  
export const obtenerRequisitoData = createAsyncThunk(
  'legal/get_data_requisito',
  async (id, { rejectWithValue }) => {
    console.log("ID");
    console.log(id);
  try {
    const response = await axiosInstance.get(`/tasklegal/legal/get_data_requisito/${id}`);
    /*
    const response = await axiosInstance.post(
      "/message_center_api/legal_api/get_data_requisito", // Ruta del backend
      qs.stringify({ id }) // Formateamos los datos
    );
    */

    console.log("Respuesta del servidor:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return null;
  }
}
);

const fetchListLegalsSlice = createSlice({
  name: 'fetchListLegals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchListLegals.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchListLegals.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(fetchListLegals.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
  }
});

export default fetchListLegalsSlice.reducer;
