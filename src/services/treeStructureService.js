import axiosInstance from '../lib/axios';
/*
import axios from 'axios';
import { API_URL } from "../config/constants";

const API_BASE_URL = '';

const getAuthToken = () => {
  return localStorage.getItem('authToken') || '$2y$10$HYG/Oj2NUm2wKLquLxct7.CBHw4.B2p3Hs67vimGaWZldraKmwcSa';
};
*/

/**
 * Maneja errores de API de forma consistente
 * @param {Error} error - Error de Axios
 * @param {string} context - Contexto del error (para logging)
 * @returns {never}
 */
const handleApiError = (error, context) => {
  console.error(`[${context}] Error:`, error);
  
  if (error.response) {
    // El servidor respondió con un código de error
    const message = error.response.data?.message || 'Error del servidor';
    const status = error.response.status;
    
    throw new Error(`${message} (Status: ${status})`);
  } else if (error.request) {
    // La petición fue hecha pero no hubo respuesta
    throw new Error('No se pudo conectar con el servidor');
  } else {
    // Error al configurar la petición
    throw new Error(error.message || 'Error desconocido');
  }
};

const treeStructureService = {
  /**
   * Obtiene la estructura horizontal completa
   * @returns {Promise<Array>} Lista de nodos del árbol horizontal
   * @throws {Error} Si hay un error en la petición
   */
  getFullHorizontalStructure: async () => {
    try {
      const response = await axiosInstance.get(
        '/message_center_api/legal_api/getFullHorizontalStructure');
      /*
      const response = await axios.get(
        // `${API_BASE_URL}/message_center_api/legal_api/getFullHorizontalStructure`, 
        `${API_URL}/message_center_api/legal_api/getFullHorizontalStructure`, 
        {
          headers: {
            'Auth-Token': getAuthToken()
          }
        }
      );
      */
      return response.data.data || [];
    } catch (error) {
      handleApiError(error, 'getFullHorizontalStructure');
    }
  },

  /**
   * Obtiene la estructura vertical completa
   * @returns {Promise<Array>} Lista de nodos del árbol vertical
   * @throws {Error} Si hay un error en la petición
   */
  getFullVerticalStructure: async () => {
    try {
      const response = await axiosInstance.get(
        '/message_center_api/legal_api/getFullVerticalStructure');
      /*
      const response = await axios.get(
        // `${API_BASE_URL}/message_center_api/legal_api/getFullVerticalStructure`, 
        `${API_URL}/message_center_api/legal_api/getFullVerticalStructure`, 
        {
          headers: {
            'Auth-Token': getAuthToken()
          }
        }
      );
      */
      return response.data.data || [];
    } catch (error) {
      handleApiError(error, 'getFullVerticalStructure');
    }
  }
};

export default treeStructureService;