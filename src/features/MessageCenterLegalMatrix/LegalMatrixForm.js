import { Box, InputLabel, MenuItem, Select, CircularProgress, Divider } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Suspense, lazy, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BaseFormControl from '../../components/BaseFormControl';
import FormBuilder from '../../components/FormBuilder';
import { saveTask } from '../../stores/tasks/saveTaskSlice';
import legalService from '../../services/legalService';
import treeStructureService from '../../services/treeStructureService';
import JSTreeComponent from './JSTreeComponent';

/*
import { 
  fetchLegalData
  } 
 from '../../stores/legal/fetchLegalData';
 */

export default function LegalMatrixForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [whatFormModel, setWhatFormModel] = useState({});
  const [taskSubmissionStatus, setTaskSubmissionStatus] = useState('');
  const [formType, setFormType] = useState('general');
  const [requisitoGeneral, setRequisitoGeneral] = useState('1');
  const [dropdownOptions, setDropdownOptions] = useState({
    categories: [],
    types: [],
    authorities: [],
    themes: [],
    alerts: []
  });
  
  const [loadGetOptions, setLoadGetOptions] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const [formInitialValues, setFormInitialValues] = useState({});
  const [resetKey, setResetKey] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [horizontalTreeData, setHorizontalTreeData] = useState([]);
  const [verticalTreeData, setVerticalTreeData] = useState([]);
  const [loadingTrees, setLoadingTrees] = useState(false);
  const [selectedHorizontalNodes, setSelectedHorizontalNodes] = useState([]);
  const [selectedVerticalNodes, setSelectedVerticalNodes] = useState([]);

  const validateRequiredFields = () => {
    const errors = {};
    const data = whatFormModel;
    
    // Campos siempre obligatorios
    if (!data.numero?.trim()) errors.numero = true;
    if (!data.nombre?.trim()) errors.nombre = true;
    if (!data.descripcion?.trim()) errors.descripcion = true;
    if (!data.id_tipo_requisito) errors.id_tipo_requisito = true;
    if (!data.categoria_norma) errors.categoria_norma = true;
    if (!data.emitidopor) errors.emitidopor = true;
    
    // Campos obligatorios para categoría específica (3)
    if (data.categoria_norma === '3') {
      if (!data.fecha_expedicion) errors.fecha_expedicion = true;
      if (!data.fecha_ejecutoria) errors.fecha_ejecutoria = true;
      if (!data.normas_relacionadas?.trim()) errors.normas_relacionadas = true;
      if (!data.id_tema_requisito || (Array.isArray(data.id_tema_requisito) && data.id_tema_requisito.length === 0)) {
        errors.id_tema_requisito = true;
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveTask = async () => {
    try {
      const { requisito_general: _, ...formDataWithoutRequisitoGeneral } = whatFormModel;
      
      const dataToSend = {
        ...formDataWithoutRequisitoGeneral,
        requisito_general: requisitoGeneral
      };
      
      // Transformar estructura horizontal (selected_levels) - solo nodos hoja
      if (requisitoGeneral === '0' && selectedHorizontalNodes.length > 0) {
        const leafNodes = selectedHorizontalNodes.filter(node => {
          // Un nodo es hoja si ningún otro nodo seleccionado lo tiene como padre
          return !selectedHorizontalNodes.some(otherNode => 
            otherNode.id !== node.id && otherNode.parents.includes(node.id)
          );
        });
        
        const selectedLevels = leafNodes.map(node => ({
          id: node.id,
          parents: node.parents.filter(p => p !== '#')
        }));
        dataToSend.selected_levels = JSON.stringify(selectedLevels);
      }
      
      // Transformar estructura vertical (selected_structure) - solo nodos hoja
      if (requisitoGeneral === '0' && selectedVerticalNodes.length > 0) {
        const leafNodes = selectedVerticalNodes.filter(node => {
          return !selectedVerticalNodes.some(otherNode => 
            otherNode.id !== node.id && otherNode.parents.includes(node.id)
          );
        });
        
        const structurePaths = leafNodes.map(node => {
          const parts = [];
          const allParents = [...node.parents].reverse();
          
          // Procesar padres
          allParents.forEach(parentId => {
            if (parentId !== '#') {
              const [type, ids] = parentId.split('@');
              if (type && ids) {
                const idParts = ids.split('_');
                const lastId = idParts[idParts.length - 1];
                
                const typeMap = {
                  'region': 'region',
                  'pais': 'country',
                  'negocio': 'business',
                  'plant': 'plant'
                };
                
                const mappedType = typeMap[type] || type;
                parts.push(`${mappedType}_${lastId}`);
              }
            }
          });
          
          // Procesar nodo actual
          const [type, ids] = node.id.split('@');
          if (type && ids) {
            const idParts = ids.split('_');
            const lastId = idParts[idParts.length - 1];
            
            const typeMap = {
              'region': 'region',
              'pais': 'country',
              'negocio': 'business',
              'plant': 'plant'
            };
            
            const mappedType = typeMap[type] || type;
            parts.push(`${mappedType}_${lastId}`);
          }
          
          return parts.join('@');
        }).filter(path => path.length > 0);
        
        dataToSend.selected_structure = structurePaths.join(',');
      }
      
      const result = await legalService.createLegalRequirement(dataToSend);
      toast.success('El requisito legal se ha guardado exitosamente.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      setValidationErrors({});
    } catch (error) {
      toast.error('Ocurrió un problema al enviar el formulario. Inténtelo nuevamente.', {
        position: 'top-right',
        autoClose: 5000
      });
    }
  };

  const handleSubmitForm = () => {
    // setActiveStep(6);
    if (!validateRequiredFields()) {
      toast.warning('Por favor complete todos los campos obligatorios antes de guardar.', {
        position: 'top-right',
        autoClose: 5000
      });
      return;
    }
    handleSaveTask();
  };

  const handleReset = () => {
    setWhatFormModel({});
    setValidationErrors({});
    setTaskSubmissionStatus('');
    setRequisitoGeneral('1');
    setSelectedHorizontalNodes([]);
    setSelectedVerticalNodes([]);
    setResetKey(prev => prev + 1);
  };

  const legalFormFields = [
    // Conditionally add `concept` based on `formType`
    ...(formType !== 'general'
      ? [
          {
            id: 'concept',
            label: 'Concepto',
            type: 'dropdown',
            required: true,
            defaultValue: '',
            gridSize: 6,
            options: [
              { value: 'license', label: 'Licencia' },
              { value: 'permission', label: 'Permiso' },
              { value: 'ordinary', label: 'Trámite ordinario' },
              { value: 'other', label: 'Otro' }
            ]
          }
        ]
      : []),

    // Common fields
    {
      id: 'apply_lto',
      label: 'Aplica para LTO',
      type: 'checkbox',
      defaultValue: false,
      gridSize: 6
    },
    {
      id: 'categoria_norma',
      label: 'Categoría de la normatividad',
      type: 'dropdown',
      options: dropdownOptions.categories || [],
      required: true,
      defaultValue: '',
      gridSize: 6,
      error: validationErrors.categoria_norma ? 'Campo requerido' : null
    },
    {
      id: 'numero',
      label: 'Número',
      type: 'text',
      required: true,
      defaultValue: '',
      gridSize: 6,
      error: validationErrors.numero ? 'Campo requerido' : null
    },
    {
      id: 'nombre',
      label: 'Nombre del requisito',
      type: 'text',
      required: true,
      defaultValue: '',
      gridSize: 6,
      error: validationErrors.nombre ? 'Campo requerido' : null
    },
    {
      id: 'fecha_expedicion',
      label: 'Fecha de expedición',
      type: 'date',
      required: whatFormModel.categoria_norma === '3',
      defaultValue: '',
      gridSize: 6,
      error: validationErrors.fecha_expedicion ? 'Campo requerido' : null
    },
    {
      id: 'fecha_ejecutoria',
      label: 'Fecha de vigencia',
      type: 'date',
      required: whatFormModel.categoria_norma === '3',
      defaultValue: '',
      gridSize: 6,
      error: validationErrors.fecha_ejecutoria ? 'Campo requerido' : null
    },
    {
      id: 'descripcion',
      label: 'Requerimiento',
      type: 'textarea',
      required: true,
      defaultValue: '',
      gridSize: 12,
      error: validationErrors.descripcion ? 'Campo requerido' : null
    },
    {
      id: 'id_tipo_requisito',
      label: 'Tipo de normatividad',
      type: 'dropdown',
      required: true,
      defaultValue: '',
      gridSize: 6,
      options: dropdownOptions.types || [],
      error: validationErrors.id_tipo_requisito ? 'Campo requerido' : null
    },
    {
      id: 'normas_relacionadas',
      label: 'Normas relacionadas',
      type: 'text',
      required: whatFormModel.categoria_norma === '3',
      defaultValue: '',
      gridSize: 6,
      error: validationErrors.normas_relacionadas ? 'Campo requerido' : null
    },
    {
      id: 'emitidopor',
      label: 'Autoridad que expide',
      type: 'dropdown',
      options: dropdownOptions.authorities || [],
      required: true,
      defaultValue: '',
      gridSize: 6,
      error: validationErrors.emitidopor ? 'Campo requerido' : null
    },
    {
      id: 'id_tema_requisito',
      label: 'Grupo temático (selección múltiple)',
      type: 'dropdown',
      multiple: true,
      required: whatFormModel.categoria_norma === '3',
      defaultValue: '',
      gridSize: 6,
      options: dropdownOptions.themes || [],
      error: validationErrors.id_tema_requisito
    },

    // Conditionally add `file` based on `formType`
    ...(formType !== 'general'
      ? [
          {
            id: 'expediente',
            label: 'Expediente',
            type: 'text',
            defaultValue: '',
            gridSize: 6
          }
        ]
      : []),

    {
      id: 'url',
      label: 'Enlace SharePoint',
      type: 'text',
      defaultValue: '',
      gridSize: 6
    },
    {
      id: 'estado',
      label: 'Estado',
      type: 'dropdown',
      defaultValue: 'abierto',
      gridSize: 6,
      options: [
        { value: 'continuo', label: 'Continuo' },
        { value: 'abierto', label: 'Abierto' },
        { value: 'cerrado', label: 'Cerrado' },
        { value: 'vencido', label: 'Vencido' }
      ]
    },
    {
      id: 'id_alert',
      label: 'Aplicar alerta',
      type: 'dropdown',
      options: [{ value: '', label: 'Ninguna' }, ...(dropdownOptions.alerts || [])],
      defaultValue: '',
      gridSize: 6
    },
    {
      id: 'observaciones',
      label: 'Observaciones',
      type: 'text',
      defaultValue: '',
      gridSize: 6
    },

    // Conditionally add `GAP` or `summary` based on `formType`
    ...(formType === 'general'
      ? [
          {
            id: 'gap',
            label: 'GAP',
            type: 'dropdown',
            defaultValue: '',
            gridSize: 6,
            options: [
              { value: 'csin', label: 'Cumple sin GAP' },
              { value: '1gap', label: 'GAP 1' },
              { value: '2gap', label: 'GAP 2' },
              { value: '3gap', label: 'GAP 3' }
            ]
          }
        ]
      : [
          {
            id: 'summary',
            label: 'Resumen',
            type: 'textarea',
            defaultValue: '',
            gridSize: 12
          }
        ])
  ];

  const initialValues = {
    requisito_general_tipo: formType === 'general' ? '1' : '0',
    concept: '',
    categoria_norma: '',
    numero: '',
    nombre: '',
    fecha_expedicion: '',
    fecha_ejecutoria: '',
    descripcion: '',
    id_tipo_requisito: '',
    normas_relacionadas: '',
    emitidopor: '',
    id_tema_requisito: '',
    expediente: '',
    url: '',
    estado: 'abierto',
    id_alert: '',
    observaciones: '',
    gap: '',
    apply_lto: null,
    summary: ''
  };

  /*
  const handleFetch_get_dropdown_options = () => {
    setLoadingOptions(true);
    dispatch(fetchLegalData()).then((data) => {
      if (data?.payload) {
        const options = data?.payload;

        setDropdownOptions(options);
        setLoadingError(null);

        setLoadingOptions(false);
      }
      else {
        setLoadingError('Error loading dropdown options');
        setLoadingOptions(false);
      }
    });
  };

  useEffect(() => {
    if (loadGetOptions) {
      setLoadGetOptions(false);
      handleFetch_get_dropdown_options();
    }
  }, [loadGetOptions]); // Esta es propuesta para hacer el cambio
  */
  
  
  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const options = await legalService.getDropdownOptions();
        setDropdownOptions(options);
        setLoadingError(null);
      } catch (error) {
        setLoadingError(error.message);
      } finally {
        setLoadingOptions(false);
      }
    };
    
    loadOptions();
  }, []);
  
  

  useEffect(() => {
    const baseInitialValues = {
      requisito_general_tipo: formType === 'general' ? '1' : '0',
      concept: '',
      categoria_norma: '',
      numero: '',
      nombre: '',
      fecha_expedicion: '',
      fecha_ejecutoria: '',
      descripcion: '',
      id_tipo_requisito: '',
      normas_relacionadas: '',
      emitidopor: '',
      id_tema_requisito: formType === 'general' ? [] : '',
      expediente: '',
      url: '',
      estado: 'abierto',
      id_alert: '',
      observaciones: '',
      gap: '',
      apply_lto: false,
      summary: ''
    };
    setFormInitialValues(baseInitialValues);
  }, [formType, dropdownOptions, resetKey]);

  useEffect(() => {
    // Limpiar errores cuando cambien los valores del formulario
    if (Object.keys(validationErrors).length > 0) {
      const newErrors = { ...validationErrors };
      let hasChanges = false;
      
      Object.keys(whatFormModel).forEach(key => {
        if (whatFormModel[key] && newErrors[key]) {
          delete newErrors[key];
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        setValidationErrors(newErrors);
      }
    }
  }, [whatFormModel]);

  useEffect(() => {
    if (requisitoGeneral === '0') {
      loadTreeData();
    }
  }, [requisitoGeneral]);

  const loadTreeData = async () => {
    setLoadingTrees(true);
    try {
      const [horizontal, vertical] = await Promise.all([
        treeStructureService.getFullHorizontalStructure(),
        treeStructureService.getFullVerticalStructure()
      ]);
      setHorizontalTreeData(horizontal);
      setVerticalTreeData(vertical);
    } catch (error) {
      console.error('[LegalMatrixForm] Error loading tree data:', error);
    } finally {
      setLoadingTrees(false);
    }
  };

  const handleHorizontalSelection = useCallback((nodes) => {
    setSelectedHorizontalNodes(nodes);
  }, []);

  const handleVerticalSelection = useCallback((nodes) => {
    setSelectedVerticalNodes(nodes);
  }, []);

  return (
    <Box sx={{ width: '100%', pb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, gap: 2 }}>
        <Button variant="outlined" onClick={handleReset}>
          Limpiar
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmitForm}>
          Guardar requisito legal
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Información Legal</Typography>
          <Suspense fallback={<div>{t('loading')}</div>}>
            <Box>
              <BaseFormControl field={formType} sx={{ mb: 3, width: '100%' }}>
                <InputLabel id="simple-select-type-label">Tipo</InputLabel>
                <Select
                  labelId="simple-select-type-label"
                  id="requisito_general_tipo"
                  label="Tipo"
                  value={formType}
                  onChange={(e) => setFormType(e?.target?.value)}
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="specific">Específico</MenuItem>
                </Select>
              </BaseFormControl>
              <FormBuilder
                key={`form-${loadingOptions}-${formType}-${resetKey}`}
                showActionButton={false}
                inputFields={legalFormFields}
                initialValues={Object.keys(whatFormModel).length > 0 ? whatFormModel : formInitialValues}
                controlled={false}
                onChange={(formData) => {
                  if (formData.emitidopor && dropdownOptions.authorities) {
                    const authority = dropdownOptions.authorities.find(a => a.value == formData.emitidopor);
                    if (authority) {
                      formData.emitidoporName = authority.label;
                    }
                  }
                  setWhatFormModel(formData);
                }}
              />
            </Box>
          </Suspense>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Estructura del Requisito</Typography>
          <BaseFormControl field={requisitoGeneral} sx={{ mb: 3, width: '100%' }}>
            <InputLabel id="requisito-general-label">Tipo de Asociación</InputLabel>
            <Select
              labelId="requisito-general-label"
              id="requisito_general"
              label="Tipo de Asociación"
              value={requisitoGeneral}
              onChange={(e) => setRequisitoGeneral(e?.target?.value)}
            >
              <MenuItem value="1">General</MenuItem>
              <MenuItem value="0">Específico</MenuItem>
            </Select>
          </BaseFormControl>

          {requisitoGeneral === '0' && (
            <Box>
              {loadingTrees ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Estructura Funcional</Typography>
                    <Box sx={{ border: '1px solid #ccc', p: 2, minHeight: '300px', maxHeight: '400px', overflow: 'auto' }}>
                      <JSTreeComponent
                        treeId="level_structure"
                        data={horizontalTreeData}
                        onSelectionChange={handleHorizontalSelection}
                      />
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Estructura Organizacional</Typography>
                    <Box sx={{ border: '1px solid #ccc', p: 2, minHeight: '300px', maxHeight: '400px', overflow: 'auto' }}>
                      <JSTreeComponent
                        treeId="geography_structure"
                        data={verticalTreeData}
                        onSelectionChange={handleVerticalSelection}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, pt: 3, borderTop: '1px solid #e0e0e0', gap: 2 }}>
        <Button variant="outlined" onClick={handleReset}>
          Limpiar
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmitForm}>
          Guardar requisito legal
        </Button>
      </Box>

      <ToastContainer />
    </Box>
  );
}
