const API_BASE_URL = '';
//import { API_URL } from "../../config/constants";
import { API_URL } from "../config/constants";
import axiosInstance from '../lib/axios';

class LegalService {
  async getDropdownOptions() {
    //const url = `${API_BASE_URL}/api/message_center_api/legal_api/get_dropdown_options`;
    const response = await axiosInstance.get('/message_center_api/legal_api/get_dropdown_options');
    return response.data;
    /*
    const url = `${API_URL}/message_center_api/legal_api/get_dropdown_options`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth-Token': '$2y$10$HYG/Oj2NUm2wKLquLxct7.CBHw4.B2p3Hs67vimGaWZldraKmwcSa'
      },
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
    */
  }

  async createLegalRequirement(formData) {
    //const url = `${API_BASE_URL}/api/message_center_api/legal_api/create_legal`;
    // const url = `${API_URL}/message_center_api/legal_api/create_legal`;
    
    // Obtener el nombre de la autoridad si se envió un ID
    let emitidoporValue = formData.emitidopor;
    if (formData.emitidopor && formData.emitidoporName) {
      emitidoporValue = formData.emitidoporName;
    }
    
    const dataToSend = {
      ...formData,
      emitidopor: emitidoporValue,
      apply_lto: formData.apply_lto ? 'Apply' : null,
      new_or_renewal: formData.new_or_renewal || 0,
      id_alert: formData.id_alert && formData.id_alert !== '' ? parseInt(formData.id_alert) : null
    };
    
    const response = await axiosInstance.post('/message_center_api/legal_api/create_legal', dataToSend);
    return response.data;
    /*
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Auth-Token': '$2y$10$HYG/Oj2NUm2wKLquLxct7.CBHw4.B2p3Hs67vimGaWZldraKmwcSa'
      },
      body: JSON.stringify(dataToSend)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
    */
  }

  async getChildRequisito(params) {
    const formData = new FormData();
    formData.append('node', params.node || '');
    formData.append('requisito', params.requisito);
    formData.append('page', params.page || 1);
    formData.append('rows', params.rows || 10);
    formData.append('sidx', params.sidx || 'id_articulo');
    formData.append('sord', params.sord || 'asc');

    const response = await axiosInstance.post('/message_center_api/legal_api/get_child_requisito', formData);
    return response.data;
  }

  async createArticle(data) {
    const response = await axiosInstance.post('/message_center_api/legal_api/create_article', data);
    return response.data;
  }

  async getLegalCategories() {
    const response = await axiosInstance.get('/message_center_api/legal_api/list_legal_categories');
    return response.data;
  }

  async getArticleTypes() {
    const response = await axiosInstance.get('/message_center_api/legal_api/list_article_types');
    return response.data;
  }

  async getIdArticulo(id_requisito, id = '') {
    const response = await axiosInstance.post('/message_center_api/legal_api/list_id_articulo', { id, id_requisito });
    return response.data;
  }

  async getTemas() {
    const response = await axiosInstance.get('/message_center_api/legal_api/list_temas');
    return response.data;
  }

  async getArticleDetailsTable(legal_id) {
    const response = await axiosInstance.post('/message_center_api/legal_api/article_details_table', { legal_id });
    return response.data;
  }

  async getArticleDetailOperations(legal_id, article_id, level_str) {
    const response = await axiosInstance.post('/message_center_api/legal_api/article_detail_operations', {
      legal_id,
      article_id,
      level_str
    });
    return response.data;
  }

  async setArticleSpecialStatus(legal_id, article_id, level_str, status) {
    const response = await axiosInstance.post('/message_center_api/legal_api/set_article_special_status', {
      legal_id,
      article_id,
      level_str,
      status
    });
    return response.data;
  }

  async uploadAttachment(formData) {
    const response = await axiosInstance.post('/message_center_api/legal_api/upload_attachment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async getAttachments(type, upload_id, level_str) {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('upload_id', upload_id);
    formData.append('level_str', level_str);
    const response = await axiosInstance.post('/message_center_api/legal_api/get_attachments', formData);
    return response.data;
  }

  async deleteAttachment(file_id) {
    const formData = new FormData();
    formData.append('file_id', file_id);
    const response = await axiosInstance.post('/message_center_api/legal_api/delete_attachment', formData);
    return response.data;
  }

  async getTaskFormData() {
    const response = await axiosInstance.get('/message_center_api/legal_api/get_task_form_data');
    return response.data;
  }

  async getCountriesForTask(region_id) {
    const formData = new FormData();
    formData.append('region_id', region_id);
    const response = await axiosInstance.post('/message_center_api/legal_api/get_countries_for_task', formData);
    return response.data;
  }

  async getBusinessForTask(country_id) {
    const formData = new FormData();
    formData.append('country_id', country_id);
    const response = await axiosInstance.post('/message_center_api/legal_api/get_business_for_task', formData);
    return response.data;
  }

  async getPlantsForTask(business_id) {
    const formData = new FormData();
    formData.append('business_id', business_id);
    const response = await axiosInstance.post('/message_center_api/legal_api/get_plants_for_task', formData);
    return response.data;
  }

  async getSubfases(fase_id) {
    const formData = new FormData();
    formData.append('fase_id', fase_id);
    const response = await axiosInstance.post('/message_center_api/legal_api/get_subfases', formData);
    return response.data;
  }

  async getProgramsForTask(pma_id) {
    const formData = new FormData();
    formData.append('pma_id', pma_id);
    const response = await axiosInstance.post('/message_center_api/legal_api/get_programs_for_task', formData);
    return response.data;
  }

  async getSubprogramsForTask(program_id) {
    const formData = new FormData();
    formData.append('program_id', program_id);
    const response = await axiosInstance.post('/message_center_api/legal_api/get_subprograms_for_task', formData);
    return response.data;
  }

  async createTask(taskData) {
    const response = await axiosInstance.post('/message_center_api/legal_api/create_task', taskData);
    return response.data;
  }

  async getTasksLinkedToArticle(article_id, level_str) {
    const response = await axiosInstance.post('/message_center_api/legal_api/get_tasks_linked_to_article', {
      article_id,
      level_str
    });
    return response.data;
  }
}

export default new LegalService();