import {
  AddToPhotos,
  AutoAwesome,
  ExpandLess,
  ExpandMore,
  LabelImportant,
  MoreVert,
  AttachFile,
  UploadFile,
  Delete,
  SendRounded,
  AttachFileRounded,
  AutoFixHighRounded,
  SummarizeRounded,
  FormatListNumbered,
  FormatListBulleted,
  PictureAsPdfRounded
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  IconButton,
  List,
  Checkbox,   
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Tooltip,
  Typography,
  Tabs,
  Tab,
  LinearProgress,
  Card,
  CardContent,
  CircularProgress,
  Fade,
} from '@mui/material';

import { API_URL } from "../../config/constants";

import ContentPasteOffIcon from '@mui/icons-material/ContentPasteOff'; // Replace with your icon path

import { Fragment, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import LexicalInput from '../../components/Input/lexicalWYSWYG/LexicalInput';
import ChatInterface from '../../components/Input/lexicalWYSWYG/ChatInterface';
import ChatInputBox from '../../components/Input/lexicalWYSWYG/ChatInputBox';

import axios from 'axios';
import { 
  evalWithIA, 
  evalWithIAComplete,
  evalpdfIA, 
  evalAnalysis, 
  evalpdfAnalysisStandard,
  generateTasksFromArticlesWithIA,
  upload_legal_pdf,
  check_progress_pdf,
  bedrock_query, 
  get_articles_knowledge_base,
  evalWithIAcorrection,
  evalWithIAresume
  //fetchDataConection 
} from '../../stores/legal/fetchListLegalsSlice';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAutocompleteOptions,
  removeAllFilters,
  removeFilter,
  selectFilterItemValue,
  selectListOptions,
  selectAppliedFilterModel,
  setFilter
} from '../../stores/filterSlice';
//} from '../stores/filterSlice';

// Custom hook to get list options
const useListOptions = (module, fieldName) =>
  useSelector((state) => selectListOptions(state, module, fieldName));

const useListOptionsGlobal = (fieldName) =>
  useSelector((state) => state.globalData?.[fieldName] ?? []);

const useFilterItemValue = (module, fieldName) =>
  useSelector((state) => selectFilterItemValue(state, module, fieldName));

/*
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
*/

import * as pdfjsLib from 'pdfjs-dist';
//import { pdfjs } from 'pdfjs-dist';


// 🔧 Importar el worker directamente
//import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// ✅ Define correctamente el worker en entorno de producción y desarrollo
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/static/js/pdf.worker.min.mjs`;
//pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/static/js/pdf.worker.min.mjs`;

export default function AnalysisRegulation({
  handleMenuOpen = () => {},
  handleAIClick = () => {},
  handleLexicalInput = () => {},
  loadingAI = 'not clicked'
}) {
  
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loadingAIdata, setLoadingAIdata] = useState(false);
  const [aiData, setAiData] = useState();
  const [pdf, setPdf] = useState(null);
  const [userText, setUserText] = useState('');
  const [dataError, setDataError] = useState(false);

  const [openList, setOpenList] = useState({});
  const [openTaskList, setOpenTaskList] = useState({});
  
  const [tabIndexArticle, setTabIndexArticle] = useState(0);
  const [tabIndexTaskOptions, setTabIndexTaskOptions] = useState(0);
  const [tabIndexIA, setTabIndexIA] = useState(0);

  const [deleteIndex, setDeleteIndex] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  const [chatText, setChatText] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);

  const [customPrompt, setCustomPrompt] = useState('');
  //const [articlesIA, setArticlesIA] = useState([]);
  const [loadingArticlesIA, setLoadingArticlesIA] = useState(false);
  const [result, setResult] = useState(null);
  const [articlesIA, setArticlesIA] = useState(null);

  const [resultAnalysisData, setResultAnalysisData] = useState([]);
  //const [resultAnalysisData, setResultAnalysisData] = useState({});

  const [isSending, setIsSending] = useState(false);

  // datos de PDF
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [pdfDataError, setPDFDataError] = useState(false);
  const [progressPDF, setProgressPDF] = useState(0);
  const [processingStatusPDF, setProcessingStatusPDF] = useState(''); // 'IN_PROGRESS', 'SUCCEEDED', 'FAILED'
  const [resultFilesPDF, setResultFilesPDF] = useState([]);

  const [extractedText, setExtractedText] = useState(''); 
  const [textBlocks, setTextBlocks] = useState([]);

  const [currentStreamingBlock, setCurrentStreamingBlock] = useState(null);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(null);

  /*
  const [historicTextIA, setHistoricTextIA] = useState([
    {
      id: 1,
      label: "Conversación 1",
      contenido: [
        { role: "user", text: "Hola, ¿cómo estás?", timestamp: new Date() },
        { role: "assistant", text: "¡Hola! Estoy bien, gracias.", timestamp: new Date() }
      ]
    }
  ]);
  */
  
  //const [historicTextIA, setHistoricTextIA] = useState([]);
  const [historicTextIA, setHistoricTextIA] = useState([
    {
      id: Date.now(),
      label: "Conversación 1",
      contenido: []
    }
  ]);
  const [currentHistoricIAPosition, setCurrentHistoricIAPosition] = useState(0);
  const [loadingCorrection, setLoadingCorrection] = useState(false);
  const chatInterfaceRef = useRef(null);

  const [pdfProgress, setPdfProgress] = useState(0);

  //const articleDataList = useFilterItemValue('legalMatrix', 'article_data_list');

  
  //const [dataList, setDataList] = useState([]);
  //articleDataList

  // 🔧 Configurar el worker de PDF.js al montar el componente
  /*
  useEffect(() => {
    // Usar el worker local desde la carpeta public
    pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.mjs`;
    
    // Alternativa: Si no funciona, usa esta ruta
    // pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }, []);
  */
  

  // Configurar el worker al inicio
  /*
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  }, []);
  */
  

  const dataList = useSelector((state) => 
    selectFilterItemValue(state, 'legalMatrix', 'article_data_list')
  ) || [];

  
  const taskList = useSelector((state) => 
    selectFilterItemValue(state, 'legalMatrix', 'task_data_list')
  ) || [];

  const dataAnalysis = useSelector((state) => 
    selectFilterItemValue(state, 'legalMatrix', 'data_analysis')
  ) || [];

  const resultAnalysis = useSelector((state) => 
    selectFilterItemValue(state, 'legalMatrix', 'result_analysis')
  ) || {};

  
  const requisito_actual = useSelector((state) => 
    selectFilterItemValue(state, 'legalMatrix', 'requisito_actual')
  ) || null;

  const id_requisito_actual = useSelector((state) => 
    selectFilterItemValue(state, 'legalMatrix', 'id_requisito_actual')
  ) || null;

  const handleSetFilterItemValue = (module, id, value) => {
    if (!module) {
      console.error("El módulo es undefined o inválido");
      console.log("El módulo es undefined o inválido");
      return;
    }
    const payload = { 
      module, 
      updatedFilter: { [id]: value } // Debe estar dentro de `updatedFilter`
    };
    dispatch(setFilter(payload));
  };
  
  //handleSetFilterItemValue('task', 'selectedTaskView', view); // Guardar el valor en Redux
    
  
  const toggleListOpen = (index) => {
    setOpenList((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  
  const toggleTaskListOpen = (index) => {
    setOpenTaskList((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Función para agregar mensajes y hacer scroll
  const addMessageToChat = (role, text) => {
    const updatedHistoric = [...historicTextIA];
    updatedHistoric[currentHistoricIAPosition].contenido.push({
      role,
      text,
      timestamp: new Date()
    });
    setHistoricTextIA(updatedHistoric);
    
    // Hacer scroll solo después de agregar un mensaje
    setTimeout(() => {
      const chatArea = document.querySelector('.overflow-y-auto.bg-gray-50');
      if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight;
      }
    }, 100);
  };

  // Agregar mensaje al historial actual
  const addMessageToCurrentChat = (role, text) => {
    const updatedHistoric = [...historicTextIA];
    updatedHistoric[currentHistoricIAPosition].contenido.push({
      role,
      text,
      timestamp: new Date()
    });
    setHistoricTextIA(updatedHistoric);
  };

  const currentConversation = historicTextIA[currentHistoricIAPosition];

  // 🆕 Función para corregir texto con IA
  const onCorrectText = async () => {
    try {
      // Obtener la conversación actual
      const currentConversation = historicTextIA[currentHistoricIAPosition];
      
      // Verificar que haya contenido
      if (!currentConversation || currentConversation.contenido.length === 0) {
        console.warn('No hay mensajes en la conversación actual');
        return;
      }

      // Obtener el último mensaje
      const lastMessage = currentConversation.contenido[currentConversation.contenido.length - 1];
      const textToCorrect = lastMessage.text;

      // Verificar que haya texto
      if (!textToCorrect || textToCorrect.trim() === '') {
        console.warn('El último mensaje está vacío');
        return;
      }

      setLoadingCorrection(true);

      // Agregar mensaje temporal de "Corrigiendo..."
      addMessageToCurrentChat('assistant', 'Corrigiendo texto...');

      // Llamar a la API
      const resultAction = await dispatch(evalWithIAcorrection(textToCorrect));

      // Verificar si la llamada fue exitosa
      if (evalWithIAcorrection.fulfilled.match(resultAction)) {
        const correctedText = resultAction.payload;

        // Remover el mensaje temporal
        const updatedHistoric = [...historicTextIA];
        updatedHistoric[currentHistoricIAPosition].contenido.pop();
        
        // Agregar la respuesta de la IA
        updatedHistoric[currentHistoricIAPosition].contenido.push({
          role: 'assistant',
          text: correctedText,
          timestamp: new Date()
        });
        
        setHistoricTextIA(updatedHistoric);

        // Scroll al final
        setTimeout(() => {
          const chatArea = document.querySelector('.overflow-y-auto.bg-gray-50');
          if (chatArea) {
            chatArea.scrollTop = chatArea.scrollHeight;
          }
        }, 100);

      } else {
        // Si hubo error
        console.error('Error en la corrección:', resultAction.payload);
        
        // Remover mensaje temporal y agregar mensaje de error
        const updatedHistoric = [...historicTextIA];
        updatedHistoric[currentHistoricIAPosition].contenido.pop();
        updatedHistoric[currentHistoricIAPosition].contenido.push({
          role: 'assistant',
          text: 'Lo siento, hubo un error al corregir el texto. Por favor, intenta nuevamente.',
          timestamp: new Date()
        });
        setHistoricTextIA(updatedHistoric);
      }

    } catch (error) {
      console.error('Error al corregir texto:', error);
      
      // Agregar mensaje de error
      addMessageToCurrentChat(
        'assistant', 
        'Lo siento, ocurrió un error inesperado. Por favor, intenta nuevamente.'
      );
    } finally {
      setLoadingCorrection(false);
    }
  };
  
  // 🆕 Función para corregir texto con IA
  const onResumeText = async () => {
    try {
      // Obtener la conversación actual
      const currentConversation = historicTextIA[currentHistoricIAPosition];
      
      // Verificar que haya contenido
      if (!currentConversation || currentConversation.contenido.length === 0) {
        console.warn('No hay mensajes en la conversación actual');
        return;
      }

      // Obtener el último mensaje
      const lastMessage = currentConversation.contenido[currentConversation.contenido.length - 1];
      const textToCorrect = lastMessage.text;

      // Verificar que haya texto
      if (!textToCorrect || textToCorrect.trim() === '') {
        console.warn('El último mensaje está vacío');
        return;
      }

      setLoadingCorrection(true);

      // Agregar mensaje temporal de "Corrigiendo..."
      addMessageToCurrentChat('assistant', 'Resumiendo texto...');

      // Llamar a la API
      const resultAction = await dispatch(evalWithIAresume(textToCorrect));

      // Verificar si la llamada fue exitosa
      if (evalWithIAresume.fulfilled.match(resultAction)) {
        const correctedText = resultAction.payload;

        // Remover el mensaje temporal
        const updatedHistoric = [...historicTextIA];
        updatedHistoric[currentHistoricIAPosition].contenido.pop();
        
        // Agregar la respuesta de la IA
        updatedHistoric[currentHistoricIAPosition].contenido.push({
          role: 'assistant',
          text: correctedText,
          timestamp: new Date()
        });
        
        setHistoricTextIA(updatedHistoric);

        // Scroll al final
        setTimeout(() => {
          const chatArea = document.querySelector('.overflow-y-auto.bg-gray-50');
          if (chatArea) {
            chatArea.scrollTop = chatArea.scrollHeight;
          }
        }, 100);

      } else {
        // Si hubo error
        console.error('Resumen:', resultAction.payload);
        
        // Remover mensaje temporal y agregar mensaje de error
        const updatedHistoric = [...historicTextIA];
        updatedHistoric[currentHistoricIAPosition].contenido.pop();
        updatedHistoric[currentHistoricIAPosition].contenido.push({
          role: 'assistant',
          text: 'Lo siento, hubo un error al resumir el texto. Por favor, intenta nuevamente.',
          timestamp: new Date()
        });
        setHistoricTextIA(updatedHistoric);
      }

    } catch (error) {
      console.error('Error al corregir texto:', error);
      
      // Agregar mensaje de error
      addMessageToCurrentChat(
        'assistant', 
        'Lo siento, ocurrió un error inesperado. Por favor, intenta nuevamente.'
      );
    } finally {
      setLoadingCorrection(false);
    }
  };

  /*
  const handleUpload = async () => {
    setTabIndexArticle(0);
  
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('pdf_file', selectedFile);
  
    console.log("se hace request de texto a la API de la IA");
  
    setLoadingAIdata(true);
    setDataError(false);
  
    try {
      const data = await dispatch(evalpdfIA(formData));
  
      if (data != null && data?.payload?.messages === 'Success') {
        const response = data?.payload;
        if (response?.data != null && Array.isArray(response.data) && response.data.length > 0) {
          console.log("AI Response PDF");
          console.log(response);
          const updatedArticleList = [...dataList, ...response.data];
          handleSetFilterItemValue('legalMatrix', 'article_data_list', updatedArticleList);
          setLoadingAIdata(true);
        } else {
          console.error('response.data no es un array o está vacío:', response.data);
        }
      } else {
        console.error('Error de respuesta:', data);
        if (data?.error?.message === 'Rejected') {
          setDataError(true);
        }
      }
    } catch (error) {
      console.error('Error inesperado:', error?.stack || error?.message || error);
      setDataError(true);
      setLoadingAIdata(false);
    }
  };
  */

  // Función de polling
  const pollProgress = async (jobId) => {
    const maxAttempts = 120; // 120 intentos * 3 segundos = 6 minutos máximo
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        attempts++;

        try {
          const result = await dispatch(check_progress_pdf({ id_requisito: id_requisito_actual, job_id: jobId })).unwrap();
          
          // Actualizar progreso
          setProgress(result.progress || 0);
          setProcessingStatus(result.status);

          // En pollProgress, actualiza el resolve:
          if (result.status === 'SUCCEEDED') {
            clearInterval(intervalId);
            setProgress(100);
            setResultFiles(result.files || []);
            
            // 🆕 NUEVOS ESTADOS PARA TEXTO
            setExtractedText(result.extracted_text || '');      // Texto completo
            setTextBlocks(result.blocks || []);                 // Bloques segmentados
            
            resolve(result);
          }

          /*
          if (result.status === 'SUCCEEDED') {
            clearInterval(intervalId);
            setProgress(100);
            setResultFiles(result.files || []);
            resolve(result);
          } 
          */
          else if (result.status === 'FAILED') {
            clearInterval(intervalId);
            reject(new Error(result.error || 'Procesamiento fallido'));
          }
          else if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            reject(new Error('Tiempo máximo de espera excedido'));
          }

        } catch (error) {
          clearInterval(intervalId);
          reject(error);
        }
      }, 3000); // Consultar cada 3 segundos
    });
  };

  // Llamada al nuevo proceso de subir archivos con aws textract
  const handleUpload = async () => {
    console.log("🚀 Iniciando upload de PDF");
    setTabIndexArticle(0);

    if (!selectedFile) {
      console.log("Error: No hay archivo seleccionado");
      console.error('No hay archivo seleccionado');
      return;
    }

    const formData = new FormData();
    formData.append('pdf_file', selectedFile);

    console.log('Iniciando upload de PDF a la IA');

    setLoadingPDF(true);
    setPDFDataError(false);
    setProgressPDF(0);
    setProcessingStatusPDF('');
    setResultFilesPDF([]);
    setExtractedText('');
    setTextBlocks([]);
    
    // 🆕 Limpiar streaming
    setCurrentStreamingBlock(null);
    setCurrentBlockIndex(null);

    try {
      /*
      const uploadResult = await dispatch(
        upload_legal_pdf({ 
          formData, 
          id_requisito_actual 
        })
      */
      const uploadResult = await dispatch(
        upload_legal_pdf({
          formData,
          requisito_id: id_requisito_actual
        })
      ).unwrap();

      console.log('Upload exitoso:', uploadResult);

      if (uploadResult.mode === 'sync') {
        // Modo sync: mostrar todo de una vez
        setProgressPDF(100);
        setProcessingStatusPDF('SUCCEEDED');
        
        const blocks = uploadResult.blocks || [];
        setTextBlocks(blocks);
        
        const fullText = blocks.map(b => b.text).join('\n\n');
        setExtractedText(fullText);
        
        setLoadingPDF(false);
        return;
      }

      if (uploadResult.mode === 'async' && uploadResult.job_id) {
        console.log('Iniciando streaming para job:', uploadResult.job_id);
        setProcessingStatusPDF('IN_PROGRESS');

        // 🎯 Usar streaming en lugar de polling
        const finalResult = await streamProgress(uploadResult.job_id);
        
        console.log('Streaming completado:', finalResult);
        setLoadingPDF(false);
      }

    } catch (error) {
      console.error('Error en el procesamiento:', error);
      setPDFDataError(true);
      setProcessingStatusPDF('FAILED');
      setLoadingPDF(false);
      
      alert(`Error: ${error.message || 'Error desconocido'}`);
    }
};


  // Función de streaming con SSE
  const streamProgress = (jobId) => {
    return new Promise((resolve, reject) => {
      const eventSource = new EventSource(
        `/message_center_api/legal_api/stream_textract_progress?job_id=${jobId}`
      );

      let receivedBlocks = [];

      eventSource.addEventListener('progress', (e) => {
        const data = JSON.parse(e.data);
        setProgressPDF(data.progress);
        setProcessingStatusPDF(data.status);
        console.log('Progreso:', data.progress);
      });

      eventSource.addEventListener('block', (e) => {
        const data = JSON.parse(e.data);
        
        console.log(`Bloque ${data.index + 1}/${data.total} recibido`);
        
        // 🎯 Actualizar el bloque actual para mostrarlo incrementalmente
        setCurrentStreamingBlock(data.block);
        setCurrentBlockIndex(data.index);
        
        receivedBlocks.push(data.block);
        setTextBlocks([...receivedBlocks]);
        
        // Actualizar progreso basado en bloques
        const progress = Math.round((data.index + 1) / data.total * 100);
        setProgressPDF(progress);
      });

      eventSource.addEventListener('complete', (e) => {
        const data = JSON.parse(e.data);
        
        console.log('Streaming completado:', data);
        
        setProgressPDF(100);
        setProcessingStatusPDF('SUCCEEDED');
        setResultFilesPDF(data.files || []);
        
        // Construir texto completo
        const fullText = receivedBlocks.map(b => b.text).join('\n\n');
        setExtractedText(fullText);
        
        eventSource.close();
        resolve(data);
      });

      eventSource.addEventListener('error', (e) => {
        console.error('Error en streaming:', e);
        eventSource.close();
        reject(new Error('Error en streaming'));
      });

      eventSource.addEventListener('close', () => {
        eventSource.close();
      });
    });
  };


  // inicio de resulados por bedrock knowledge base
  // ============================================
  // 1. Consulta con prompt personalizado
  // ============================================
  const handleCustomQuery = async () => {

    /*
    if (!customPrompt.trim()) {
      alert('Por favor ingresa una pregunta');
      return;
    }
    */
   
    if (!userText.trim()) {
      alert('Por favor ingresa una pregunta');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await dispatch(
        bedrock_query({
          //prompt: customPrompt
          prompt: userText,
          sessionId: null
        })
      ).unwrap();

      console.log('✅ Respuesta de Bedrock:', response);
      setResult(response);
    } catch (error) {
      console.error('❌ Error:', error);
      alert(`Error: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 2. Obtener artículos con obligaciones (prompt predefinido)
  // ============================================
  const handleGetArticlesWithObligations = async () => {
    setLoadingArticlesIA(true);
    setArticlesIA(null);

    try {
      const response = await dispatch(
        get_articles_knowledge_base({
          filter_type: 'obligations'
        })
      ).unwrap();

      console.log('✅ Artículos obtenidos:', response);
      setArticlesIA(response);

      // ⭐ ACTUALIZAR ARTÍCULOS EN TIEMPO REAL
      const newArticles = Array.isArray(response.articulos) ? response.articulos : [];
      setArticles(prev => [...prev, ...newArticles]);
      //setArticles(response.articulos);
    } catch (error) {
      console.error('❌ Error:', error);
      alert(`Error: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoadingArticlesIA(false);
    }
  };

  // ============================================
  // 3. Obtener artículos con plazos
  // ============================================
  const handleGetArticlesWithDeadlines = async () => {
    setLoadingArticlesIA(true);
    setArticlesIA(null);

    try {
      const response = await dispatch(
        get_articles_knowledge_base({
          filter_type: 'deadlines'
        })
      ).unwrap();

      console.log('✅ Artículos con plazos:', response);
      setArticlesIA(response);
    } catch (error) {
      console.error('❌ Error:', error);
      alert(`Error: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoadingArticlesIA(false);
    }
  };
  // Fin de resulados por bedrock knowledge base

  const handleUploadAnalysisStandard = async () => {
    setTabIndexArticle(1);
    //const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('pdf_file', selectedFile);
    
    console.log("se hace request de texto a la API de la IA");

    setLoadingAIdata(true);
    setDataError(false);

    dispatch(evalpdfAnalysisStandard(formData)).then((data) => {
      const response = data?.payload;
      if (data?.payload?.messages === 'Success') {
        console.log("AI TEXT Response");
        console.log(response);
        setResultAnalysisData(response?.data);
        handleSetFilterItemValue('legalMatrix', 'resultAnalysis', response?.data);
        setLoadingAIdata(true);
      } else {
        console.log("Respuesta inesperada o vacía:", response);
        if (data?.error?.message === 'Rejected') {
          setDataError(true);
        }
      }
    });
  };

  /*
  const handleGetDataConnection = () => {
    setTabIndexArticle(1);
    console.log("se hace request de texto a la API de la IA");
    setLoadingAIdata(true);
    setDataError(false);
    
    dispatch(fetchDataConection()).then((data) => {
      const response = data?.payload;
    
      //if (Array.isArray(response) && response.length > 0) {
      if ( response?.data != null && data?.payload?.messages === 'Success') {
        console.log("AI TEXT Response");
        console.log(response);
        setResultAnalysisData(response?.data);
        handleSetFilterItemValue('legalMatrix', 'resultAnalysis', response?.data);
        setLoadingAIdata(true);
      } else {
        console.log("Respuesta inesperada o vacía:", response);
        if (data?.error?.message === 'Rejected') {
          setDataError(true);
        }
      }
    });
  };
  */
  
  const handleAIrequest = (evalText) => {
    setTabIndexArticle(1);
    console.log("se hace request de texto a la API de la IA");
    setLoadingAIdata(true);
    setDataError(false);
    
    //dispatch(evalWithIA(evalText)).then((data) => {
    dispatch(evalAnalysis(evalText)).then((data) => {
      const response = data?.payload;
    
      //if (Array.isArray(response) && response.length > 0) {
      if ( response?.data != null && data?.payload?.messages === 'Success') {
        console.log("AI TEXT Response");
        console.log(response);
        setResultAnalysisData(response?.data);
        handleSetFilterItemValue('legalMatrix', 'resultAnalysis', response?.data);
        setLoadingAIdata(true);
      } else {
        console.log("Respuesta inesperada o vacía:", response);
        if (data?.error?.message === 'Rejected') {
          setDataError(true);
        }
      }
    });
  };
  
  //const handleAIrequestArticles = (evalText) => {
  /*
  const handleAIrequestArticles = (evalText) => {
    setTabIndexArticle(0);
    console.log("se hace request de texto a la API de la IA");
    setLoadingAIdata(true);
    setDataError(false);
    
    //dispatch(evalWithIA(evalText)).then((data) => {
    dispatch(evalWithIAComplete(evalText)).then((data) => {
      const response = data?.payload;
    
      //if (Array.isArray(response) && response.length > 0) {
      if ( response?.data != null && data?.payload?.messages === 'Success') {
        console.log("AI TEXT Response");
        console.log(response);
        //setResultAnalysisData(response?.data);
        //handleSetFilterItemValue('legalMatrix', 'resultAnalysis', response?.data);
        //setLoadingAIdata(true);
      
        const updatedArticleList = [...dataList, ...response.data];
        console.log("updatedArticleList Nuevo:", updatedArticleList);
        //handleSetFilterItemValue('legalMatrix', 'article_data_list', updatedArticleList);
        //setLoadingAIdata(true);
      } else {
        console.log("Respuesta inesperada o vacía:", response);
        if (data?.error?.message === 'Rejected') {
          setDataError(true);
        }
      }
    });
  };
  */

  // Función para obtener los artículos procesando en bloques con lambda
  const handleAIrequestArticles = async (evalText) => {
    setTabIndexArticle(0);
    console.log("🚀 Iniciando procesamiento por bloques");
    
    // Reset estados
    setLoading(true);
    setError(null);
    setArticles([]); // Limpiar artículos previos
    
    try {
      // 1. Segmentar el texto
      const MAX_TOKENS_PER_BLOCK = 1000;
      const blocks = segmentTextIntoBlocks(evalText, MAX_TOKENS_PER_BLOCK);
      //const blocks = segmentContent(evalText, MAX_TOKENS_PER_BLOCK);

      console.log(`📦 Bloques generados:`, blocks);
      
      if (blocks.length === 0) {
        console.warn("⚠️ No se generaron bloques");
        setLoading(false);
        return;
      }

      // 2. Inicializar progreso
      setProgress({ current: 0, total: blocks.length });
      setMetadata({
        totalBlocks: blocks.length,
        startTime: new Date().toISOString(),
        tokenEstimate: blocks.reduce((sum, b) => sum + b.token_estimate, 0)
      });

      console.log(`📦 Total de bloques a procesar: ${blocks.length}`);
      
      // 3. Variables para tracking
      let processedCount = 0;
      let failedCount = 0;
      const failedBlocks = [];

      // 4. Función que procesa un bloque individual
      const processBlock = async (block, index) => {
        console.log(`⏳ Procesando bloque ${index + 1}/${blocks.length}`);
        
        try {
          const response = await dispatch(evalWithIAComplete(block.text)).unwrap();
          
          if (response?.data != null && response?.messages === 'Success') {
            console.log(`✅ Bloque ${index + 1} procesado exitosamente`);
            
            // ⭐ ACTUALIZAR ARTÍCULOS EN TIEMPO REAL
            const newArticles = Array.isArray(response.data) ? response.data : [];
            setArticles(prev => [...prev, ...newArticles]);
            
            // ⭐ ACTUALIZAR PROGRESO
            processedCount++;
            setProgress({ current: processedCount, total: blocks.length });
            
            return {
              success: true,
              blockIndex: index,
              articles: newArticles,
              block: block
            };
          } else {
            console.warn(`⚠️ Respuesta inesperada en bloque ${index + 1}:`, response);
            failedCount++;
            failedBlocks.push({ blockIndex: index, reason: 'Respuesta inesperada' });
            
            // Actualizar progreso aunque falle
            processedCount++;
            setProgress({ current: processedCount, total: blocks.length });
            
            return {
              success: false,
              blockIndex: index,
              error: 'Respuesta inesperada',
              block: block
            };
          }
        } catch (error) {
          console.error(`❌ Error en bloque ${index + 1}:`, error);
          failedCount++;
          failedBlocks.push({ blockIndex: index, reason: error.message });
          
          // Actualizar progreso aunque falle
          processedCount++;
          setProgress({ current: processedCount, total: blocks.length });
          
          return {
            success: false,
            blockIndex: index,
            error: error.message,
            block: block
          };
        }
      };

      // 5. Procesar con máximo 5 simultáneos
      await processBlocksWithConcurrency(
        blocks, 
        processBlock, 
        5
      );

      // 6. Resumen final
      console.log(`\n📊 Procesamiento completado:`);
      console.log(`  ✅ Exitosos: ${processedCount - failedCount}/${blocks.length}`);
      console.log(`  ❌ Fallidos: ${failedCount}/${blocks.length}`);

      // 7. Actualizar metadata final
      setMetadata(prev => ({
        ...prev,
        endTime: new Date().toISOString(),
        successfulBlocks: processedCount - failedCount,
        failedBlocks: failedCount,
        failedBlocksDetails: failedBlocks
      }));

      // 8. Manejar errores si los hay
      if (failedCount > 0) {
        setError(`${failedCount} bloque(s) fallaron en el procesamiento`);
      }

    } catch (error) {
      console.error("💥 Error general en el procesamiento:", error);
      setError(error.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener los artículos procesando en bloques
  const handleAIrequestArticlesByBlocks = async () => {

    // Obtener la conversación actual
    const currentConversation = historicTextIA[currentHistoricIAPosition];
    
    // Verificar que haya contenido
    if (!currentConversation || currentConversation.contenido.length === 0) {
      console.warn('No hay mensajes en la conversación actual');
      return;
    }

    // Obtener el último mensaje
    const lastMessage = currentConversation.contenido[currentConversation.contenido.length - 1];
    const evalText = lastMessage.text;

    // Verificar que haya texto
    if (!evalText || evalText.trim() === '') {
      console.warn('El último mensaje está vacío');
      return;
    }

    setLoadingArticlesIA(true);

    // Agregar mensaje temporal de "Corrigiendo..."
    addMessageToCurrentChat('assistant', 'Corrigiendo texto...');

    setTabIndexArticle(0);
    console.log("🚀 Iniciando procesamiento por bloques");
    
    // Reset estados
    setLoading(true);
    setError(null);
    setArticles([]); // Limpiar artículos previos
    
    try {
      // 1. Segmentar el texto
      const MAX_TOKENS_PER_BLOCK = 1000;
      const blocks = segmentTextIntoBlocks(evalText, MAX_TOKENS_PER_BLOCK);
      //const blocks = segmentContent(evalText, MAX_TOKENS_PER_BLOCK);

      console.log(`📦 Bloques generados:`, blocks);
      
      if (blocks.length === 0) {
        console.warn("⚠️ No se generaron bloques");
        setLoading(false);
        return;
      }

      // 2. Inicializar progreso
      setProgress({ current: 0, total: blocks.length });
      setMetadata({
        totalBlocks: blocks.length,
        startTime: new Date().toISOString(),
        tokenEstimate: blocks.reduce((sum, b) => sum + b.token_estimate, 0)
      });

      console.log(`📦 Total de bloques a procesar: ${blocks.length}`);
      
      // 3. Variables para tracking
      let processedCount = 0;
      let failedCount = 0;
      const failedBlocks = [];

      // 4. Función que procesa un bloque individual
      const processBlock = async (block, index) => {
        console.log(`⏳ Procesando bloque ${index + 1}/${blocks.length}`);
        
        try {
          const response = await dispatch(evalWithIAComplete(block.text)).unwrap();
          
          if (response?.data != null && response?.messages === 'Success') {
            console.log(`✅ Bloque ${index + 1} procesado exitosamente`);
            
            // ⭐ ACTUALIZAR ARTÍCULOS EN TIEMPO REAL
            const newArticles = Array.isArray(response.data) ? response.data : [];
            setArticles(prev => [...prev, ...newArticles]);
            
            // ⭐ ACTUALIZAR PROGRESO
            processedCount++;
            setProgress({ current: processedCount, total: blocks.length });
            
            return {
              success: true,
              blockIndex: index,
              articles: newArticles,
              block: block
            };
          } else {
            console.warn(`⚠️ Respuesta inesperada en bloque ${index + 1}:`, response);
            failedCount++;
            failedBlocks.push({ blockIndex: index, reason: 'Respuesta inesperada' });
            
            // Actualizar progreso aunque falle
            processedCount++;
            setProgress({ current: processedCount, total: blocks.length });
            
            return {
              success: false,
              blockIndex: index,
              error: 'Respuesta inesperada',
              block: block
            };
          }
        } catch (error) {
          console.error(`❌ Error en bloque ${index + 1}:`, error);
          failedCount++;
          failedBlocks.push({ blockIndex: index, reason: error.message });
          
          // Actualizar progreso aunque falle
          processedCount++;
          setProgress({ current: processedCount, total: blocks.length });
          
          return {
            success: false,
            blockIndex: index,
            error: error.message,
            block: block
          };
        }
      };

      // 5. Procesar con máximo 5 simultáneos
      await processBlocksWithConcurrency(
        blocks, 
        processBlock, 
        5
      );

      // 6. Resumen final
      console.log(`\n📊 Procesamiento completado:`);
      console.log(`  ✅ Exitosos: ${processedCount - failedCount}/${blocks.length}`);
      console.log(`  ❌ Fallidos: ${failedCount}/${blocks.length}`);

      // 7. Actualizar metadata final
      setMetadata(prev => ({
        ...prev,
        endTime: new Date().toISOString(),
        successfulBlocks: processedCount - failedCount,
        failedBlocks: failedCount,
        failedBlocksDetails: failedBlocks
      }));

      // 8. Manejar errores si los hay
      if (failedCount > 0) {
        setError(`${failedCount} bloque(s) fallaron en el procesamiento`);
      }

    } catch (error) {
      console.error("💥 Error general en el procesamiento:", error);
      setError(error.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Procesa bloques con límite de concurrencia
  const processBlocksWithConcurrency = async (blocks, processFn, maxConcurrent = 5) => {
    const results = [];
    const executing = [];
    
    for (const [index, block] of blocks.entries()) {
      // Crear promesa para este bloque
      const promise = processFn(block, index).then(result => {
        // Remover de la lista de ejecución cuando termine
        executing.splice(executing.indexOf(promise), 1);
        return result;
      });

      results.push(promise);
      executing.push(promise);

      // Si alcanzamos el límite, esperar a que termine al menos uno
      if (executing.length >= maxConcurrent) {
        await Promise.race(executing);
      }
    }

    // Esperar a que terminen todos
    return Promise.all(results);
  };

  // Segmenta el texto en bloques sin perder sentido y corrige palabras
  const segmentTextIntoBlocks = (text, maxTokens = 1000, customReplacements = {}) => {
    // Diccionario de correcciones por defecto
    const defaultReplacements = {
      'articulo': 'artículo',
      'Articulo': 'Artículo',
      'ARTICULO': 'ARTÍCULO'
    };

    // Combinar reemplazos por defecto con personalizados
    const replacements = { ...defaultReplacements, ...customReplacements };

    // Función para aplicar correcciones
    const applyCorrections = (inputText) => {
      let correctedText = inputText;
      let correctionsCount = 0;

      // Aplicar cada reemplazo usando expresiones regulares
      Object.entries(replacements).forEach(([incorrect, correct]) => {
        // Crear regex que busque la palabra completa (con límites de palabra)
        const regex = new RegExp(`\\b${incorrect}\\b`, 'g');
        const matches = correctedText.match(regex);
        
        if (matches) {
          correctionsCount += matches.length;
          correctedText = correctedText.replace(regex, correct);
        }
      });

      if (correctionsCount > 0) {
        console.log(`🔧 Se aplicaron ${correctionsCount} correcciones de texto`);
      }

      return correctedText;
    };

    // Aplicar correcciones al texto completo
    const correctedText = applyCorrections(text);

    // Dividir por párrafos (doble salto de línea)
    const paragraphs = correctedText.split(/\n\n+/).filter(p => p.trim());
    const blocks = [];
    let currentBlock = {
      order: 0,
      paragraphs: [],
      text: '',
      token_estimate: 0,
      char_start: 0,
      char_end: 0
    };
    
    let globalCharOffset = 0;

    paragraphs.forEach((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      const words = trimmedParagraph.split(/\s+/).length;
      const estimatedTokens = Math.ceil(words * 1.3); // Estimación aproximada

      // Si agregar este párrafo excede el límite
      if (currentBlock.token_estimate + estimatedTokens > maxTokens && currentBlock.paragraphs.length > 0) {
        // Cerrar bloque actual
        currentBlock.text = currentBlock.paragraphs.join('\n\n');
        currentBlock.char_end = globalCharOffset;
        blocks.push({ ...currentBlock });

        // Iniciar nuevo bloque
        currentBlock = {
          order: blocks.length,
          paragraphs: [trimmedParagraph],
          text: '',
          token_estimate: estimatedTokens,
          char_start: globalCharOffset,
          char_end: 0
        };
      } else {
        // Agregar al bloque actual
        currentBlock.paragraphs.push(trimmedParagraph);
        currentBlock.token_estimate += estimatedTokens;
      }

      globalCharOffset += paragraph.length + 2; // +2 por los \n\n
    });

    // Agregar último bloque si tiene contenido
    if (currentBlock.paragraphs.length > 0) {
      currentBlock.text = currentBlock.paragraphs.join('\n\n');
      currentBlock.char_end = globalCharOffset;
      blocks.push(currentBlock);
    }

    console.log(`✅ Texto segmentado en ${blocks.length} bloques`);
    return blocks;
  };

  /*
  // Segmenta el texto en bloques sin perder sentido
  const segmentTextIntoBlocks = (text, maxTokens = 1000) => {
    // Dividir por párrafos (doble salto de línea)
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    const blocks = [];
    let currentBlock = {
      order: 0,
      paragraphs: [],
      text: '',
      token_estimate: 0,
      char_start: 0,
      char_end: 0
    };
    
    let globalCharOffset = 0;

    paragraphs.forEach((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      const words = trimmedParagraph.split(/\s+/).length;
      const estimatedTokens = Math.ceil(words * 1.3); // Estimación aproximada

      // Si agregar este párrafo excede el límite
      if (currentBlock.token_estimate + estimatedTokens > maxTokens && currentBlock.paragraphs.length > 0) {
        // Cerrar bloque actual
        currentBlock.text = currentBlock.paragraphs.join('\n\n');
        currentBlock.char_end = globalCharOffset;
        blocks.push({ ...currentBlock });

        // Iniciar nuevo bloque
        currentBlock = {
          order: blocks.length,
          paragraphs: [trimmedParagraph],
          text: '',
          token_estimate: estimatedTokens,
          char_start: globalCharOffset,
          char_end: 0
        };
      } else {
        // Agregar al bloque actual
        currentBlock.paragraphs.push(trimmedParagraph);
        currentBlock.token_estimate += estimatedTokens;
      }

      globalCharOffset += paragraph.length + 2; // +2 por los \n\n
    });

    // Agregar último bloque si tiene contenido
    if (currentBlock.paragraphs.length > 0) {
      currentBlock.text = currentBlock.paragraphs.join('\n\n');
      currentBlock.char_end = globalCharOffset;
      blocks.push(currentBlock);
    }

    console.log(`✅ Texto segmentado en ${blocks.length} bloques`);
    return blocks;
  };
  */

  /**
   * Segmenta texto por tokens (MEJOR para IA)
   * @param {string} text - Texto a segmentar
   * @param {number} maxTokens - Número máximo de tokens por bloque
   * @returns {Array<Object>} - Array de bloques con metadata
   */
  const segmentContent = (text, maxTokens = 1000) => {
    const paragraphs = text.split(/\n\n+/);
    const blocks = [];
    let currentBlock = [];
    let currentTokens = 0;
    let charOffset = 0;

    paragraphs.forEach(paragraph => {
      const estimatedTokens = Math.ceil(paragraph.split(/\s+/).length * 1.3);
      
      if (currentTokens + estimatedTokens <= maxTokens) {
        currentBlock.push(paragraph);
        currentTokens += estimatedTokens;
      } else {
        if (currentBlock.length > 0) {
          blocks.push({
            order: blocks.length,
            text: currentBlock.join('\n\n'),
            char_start: charOffset,
            token_estimate: currentTokens
          });
          charOffset += currentBlock.join('\n\n').length + 2; // +2 por \n\n
        }
        
        currentBlock = [paragraph];
        currentTokens = estimatedTokens;
      }
    });

    if (currentBlock.length > 0) {
      blocks.push({
        order: blocks.length,
        text: currentBlock.join('\n\n'),
        char_start: charOffset,
        token_estimate: currentTokens
      });
    }

    return blocks;
  };
  
  /*
  const segmentContent = (text, maxTokens = 1000) => {
    const paragraphs = text.split(/\n\n+/);
    const blocks = [];
    let currentBlock = [];
    let currentTokens = 0;
    let charOffset = 0;

    paragraphs.forEach(paragraph => {
      const estimatedTokens = Math.ceil(paragraph.split(/\s+/).length * 1.3);
      
      // Si el párrafo completo cabe
      if (currentTokens + estimatedTokens <= maxTokens) {
        currentBlock.push(paragraph);
        currentTokens += estimatedTokens;
      } else {
        // Enviar bloque actual
        if (currentBlock.length > 0) {
          blocks.push({
            order: blocks.length,
            text: currentBlock.join('\n\n'),
            char_start: charOffset,
            token_estimate: currentTokens
          });
          charOffset += currentBlock.join('\n\n').length;
        }
        
        // Iniciar nuevo bloque
        currentBlock = [paragraph];
        currentTokens = estimatedTokens;
      }
    });

    // Último bloque
    if (currentBlock.length > 0) {
      blocks.push({
        order: blocks.length,
        text: currentBlock.join('\n\n'),
        char_start: charOffset,
        token_estimate: currentTokens
      });
    }

    return blocks;
  };
  */

  const ProcessingProgressBar = ({ progress, loading }) => {
    if (!loading && progress.current === 0) return null;

    const percentage = progress.total > 0 
      ? Math.round((progress.current / progress.total) * 100) 
      : 0;

    const isComplete = progress.current === progress.total && progress.total > 0;

    return (
      <Box 
        sx={{
          p: 2,
          backgroundColor: isComplete ? '#f0fdf4' : '#f0f9ff',
          border: `1px solid ${isComplete ? '#86efac' : '#bae6fd'}`,
          borderRadius: 2,
          mb: 2
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" fontWeight="medium">
            {loading ? '⏳ Procesando contenido...' : '✅ Procesamiento completado'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {progress.current}/{progress.total} bloques
          </Typography>
        </Box>

        {/* Barra de progreso */}
        <Box 
          sx={{
            width: '100%',
            height: 8,
            backgroundColor: '#e0f2fe',
            borderRadius: 1,
            overflow: 'hidden',
            mb: 1
          }}
        >
          <Box 
            sx={{
              width: `${percentage}%`,
              height: '100%',
              backgroundColor: isComplete ? '#22c55e' : '#0ea5e9',
              transition: 'width 0.3s ease, background-color 0.3s ease'
            }} 
          />
        </Box>

        {/* Detalles */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {percentage}% completado
          </Typography>
          
          {loading && (
            <Typography variant="caption" color="text.secondary">
              Máx. 5 bloques simultáneos
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  /*
  const handleAIrequestArticles = async (evalText) => {
    setTabIndexArticle(0);
    setLoadingAIdata(true);
    setDataError(false);
    setDataList([]); // si tienes lista previa

    try {
      const response = await fetch('/message_center_api/legal_api/get_requirements_complete_ia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({ dato: evalText }),
      });

      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Procesar eventos SSE por líneas
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const chunk of parts) {
          const eventMatch = chunk.match(/^event:\s*(\w+)/m);
          const dataMatch = chunk.match(/^data:\s*(.+)/m);
          if (!dataMatch) continue;

          const eventName = eventMatch ? eventMatch[1] : 'message';
          const data = JSON.parse(dataMatch[1]);

          switch (eventName) {
            case 'metadata':
              console.log('📋 Metadata inicial:', data);
              break;
            case 'article':
              console.log('🧩 Artículo procesado:', data);
              // Aquí puedes ir acumulando resultados parciales:
              setDataList(prev => [...prev, data.respuesta]);
              break;
            case 'complete':
              console.log('✅ Proceso completado:', data);
              setLoadingAIdata(false);
              break;
            case 'error':
              console.error('❌ Error SSE:', data);
              setDataError(true);
              break;
            default:
              console.log('Evento desconocido:', eventName, data);
          }
        }
      }
    } catch (err) {
      console.error('Error en stream:', err);
      setDataError(true);
    } finally {
      setLoadingAIdata(false);
    }
  };
  */

  const handleAIrequestAsyncArticles = async (evalText) => {
    setLoading(true);
    setError(null);
    setArticles([]);
    setProgress({ current: 0, total: 0 });

    try {
      const response = await fetch(
        `${API_URL}message_center_api/legal_api/get_requirements_complete_ia`,
        //"/message_center_api/legal_api/get_requirements_complete_ia",
        //"https://ocensacentral.dev.sofacto.info/message_center_api/legal_api/get_requirements_complete_ia",
        //'/message_center_api/legal_api/get_requirements_complete_ia'
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({ dato: evalText }),
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const chunk of parts) {
          const eventMatch = chunk.match(/^event:\s*(\w+)/m);
          const dataMatch = chunk.match(/^data:\s*(.+)/m);
          if (!dataMatch) continue;

          const eventName = eventMatch ? eventMatch[1] : "message";
          const data = JSON.parse(dataMatch[1]);

          switch (eventName) {
            case "metadata":
              setMetadata(data);
              setProgress({ current: 0, total: data.total_articulos });
              break;
            case "article":
              setArticles((prev) => [...prev, data.respuesta]);
              setResultAnalysisData((prev) => [...prev, data.respuesta]);
              setProgress((p) => ({
                ...p,
                current: Math.min(p.current + 1, p.total),
              }));
              console.log("Artículo procesado:", data);
              console.log("Progreso actual:", progress.current + 1, "de", progress.total);
              console.log("Articles hast ahora:", articles);
              console.log("resultAnalysisData hasta ahora:", resultAnalysisData);
              break;
            case "complete":
              setLoading(false);
              break;
            case "error":
              setError(data.message || "Error durante el análisis");
              setLoading(false);
              break;
            default:
              console.log("Evento desconocido:", eventName, data);
          }
        }
      }
    } catch (err) {
      console.error("❌ Error en stream:", err);
      setError(err.message);
      setLoading(false);
    }
  };
  
  const handleAIrequestTasksFormArticles = () => {
    setTabIndexTaskOptions(0);
    //setLoadingAIdata(true);
    //setDataError(false);
    const evalText = selectedArticles.map((article, index) => {
      // Recorre todas las claves del objeto para generar texto dinámico
      const fields = Object.entries(article)
        .map(([key, value]) => `${key}: ${value ?? ''}`)
        .join('\n');

      return `Artículo ${index + 1}:\n${fields}`;
    }).join('\n\n----------------------------------\n\n');

    console.log("Texto para generar tareas desde artículos seleccionados:");
    console.log(evalText);
    
    dispatch(generateTasksFromArticlesWithIA(evalText)).then((data) => {
      const response = data?.payload;
    
      //if (Array.isArray(response) && response.length > 0) {
      if ( response?.data != null && data?.payload?.messages === 'Success') {
        console.log("AI task TEXT Response");
        console.log(response);
        //setResultAnalysisData(response?.data);
        //handleSetFilterItemValue('legalMatrix', 'resultAnalysis', response?.data);
        //setLoadingAIdata(true);
      
        const updatedTaskList = [...taskList, ...response.data];
        handleSetFilterItemValue('legalMatrix', 'task_data_list', updatedTaskList);
        //setLoadingAIdata(true);
      } else {
        console.log("Respuesta inesperada o vacía:", response);
        if (data?.error?.message === 'Rejected') {
          setDataError(true);
        }
      }
    });
  };

  const ClearData = async () => {
    handleSetFilterItemValue('legalMatrix', 'article_data_list', []);
  }

  /*
  useEffect(() => {
    console.log('loadingAI', loadingAI);
    if (loadingAI === 'clicked' && !(userText === '')) {
      //setLoadingAIdata(true);
      handleAIrequest(userText);
    }
  }, [loadingAI, userText]);
  */

  /*
  useEffect(() => {
    console.log('userText: ', userText);
  }, [userText]);
  */


  /*
  useEffect(() => {
      console.log('userText:', userText);
  }, [userText]);
  */

  /*
  useEffect(() => {
    if(aiData){
      setLoadingAIdata(false);
    }
  }, [aiData]);
  */

  /*
  useEffect(() => {
    console.log('dataList change', dataList);
  }, [dataList]);
  */
  
  /*
  useEffect(() => {
    console.log('selectedFile change', selectedFile);
  }, [selectedFile]);
  */
  
  useEffect(() => {
    console.log('resultAnalysis change', resultAnalysis);
  }, [resultAnalysis]);
  
  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  // 🆕 Función para extraer texto del PDF
  const extractTextFromPDF = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      let fullText = '';

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        setPdfProgress(Math.round((pageNum / totalPages) * 100));

        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        let lastY = -1;
        let pageText = '';
        
        textContent.items.forEach((item) => {
          const y = item.transform[5];
          const text = item.str;
          
          // Nueva línea si cambió la posición Y
          if (lastY !== y && lastY !== -1) {
            pageText += '\n';
          }
          
          pageText += text;
          lastY = y;
        });
        
        // Limpiar líneas vacías múltiples
        pageText = pageText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0) // Eliminar líneas completamente vacías
          .join('\n');
        
        // 🆕 Agregar salto de línea antes de ARTÍCULO (con o sin tilde)
        pageText = pageText.replace(
          /(ARTÍCULO|ARTICULO)(\s+[A-Z]+\.?)/gi,
          '\n$1$2'
        );
        
        // 🆕 Limpiar posibles dobles saltos de línea al inicio
        pageText = pageText.replace(/^\n+/, '');
        
        // Formato de separador
        if (pageNum > 1) {
          fullText += '\n\n'; // Doble salto de línea entre páginas
        }
        
        fullText += `${'═'.repeat(10)}\n`;
        fullText += ` PÁGINA ${pageNum}\n`;
        fullText += `${'═'.repeat(10)}\n`;
        fullText += '\n';
        fullText += pageText;
      }

      return fullText.trim();
    } catch (error) {
      console.error('Error al extraer texto del PDF:', error);
      throw new Error('No se pudo leer el contenido del PDF');
    }
  };

  /*
  const extractTextFromPDF = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      let fullText = '';

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        setPdfProgress(Math.round((pageNum / totalPages) * 100));

        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        let lastY = -1;
        let pageText = '';
        
        textContent.items.forEach((item) => {
          const y = item.transform[5];
          const text = item.str;
          
          // Nueva línea si cambió la posición Y
          if (lastY !== y && lastY !== -1) {
            pageText += '\n';
          }
          
          pageText += text;
          lastY = y;
        });
        
        // Limpiar líneas vacías múltiples
        pageText = pageText
          .split('\n')
          .map(line => line.trim())
          .join('\n')
          .replace(/\n{3,}/g, '\n\n'); // Máximo 2 saltos de línea consecutivos
        
        // Agregar página al texto completo
        fullText += `\n╔${'═'.repeat(68)}╗\n`;
        fullText += `║ PÁGINA ${pageNum.toString().padEnd(60)} ║\n`;
        fullText += `╚${'═'.repeat(68)}╝\n\n`;
        fullText += pageText + '\n';
      }

      return fullText.trim();
    } catch (error) {
      console.error('Error al extraer texto del PDF:', error);
      throw new Error('No se pudo leer el contenido del PDF');
    }
  };
  */

  // 🆕 Función principal para manejar la subida del PDF
  const handleUploadPDFdirect = async (filePDF) => {
  try {
    setLoadingPDF(true);
    setPdfProgress(0);

    // Extraer texto del PDF
    const pdfText = await extractTextFromPDF(filePDF);

    // Verificar que se extrajo texto
    if (!pdfText || pdfText.trim() === '') {
      alert('No se pudo extraer texto del PDF. El archivo puede estar vacío o contener solo imágenes.');
      return;
    }

    // 🔧 Verificar si historicTextIA está vacío, si es así, crear primera conversación
    let updatedHistoric = [...historicTextIA];
    let currentPosition = currentHistoricIAPosition;

    if (updatedHistoric.length === 0) {
      // Crear primera conversación
      updatedHistoric = [{
        id: Date.now(),
        label: `PDF: ${filePDF.name.substring(0, 30)}${filePDF.name.length > 30 ? '...' : ''}`,
        contenido: []
      }];
      currentPosition = 0;
      setCurrentHistoricIAPosition(0);
    }

    // 🔧 Agregar mensaje del usuario indicando que subió un PDF
    updatedHistoric[currentPosition].contenido.push({
      role: 'user',
      text: `📄 Archivo PDF cargado: ${filePDF.name} (${(filePDF.size / 1024 / 1024).toFixed(2)} MB)`,
      timestamp: new Date()
    });

    // 🔧 Agregar el contenido extraído del PDF como respuesta del asistente
    updatedHistoric[currentPosition].contenido.push({
      role: 'assistant',
      text: pdfText,
      timestamp: new Date()
    });

    // Actualizar el estado
    setHistoricTextIA(updatedHistoric);

    // Scroll al final
    setTimeout(() => {
      const chatArea = document.querySelector('.overflow-y-auto.bg-gray-50');
      if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight;
      }
    }, 100);

    // Limpiar el archivo seleccionado
    setSelectedFile(null);
    setPdfProgress(100);

    console.log('✅ PDF procesado exitosamente');

  } catch (error) {
    console.error('Error al procesar PDF:', error);
    alert('Error al procesar el archivo PDF. Por favor, intenta nuevamente.');
    
    // 🔧 Agregar mensaje de error respetando la estructura
    let updatedHistoric = [...historicTextIA];
    
    // Si no hay conversaciones, crear una
    if (updatedHistoric.length === 0) {
      updatedHistoric = [{
        id: Date.now(),
        label: 'Error al cargar PDF',
        contenido: []
      }];
      setCurrentHistoricIAPosition(0);
    }
    
    updatedHistoric[currentHistoricIAPosition].contenido.push({
      role: 'assistant',
      text: '❌ Error al procesar el archivo PDF. Por favor, verifica que el archivo no esté dañado e intenta nuevamente.',
      timestamp: new Date()
    });
    
    setHistoricTextIA(updatedHistoric);

  } finally {
    setLoadingPDF(false);
  }
};
  
  const handleFileChange = (e) => {
    //console.log('File input changed');
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      handleUpload(); // adjuntar archivo PDF y cargar en textract
    } else {
      alert('Por favor selecciona un archivo PDF válido.');
    }
  };

  // Manejador del input de archivo
  const handleFilePDFChange = (e) => {
    const filePDF = e.target.files[0];
    
    if (filePDF && filePDF.type === 'application/pdf') {
      setSelectedFile(filePDF);
      handleUploadPDFdirect(filePDF);
    } else {
      alert('Por favor selecciona un archivo PDF válido.');
    }
  };

  /*
  const handleUpload = async () => {
    if (!selectedFile) return;

    //console.log('Archivo seleccionado:');
    //get_requirements_attachments_ia
    //    '/tasklist_api/get_requirements_ia',
    
    const formData = new FormData();
    formData.append('pdf_file', selectedFile);

    try {
      const response = await axios.post('/tasklist_api/get_requirements_ia', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Archivo subido con éxito:', response.data);
    } catch (err) {
      console.error('Error al subir archivo:', err);
    }
    
  };
  */

  /*
  const [editor] = useLexicalComposerContext();

  const handleClick = () => {
    editor.read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const selectedText = selection.getTextContent();
        console.log('Texto seleccionado:', selectedText);
        alert(`Texto seleccionado: ${selectedText}`);
      } else {
        alert('No hay texto seleccionado');
      }
    });
  };
  */
  
  const getCriticityColor = (level) => {
    switch (level) {
      case 'Alta':
        return 'error';
      case 'Media':
        return 'warning';
      case 'Baja':
        return 'success';
      default:
        return 'default';
    }
  };

  function deleteItemFromArray(array, indice) {
    return array.filter((_, i) => i !== indice);
  }

  const handleDelete = (indexToDelete) => {
    setDataList(prev => prev.filter((_, i) => i !== indexToDelete));
  };

  const [open, setOpen] = useState(true);
  const toggleOpen = () => setOpen(prev => !prev);
  //const [confirmOpen, setConfirmOpen] = useState(false);
  //const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState('');

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    setDataList(prev => prev.filter((_, i) => i !== deleteIndex));
    setConfirmOpen(false);
    setDeleteIndex(null);
  };

  const renderObligacionesCriticas = (obligaciones) =>
    obligaciones.map((obl, idx) => (
      <ListItemButton key={idx} sx={{ pl: 6 }}>
        <ListItemIcon><LabelImportant /></ListItemIcon>
        <ListItemText
          primary={`Obligación: ${obl.texto}`}
          secondary={
            <>
              <Typography variant="body2">Sujeto: {obl.sujeto}</Typography>
              <Typography variant="body2">Plazo: {obl.plazo}</Typography>
              <Typography variant="body2">Consecuencia: {obl.consecuencia_incumplimiento}</Typography>
              <Typography variant="body2">Criticidad: {obl.nivel_criticidad}</Typography>
            </>
          }
        />
      </ListItemButton>
    ));

  const renderArrayItems = (title, items) => (
    items.length > 0 &&
    <ListItemButton sx={{ pl: 4 }}>
      <ListItemText
        primary={title}
        secondary={items.map((item, i) => (
          <Typography key={i} variant="body2">• {item}</Typography>
        ))}
      />
    </ListItemButton>
  );

  const renderDefiniciones = (definiciones) =>
    Object.entries(definiciones).map(([key, value], idx) => (
      <ListItemButton key={idx} sx={{ pl: 4 }}>
        <ListItemText
          primary={`Definición: ${key}`}
          secondary={value}
        />
      </ListItemButton>
    ));

  const handleConfirmDelete = () => {
    //dispatch(deleteArticleDataItem(deleteIndex));
    const temporalList = deleteItemFromArray(dataList, deleteIndex);
    handleSetFilterItemValue('legalMatrix', 'article_data_list', temporalList);
    setConfirmOpen(false);
    setDeleteIndex(null);
    setDeleteItemName('');
  };

  const dummyFunctionText = (currentText) => {};
  const dummyFunctionAttachment = (attachment_file) => {
    console.log("Attachment file received:");
  };

  /*
  const handleFileChangeChatInbox = (file) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Por favor selecciona un archivo PDF válido.");
    }
  };
  */

  const handleFileChangeChatInbox = async (file) => {
    /*
    if (!file || file.type !== "application/pdf") {
      alert("Por favor selecciona un archivo PDF válido.");
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n\n";
    }

    setSelectedFile(file);
    //setInputText(fullText); // ← esto mostrará el texto en ChatInputBox
    setChatText(fullText);
    */

    // con estilos
    /*
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let formattedHTML = "";

    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const textContent = await page.getTextContent();
      
      const pageHTML = textContent.items
        .map((item) => {
          const fontSize = item.transform[0]; // tamaño aproximado
          const text = item.str.replace(/\s+/g, " ");
          return `<span style="font-size:${fontSize}px">${text}</span>`;
        })
        .join(" ");
      
      formattedHTML += `<div style="margin-bottom:16px">${pageHTML}</div>`;
    }
    //setInputText(formattedHTML);
    setChatText(formattedHTML);
    */

    if (!file || file.type !== "application/pdf") {
      alert("Por favor selecciona un archivo PDF válido.");
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let formattedText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      let lastY = null;
      let pageText = "";

      textContent.items.forEach((item) => {
        const y = item.transform[5];
        const fontSize = item.transform[0];
        const text = item.str.trim();

        // Saltos de línea por cambio vertical de posición
        if (lastY && Math.abs(lastY - y) > fontSize * 0.8) {
          pageText += "\n";
        }

        pageText += text + " ";
        lastY = y;
      });

      formattedText += pageText.trim() + "\n\n";
    }

    setSelectedFile(file);
    setChatText(formattedText);
  };

  const [selectedArticles, setSelectedArticles] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);

  const toggleSelection = (index) => {
    setSelectedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  //const [openList, setOpenList] = useState({});
  //const [selectedArticles, setSelectedArticles] = useState([]);

  /*
  const toggleListOpen = (index) => {
    setOpenList((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleListOpen = (index) => {
    setOpenList((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  */

  const handleSelectArticle = (data) => {
    console.log("Selecting article:", data);
    console.log("Currently selected articles:", selectedArticles);
    setSelectedArticles((prev) => {
      //const alreadySelected = prev.some((item) => item.requirement_name === data.requirement_name);
      const alreadySelected = prev.some((item) => item.id === data.id);
      if (alreadySelected) {
        // 🔹 quitar si ya está seleccionado
        return prev.filter((item) => item.id !== data.id);
      } else {
        // 🔹 agregar si no está
        return [...prev, data];
      }
    });
  };

  const ArticlesList = ({ articles, loading }) => {
    const endOfListRef = useRef(null);

    // Auto-scroll cuando llegan nuevos artículos
    useEffect(() => {
      if (articles.length > 0 && loading) {
        endOfListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, [articles.length, loading]);

    return (
      <Box mt={2} display="flex" flexDirection="column" gap={1}>
        {/* ... tu código de artículos ... */}
        
        {articles.map((art, idx) => (
          <Fade in key={idx} timeout={300}>
            {/* ... Card de artículo ... */}
          </Fade>
        ))}
        
        {/* Elemento invisible para auto-scroll */}
        <div ref={endOfListRef} />
      </Box>
    );
  };

  const isArticleSelected = (data) =>
    selectedArticles.some((item) => item.id === data.id);
    //selectedArticles.some((item) => item.requirement_name === data.requirement_name);

  const isTaskSelected = (data) =>
    selectedTask.some((item) => item.id === data.id);

  
  const handleSelectTask = (data) => {
    console.log("Selecting task:", data);
    console.log("Currently selected tasks:", selectedTask);
    setSelectedTask((prev) => {
      const alreadySelected = prev.some((item) => item.id === data.id);
      if (alreadySelected) {
        // 🔹 quitar si ya está seleccionado
        return prev.filter((item) => item.id !== data.id);
      } else {
        // 🔹 agregar si no está
        return [...prev, data];
      }
    });
  };

  /*
  onSend={(text) => handleSendToAPI(text)}
  onAttachFile={(file) => uploadAttachment(file)}
  onCorrectText={(text) => correctTextWithIA(text)}
  onSummarizeText={(text) => summarizeTextWithIA(text)}
  loading={isSending}
  */

  return (
    <>
    <Box flex={1} pt={0}>
        <Box
          sx={{
            display: 'flex',          // Habilita el layout en columnas
            flexDirection: 'row',     // Dirección horizontal
            gap: 2,                   // Espaciado entre columnas (opcional)
            width: '100%',            // Ocupa todo el ancho disponible
            mt: 2,                    // Margen superior como antes
          }}
        >
          <Box sx={{ flex: 1 }}>

            <Box
              sx={{
                display: 'flex',          // Habilita el layout en columnas
                flexDirection: 'row',     // Dirección horizontal
                gap: 2,                   // Espaciado entre columnas (opcional)
                width: '100%',            // Ocupa todo el ancho disponible
                mt: 2,                    // Margen superior como antes
              }}
            >
              {/* ===== COLUMNA 1  ===== */}
              <Box flex={6} pt={2}>
                <Box display="flex" flexDirection="column" gap={2}>
                  {/* Caja de texto para enviar */}

                  {/* 
                  <ChatInputBox
                    value={chatText}
                    //onChange={(text) => setChatText(text)}
                    onChange={setChatText}
                    //onSend={(text) => handleAIrequestArticles(text)}
                    onSend={handleAIrequestArticles}
                    onAttachFile={handleFileChangeChatInbox}
                    //onAttachFile={(file) => dummyFunctionAttachment(file)}
                    onCorrectText={(text) => dummyFunctionText(text)}
                    onSummarizeText={(text) => dummyFunctionText(text)}
                    onRuleAnalysisText={(text) => handleAIrequest(text)}
                    //onCreateTask={(text) => handleAIrequestAsyncArticles(text)}
                    onCreateTask={handleAIrequestAsyncArticles}
                    //loading={isSending}
                    loading={loading}
                  />
                  */}

                  <div className="w-full bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex flex-row gap-3 relative">
                    
                    {/* Columna 1: Textarea - ocupa todo el espacio disponible */}
                    <div className="flex-grow flex flex-col">

                      {/* Datos de PDF */}
                      <div>
                        {/* Input de archivo */}

                        {/* 
                        <input 
                          type="file" 
                          accept="application/pdf"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                        />

                        <button 
                          onClick={handleUpload} 
                          disabled={!selectedFile || loadingPDF}
                        >
                          {loadingPDF ? 'Procesando...' : 'Subir PDF'}
                        </button>
                        */}


                        <ChatInterface
                          ref={chatInterfaceRef}
                          historicTextIA={historicTextIA}
                          setHistoricTextIA={setHistoricTextIA}
                          currentHistoricIAPosition={currentHistoricIAPosition}
                          setCurrentHistoricIAPosition={setCurrentHistoricIAPosition}
                        >
                          {/* Todo tu contenido va DENTRO */}
                          <div className="flex-grow flex flex-col">
                            
                            {/* Mostrar nombre del archivo si existe */}
                            {selectedFile && (
                              <div style={{ 
                                marginBottom: '10px', 
                                padding: '8px', 
                                backgroundColor: '#f0f0f0', 
                                borderRadius: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}>
                                <AttachFileRounded fontSize="small" />
                                <span style={{ fontSize: '14px', color: '#333' }}>
                                  {selectedFile.name}
                                </span>
                                <span style={{ fontSize: '12px', color: '#666' }}>
                                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                </span>

                                <Tooltip title="Enviar">
                                  <IconButton
                                    onClick={handleUpload}
                                    disabled={loadingPDF}
                                    size="medium"
                                    className="bg-blue-600 text-white hover:bg-blue-700 rounded-full active:scale-95 transition-transform mt-2 !text-2xl"
                                  >
                                    {loadingPDF ? <CircularProgress size={28} color="inherit" /> : <SendRounded fontSize="medium" />}
                                  </IconButton>
                                </Tooltip>
                              </div>
                            )}

                            {/* Barra de progreso PDF */}
                            {loadingPDF && (
                              <div style={{ marginTop: '20px' }}>
                                <div style={{ 
                                  width: '100%', 
                                  backgroundColor: '#e0e0e0', 
                                  borderRadius: '5px',
                                  height: '30px',
                                  position: 'relative'
                                }}>
                                  <div style={{
                                    width: `${progressPDF}%`,
                                    backgroundColor: progressPDF === 100 ? '#4caf50' : '#2196f3',
                                    height: '100%',
                                    borderRadius: '5px',
                                    transition: 'width 0.3s ease'
                                  }} />
                                  <span style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontWeight: 'bold'
                                  }}>
                                    {progressPDF}%
                                  </span>
                                </div>
                                <p style={{ marginTop: '10px', textAlign: 'center' }}>
                                  Estado: {processingStatusPDF || 'Iniciando...'}
                                </p>
                              </div>
                            )}

                            {/* Mensaje de error */}
                            {pdfDataError && (
                              <div style={{ color: 'red', marginTop: '10px' }}>
                                Error al procesar el archivo. Por favor, intente nuevamente.
                              </div>
                            )}

                            {/* Resultados */}
                            {resultFilesPDF.length > 0 && !loadingPDF && (
                              <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '5px' }}>
                                <h3 style={{ margin: '0 0 10px 0', color: '#2e7d32', fontSize: '16px' }}>
                                  ✅ Archivo procesado exitosamente:
                                </h3>
                                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                  {resultFilesPDF.map((file, index) => (
                                    <li key={index} style={{ color: '#1b5e20' }}>{file}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* UN SOLO LexicalInput al final */}
                            <LexicalInput 
                              placeholder={t('')} 
                              JSONData={setUserText}
                              streamingBlock={currentStreamingBlock}
                              streamingBlockIndex={currentBlockIndex}
                            />
                          </div>
                        </ChatInterface>

                    </div>
                    </div>

                    {/* Columna 2: Botones verticales - ancho fijo 150px */}
                    <div className="w-[60px] flex flex-col items-center justify-start space-y-2">
                      
                      {/* Input file oculto con ID */}
                      <input
                        id="pdf-file-input"
                        type="file"
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        //onChange={handleFileChange}
                        onChange={handleFilePDFChange}
                      />

                      {/* Botón usando label en lugar de ref */}
                      <Tooltip 
                        title="Adjuntar archivo" 
                        sx={{
                          '& .MuiTooltip-tooltip': {
                            marginBottom: '8px',
                            paddingTop: '60px',
                          }
                        }}
                      >
                        <label htmlFor="pdf-file-input" style={{ cursor: 'pointer' }}>
                          <IconButton
                            component="span"
                            size="medium"
                            className="text-gray-600 hover:text-blue-600 !text-2xl"
                          >
                            <AttachFileRounded fontSize="105px" />
                          </IconButton>
                        </label>
                      </Tooltip>
              
                      {/* Botón Corregir texto */}
                      <Tooltip title="Corregir texto">
                        <IconButton
                          size="medium"
                          className="text-gray-600 hover:text-blue-600 !text-2xl"
                          //onClick={() => onCorrectText?.(text)}
                          onClick={onCorrectText}
                        >
                          <AutoFixHighRounded fontSize="medium" />
                        </IconButton>
                      </Tooltip>
              
                      {/* Botón Resumir texto */}
                      <Tooltip title="Resumir texto">
                        <IconButton
                          size="medium"
                          className="text-gray-600 hover:text-blue-600 !text-2xl"
                          //onClick={() => onSummarizeText?.(text)}
                          onClick={onResumeText}
                        >
                          <SummarizeRounded fontSize="medium" />
                        </IconButton>
                      </Tooltip>
              
                      {/* Botón Análisis de norma */}
                      <Tooltip title="Análisis de norma">
                        <IconButton
                          size="medium"
                          className="text-gray-600 hover:text-blue-600 !text-2xl"
                          //onClick={() => onRuleAnalysisText?.(text)}
                          //onClick={onRuleAnalysisText}
                          onClick={handleAIrequestArticlesByBlocks}
                        >
                          <AutoAwesome fontSize="medium" />
                        </IconButton>
                      </Tooltip>
              
                      <Tooltip title="Análisis de artículos">
                        <IconButton
                          size="medium"
                          className="text-gray-600 hover:text-blue-600 !text-2xl"
                          //onClick={''}
                          //onClick={() => onCreateTask?.(text)}
                          //onClick={onCreateTask}
                          //onClick={() => handleAIrequestArticles?.(userText)}
                          onClick={handleGetArticlesWithObligations}
                        >
                          <FormatListBulleted fontSize="medium" />
                        </IconButton>
                      </Tooltip>
              
                      {/* Botón Enviar */}
                      <Tooltip title="Enviar">
                        <IconButton
                          //onClick={handleSend}
                          //onClick={() => handleAIrequestAsyncArticles?.(userText)}
                          onClick={handleCustomQuery}
                          disabled={loading}
                          size="medium"
                          className="bg-blue-600 text-white hover:bg-blue-700 rounded-full active:scale-95 transition-transform mt-2 !text-2xl"
                        >
                          {loading ? <CircularProgress size={28} color="inherit" /> : <SendRounded fontSize="medium" />}
                        </IconButton>
                      </Tooltip>
                    </div>
              
                    <input
                      type="file"
                      ref={fileInputRef}
                      //onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </Box>
              </Box>

              {/* ===== COLUMNA 2  ===== */}
              <Box
                sx={{
                  flex: 4,
                  borderLeft: '1px solid #ccc', // separador visual (opcional)
                  pl: 2, // padding interno
                }}
              >
                {/* Aquí irá tu contenido de la segunda columna */}
                <Box
                  sx={{
                    display: 'flex',          // Habilita el layout en columnas
                    flexDirection: 'row',     // Dirección horizontal
                    gap: 2,                   // Espaciado entre columnas (opcional)
                    width: '100%',            // Ocupa todo el ancho disponible
                    mt: 0,                    // Margen superior como antes
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',          // Habilita el layout en columnas
                      flexDirection: 'row',     // Dirección horizontal
                      gap: 2,                   // Espaciado entre columnas (opcional)
                      width: '100%',            // Ocupa todo el ancho disponible
                      mt: 2,                    // Margen superior como antes
                    }}
                  >
                    <Box flex={1} pt={2}>
                      <Tabs 
                        value={tabIndexArticle} 
                        onChange={(e, newValue) => setTabIndexArticle(newValue)}
                        className='mb-4'
                      >
                        <Tab label={t("Articles list")} />
                        <Tab label={t("Bloques")} />
                        <Tab label={t("Tareas sugeridas")} />
                        <Tab label={t("Standard analysis")} />
                      </Tabs>

                      {tabIndexArticle === 0 && (
                        <>
                          {/* Mostrar progreso */}
                          
                          {metadata && (
                            <Box mt={2}>
                              <Typography variant="body2" color="textSecondary">
                                Procesando artículos ({progress.current}/{progress.total})
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={
                                  progress.total > 0
                                    ? (progress.current / progress.total) * 100
                                    : 0
                                }
                                sx={{ height: 8, borderRadius: 5, mt: 1 }}
                              />
                            </Box>
                          )}
                          

                          {/* Mostrar error */}
                          
                          {error && (
                            <Typography color="error" variant="body2" mt={1}>
                              {error}
                            </Typography>
                          )}
                          

                          {/* Mostrar artículos recibidos */}
                          
                          {articles.length > 0 && (
                            <Box mt={2} display="flex" flexDirection="column" gap={1}>
                              <Typography variant="h6">
                                Resultados procesados ({articles.length})
                              </Typography>
                              <Divider />

                              {articles.map((art, idx) => (
                                <Card
                                  key={idx}
                                  variant="outlined"
                                  sx={{
                                    borderLeft: "5px solid #1976d2",
                                    backgroundColor: "#fafafa",
                                  }}
                                >
                                  <CardContent>
                                    <Typography variant="subtitle1" color="primary">
                                      Artículo {idx + 1} — {art.numero_articulo}
                                    </Typography>

                                    <Typography variant="body2">
                                      <strong>Obligación:</strong> {art.descripcion_obligacion}
                                    </Typography>

                                    <Typography variant="body2">
                                      <strong>Sujeto obligado:</strong> {art.sujeto_obligado}
                                    </Typography>

                                    <Typography variant="body2">
                                      <strong>Plazo:</strong> {art.plazo}
                                    </Typography>

                                    <Typography variant="body2">
                                      <strong>Prioridad:</strong> {art.nivel_prioridad}
                                    </Typography>

                                    <Typography variant="body2">
                                      <strong>Confianza:</strong> {Math.round(art.prob_task * 100)}%
                                    </Typography>
                                  </CardContent>
                                </Card>
                              ))}
                            </Box>
                          )}

                          {/* Barra de progreso */}
                          <ProcessingProgressBar progress={progress} loading={loading} />

                          {/* Mostrar error si existe */}
                          {error && (
                            <Box mt={2}>
                              <Alert severity="warning" onClose={() => setError(null)}>
                                {error}
                              </Alert>
                            </Box>
                          )}

                          {/* Metadata del procesamiento */}
                          {metadata && !loading && (
                            <Box mt={2} mb={2}>
                              <Chip 
                                label={`${metadata.totalBlocks} bloques procesados`} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                                sx={{ mr: 1 }}
                              />
                              <Chip 
                                label={`~${metadata.tokenEstimate} tokens estimados`} 
                                size="small" 
                                color="secondary" 
                                variant="outlined"
                              />
                            </Box>
                          )}

                          {/* Mostrar artículos recibidos EN TIEMPO REAL */}
                          {articles.length > 0 && (
                            <Box mt={2} display="flex" flexDirection="column" gap={1}>
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">
                                  Resultados procesados ({articles.length})
                                </Typography>
                                
                                {loading && (
                                  <Chip 
                                    label="Recibiendo..." 
                                    size="small" 
                                    color="info" 
                                    icon={<CircularProgress size={12} />}
                                  />
                                )}
                              </Box>
                              
                              <Divider />
                              
                              {articles.map((art, idx) => (
                                <Fade in key={idx} timeout={300}>
                                  <Card
                                    variant="outlined"
                                    sx={{
                                      borderLeft: "5px solid #1976d2",
                                      backgroundColor: "#fafafa",
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        boxShadow: 2,
                                        backgroundColor: '#fff'
                                      }
                                    }}
                                  >
                                    <CardContent>
                                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="subtitle1" color="primary" fontWeight="medium">
                                          Artículo {idx + 1}
                                        </Typography>
                                        
                                        {/* Badge "Nuevo" para los últimos 3 artículos mientras está cargando */}
                                        {loading && idx >= articles.length - 3 && (
                                          <Chip 
                                            label="Nuevo" 
                                            size="small" 
                                            color="success" 
                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                          />
                                        )}
                                      </Box>
                                      
                                      <Typography variant="body2" color="textSecondary">
                                        {art?.texto || art?.title || JSON.stringify(art)}
                                      </Typography>
                                      
                                      {/* Mostrar metadata del artículo si existe */}
                                      {art?.metadata && (
                                        <Box mt={1}>
                                          <Typography variant="caption" color="text.disabled">
                                            {Object.entries(art.metadata)
                                              .slice(0, 2)
                                              .map(([key, val]) => `${key}: ${val}`)
                                              .join(' • ')}
                                          </Typography>
                                        </Box>
                                      )}
                                    </CardContent>
                                  </Card>
                                </Fade>
                              ))}
                            </Box>
                          )}

                          {/* Mensaje cuando no hay artículos y no está cargando */}
                          {!loading && articles.length === 0 && !error && (
                            <Box mt={3} textAlign="center" py={4}>
                              <Typography variant="body2" color="text.secondary">
                                No se han procesado artículos aún
                              </Typography>
                            </Box>
                          )}
                            
                        </>
                      )}
                      {tabIndexArticle === 1 && (
                        <>
                          {
                            (loadingAIdata && dataList.length === 0 && !dataError) ? (
                              <>
                                {[...Array(4)].map((_, index) => (
                                  <Box key={index} display="flex" flexDirection="row" gap={2} mb={4}>
                                    <Skeleton variant="circular" width={60} height={60} />
                                    <Skeleton variant="rounded" width="80%" height={60} />
                                  </Box>
                                ))}
                                <Typography variant="h6" align="center" color="gray">
                                  {t('loading_ai')}
                                </Typography>
                              </>
                            ) : dataList.length > 0  && !dataError ? (
                              <>
                                <List
                                  component="nav"
                                  sx={{
                                    width: '100%',
                                    border: '1px solid rgb(209, 208, 208)',
                                    borderRadius: '8px',
                                    padding: '0'
                                  }}
                                >
                                  {dataList.map((data, index) => (
                                    <Fragment key={index}>
                                      <ListItemButton 
                                        //onClick={() => toggleListOpen(index)}
                                        >
                                        {/* ✅ Checkbox antes del ícono */}
                                        <Checkbox
                                          edge="start"
                                          //checked={!!selectedItems[index]}
                                          checked={isArticleSelected(data)}
                                          tabIndex={-1}
                                          disableRipple
                                          /*
                                          onChange={(e) => {
                                            e.stopPropagation(); // evita que se abra/cierre el collapse al hacer clic en el checkbox
                                            toggleSelection(index);
                                          }}
                                          */
                                          onClick={(e) => e.stopPropagation()}
                                          onChange={() => handleSelectArticle(data)}
                                          sx={{ mr: 0.5 }}
                                        />

                                        {openList[index] ? <ExpandLess onClick={() => toggleListOpen(index)} /> : <ExpandMore onClick={() => toggleListOpen(index)} />}

                                        {/*
                                        <ListItemIcon>
                                          <AddToPhotos />
                                        </ListItemIcon>
                                        */ }

                                        <Box
                                          display="flex"
                                          justifyContent="space-between"
                                          alignItems="center"
                                          flexGrow={1}
                                          sx={{ ml: 1 }}
                                        >
                                          <ListItemText primary={data.requirement_name} />

                                          <IconButton
                                            edge="end"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteClick(index);
                                            }}
                                            sx={{ color: 'gray', mr: 1 }}
                                          >
                                            <Delete />
                                          </IconButton>
                                        </Box>

                                        <IconButton onClick={handleMenuOpen}>
                                          <MoreVert />
                                        </IconButton>

                                      </ListItemButton>

                                      <Collapse in={!!openList[index]} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                          <ListItemButton sx={{ pl: 4, marginBottom: 2 }}>
                                            <ListItemIcon>
                                              <LabelImportant />
                                            </ListItemIcon>

                                            <Box display="flex" flexDirection="column" flexGrow={1} gap={1}>
                                              <ListItemText
                                                primary={`Descripción: ${data.requirement_description}`}
                                                secondary={`Artículo: ${data.article_name}`}
                                              />

                                              <Box display="flex" alignItems="center" gap={2}>
                                                {data?.date_of_enforcement && (
                                                  <Tooltip title="Expiration Date">
                                                    <Typography variant="body2">{data?.date_of_enforcement}</Typography>
                                                  </Tooltip>
                                                )}
                                              </Box>

                                              <Box display="flex" alignItems="center" gap={2}>
                                                <Tooltip title={t("Criticity")}>
                                                  <Chip
                                                    label={t(data["criticity"])}
                                                    color={getCriticityColor(data["criticity"])}
                                                    size="small"
                                                  />
                                                </Tooltip>
                                              </Box>

                                              <Box display="flex" alignItems="center" gap={2}>
                                                {data?.related_rule && (
                                                  <Tooltip title="Norma relacionada">
                                                    <Typography variant="body2">{data?.related_rule}</Typography>
                                                  </Tooltip>
                                                )}
                                              </Box>

                                            </Box>
                                          </ListItemButton>
                                        </List>
                                      </Collapse>

                                      <Divider />
                                    </Fragment>
                                  ))}
                                </List>

                                {/*}
                                <Box
                                  sx={{
                                    height: '10%',
                                    border: '2px dashed #19aabb',
                                    marginTop: '20px'
                                  }}
                                  align="center"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Typography variant="h4" color="primary">
                                    + {t('Save')}
                                  </Typography>
                                </Box>
                                */}
                              </>
                            ) : (!loadingAIdata && dataList.length === 0 && !dataError) ? (
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                p={2}
                                m={2}
                              >
                                <ContentPasteOffIcon sx={{ fontSize: 100 }} />
                                <Typography variant="h6" color="textSecondary">
                                  {t('No data available')}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {t('emptyEventDesc')}
                                </Typography>
                              </Box>
                            ) : ( dataError ) ? (
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                p={2}
                                m={2}
                              >
                                <ContentPasteOffIcon sx={{ fontSize: 100 }} />
                                <Typography variant="h6" color="textSecondary">
                                  {t('Error loading data')}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {t('emptyEventDesc')}
                                </Typography>
                              </Box>
                            ) : (
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                p={2}
                                m={2}
                              >
                                <ContentPasteOffIcon sx={{ fontSize: 100 }} />
                                <Typography variant="h6" color="textSecondary">
                                  {t('Try again')}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {t('emptyEventDesc')}
                                </Typography>
                              </Box>
                            )
                          }
                        </>
                      )}

                      {tabIndexArticle === 3 && resultAnalysisData && (
                        <List 
                          component="nav"
                          sx={{
                            width: '100%',
                            border: '1px solid rgb(209, 208, 208)',
                            borderRadius: '8px',
                            padding: '0'
                          }}
                        >
                          <Fragment>
                            <ListItemButton onClick={toggleOpen}>
                              <ListItemIcon><AddToPhotos /></ListItemIcon>
                              <ListItemText primary="Análisis del Documento" />
                              {open ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        
                            <Collapse in={open} timeout="auto" unmountOnExit>
                              <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }}>
                                  <ListItemText
                                    primary={`Tipo de Documento: ${resultAnalysisData?.tipo_documento || 'No especificado'}`}
                                    secondary={
                                      <>
                                        <Typography variant="body2">Tono: {resultAnalysisData?.tono_general || 'No especificado'}</Typography>
                                        <Typography variant="body2">Urgencia: {resultAnalysisData?.nivel_urgencia || 'No especificado'}</Typography>
                                        <Typography variant="body2">Coerción: {resultAnalysisData?.nivel_coercion || 'No especificado'}</Typography>
                                      </>
                                    }
                                  />
                                </ListItemButton>

                                {Array.isArray(resultAnalysisData?.obligaciones_criticas) && resultAnalysisData.obligaciones_criticas.length > 0 &&
                                  renderObligacionesCriticas(resultAnalysisData.obligaciones_criticas)}
                        
                                {Array.isArray(resultAnalysisData?.temas_principales) && resultAnalysisData.temas_principales.length > 0 &&
                                  renderArrayItems('Temas Principales', resultAnalysisData.temas_principales)}
                        
                                {Array.isArray(resultAnalysisData?.plazos_inmediatos) && resultAnalysisData.plazos_inmediatos.length > 0 &&
                                  renderArrayItems('Plazos Inmediatos', resultAnalysisData.plazos_inmediatos)}
                        
                                {Array.isArray(resultAnalysisData?.ambigüedades_identificadas) && resultAnalysisData.ambigüedades_identificadas.length > 0 &&
                                  renderArrayItems('Ambigüedades Identificadas', resultAnalysisData.ambigüedades_identificadas)}
                        
                                {Array.isArray(resultAnalysisData?.definiciones_clave) && resultAnalysisData.definiciones_clave.length > 0 &&
                                  renderDefiniciones(resultAnalysisData.definiciones_clave)}
                        
                                {Array.isArray(resultAnalysisData?.excepciones_mencionadas) && resultAnalysisData.excepciones_mencionadas.length > 0 &&
                                  renderArrayItems('Excepciones Mencionadas', resultAnalysisData.excepciones_mencionadas)}
                        
                                {Array.isArray(resultAnalysisData?.entidades_afectadas) && resultAnalysisData.entidades_afectadas.length > 0 &&
                                  renderArrayItems('Entidades Afectadas', resultAnalysisData.entidades_afectadas)}
                        
                                {Array.isArray(resultAnalysisData?.referencias_internas) && resultAnalysisData.referencias_internas.length > 0 &&
                                  renderArrayItems('Referencias Internas', resultAnalysisData.referencias_internas)}
                        
                                {Array.isArray(resultAnalysisData?.menciones_de_otras_leyes) && resultAnalysisData.menciones_de_otras_leyes.length > 0 &&
                                  renderArrayItems('Menciones de Otras Leyes', resultAnalysisData.menciones_de_otras_leyes)}
                        
                                {resultAnalysisData?.analisis_crítico && (
                                  <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemText
                                      primary="Análisis Crítico"
                                      secondary={resultAnalysisData.analisis_crítico}
                                    />
                                  </ListItemButton>
                                )}
                                
                              </List>
                            </Collapse>
                        
                            <Divider />
                          </Fragment>
                        </List>
                      )}
                      {tabIndexArticle === 2 &&  (
                        <>
                          <Box display="flex" 
                          justifyContent="left" 
                          //alignItems="center" 
                          //</>height="200px"
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleAIrequestTasksFormArticles} // 🔹 crea esta función según lo que quieras hacer
                              //disabled={selectedArticles.length === 0}
                            >
                              {t("Generar tareas")}
                            </Button>
                          </Box>

                          <List
                            component="nav"
                            sx={{
                              width: '100%',
                              border: '1px solid rgb(209, 208, 208)',
                              borderRadius: '8px',
                              padding: '0'
                            }}
                          >
                            {taskList.map((data, index) => (
                              <Fragment key={index}>
                                <ListItemButton>
                                  {
                                  <Checkbox
                                    edge="start"
                                    checked={isTaskSelected(data)}
                                    tabIndex={-1}
                                    disableRipple
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={() => handleSelectTask(data)}
                                    sx={{ mr: 0.5 }}
                                  />
                                  }

                                  {openList[index]
                                    ? <ExpandLess onClick={() => toggleTaskListOpen(index)} />
                                    : <ExpandMore onClick={() => toggleTaskListOpen(index)} />}

                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    flexGrow={1}
                                    sx={{ ml: 1 }}
                                  >
                                    <ListItemText primary={data.task_title} />

                                    <IconButton
                                      edge="end"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(index);
                                      } }
                                      sx={{ color: 'gray', mr: 1 }}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Box>

                                  <IconButton onClick={handleMenuOpen}>
                                    <MoreVert />
                                  </IconButton>
                                </ListItemButton>

                                <Collapse in={!!openTaskList[index]} timeout="auto" unmountOnExit>
                                  <List component="div" disablePadding>
                                    <ListItemButton sx={{ pl: 4, marginBottom: 2 }}>
                                      <ListItemIcon>
                                        <LabelImportant />
                                      </ListItemIcon>

                                      <Box display="flex" flexDirection="column" flexGrow={1} gap={1}>
                                        <ListItemText
                                          primary={`Descripción: ${data.task_description}`}
                                          secondary={`Artículo: ${data.id_article}`} />

                                        <Box display="flex" alignItems="center" gap={2}>
                                          {data?.date_of_enforcement && (
                                            <Tooltip title="Fecha de cumplimiento: ">
                                              <Typography variant="body2">{data?.date_of_enforcement}</Typography>
                                            </Tooltip>
                                          )}
                                        </Box>

                                        <Box display="flex" alignItems="center" gap={2}>
                                          {data?.task_type && (
                                            <Tooltip title="Tipo de tarea: ">
                                              <Typography variant="body2">{data.task_type}</Typography>
                                            </Tooltip>
                                          )}
                                        </Box>

                                        <Box display="flex" alignItems="center" gap={2}>
                                          {data?.task_periodicity && (
                                            <Tooltip title="Periodicidad de la tarea: ">
                                              <Typography variant="body2">{data.task_periodicity}</Typography>
                                            </Tooltip>
                                          )}
                                        </Box>
                                      </Box>
                                    </ListItemButton>
                                  </List>
                                </Collapse>

                                <Divider />
                              </Fragment>
                            ))}
                          </List>
                        </>
                      )}
                    </Box>
                  </Box>

                </Box> {/* ✅ Cerramos el Box interno */}
              </Box> {/* ✅ Cerramos la columna 2 */}
            </Box> {/* ✅ Cerramos el layout de columnas */}
          </Box>
        </Box>

    {/* Diálogo de confirmación de eliminación */}
    <DeleteConfirmationDialog
      open={confirmOpen}
      onClose={() => setConfirmOpen(false)}
      onConfirm={handleConfirmDelete}
      itemName={deleteItemName}
    />
    </Box>
    </>
  );
}