import { ErrorOutline, Info, MoreVert, PlayCircleOutline } from '@mui/icons-material';
import { Box, Button, Chip, IconButton, Popover, Tooltip, Typography, Dialog, DialogContent } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import TableComponent from '../../components/TableComponent';
import { statusColorObject, statusIconObject } from '../../lib/data';
import { isValidArray } from '../../utils/others';
import ComplianceModal from './ComplianceModal';
import ArticleOperationsModal from './ArticleOperationsModal';
import legalService from '../../services/legalService';


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

// Mapeo de estados PHP (0-4) a estados frontend
const statusMap = {
  0: 'not_apply',
  1: 'completed',
  2: 'in_progress',
  3: 'in_transition',
  4: 'delayed'
};

export default function Compliance({
  optinDrawerData = {},
  setCompliancedata = () => {},
  complianceData = []
}) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [activeTab, setActiveTab] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [columnDefs, setColumnDefs] = useState([]);
  const [processedRowData, setProcessedRowData] = useState([]);
  const [rowId, setRowId] = useState(0);
  const [columnId, setColumnId] = useState(0);
  const [columnData, setColumnData] = useState();
  const [rowData, setRowData] = useState([]);
  const [geoLevels, setGeoLevels] = useState({});
  const [dynamicColumns, setDynamicColumns] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [requirementName, setRequirementName] = useState('');
  const [operationsModalOpen, setOperationsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('');

  const fetchArticleDetails = async () => {
    if (!optinDrawerData?.id) return;
    
    try {
      let response = await legalService.getArticleDetailsTable(optinDrawerData.id);
      
      if (typeof response === 'string') {
        response = response.trim().replace(/^[\uFEFF\xEF\xBB\xBF]+/, '');
        response = JSON.parse(response);
      }
      
      if (response.status === 1 && response.data) {
        const { result, legalLevels, rowLegal } = response.data;
        
        if (rowLegal && rowLegal.nombre) {
          setRequirementName(rowLegal.nombre);
        }
        
        const articles = result.slice(0, -1);
        
        const mappedRows = articles.map((article) => {
          const row = {
            id: article.id_articulo,
            type_of_item: article.item_type,
            status: statusMap[article.main_color] || 'not_apply',
            name: article.nombre,
            business_compliance: article.percentage || ''
          };
          
          Object.keys(legalLevels).forEach((levelKey) => {
            const botonValue = article[`boton_${levelKey}`];
            let statusValue = 0;
            let taskValue = 0;
            
            if (typeof botonValue === 'string' && botonValue.startsWith('{')) {
              try {
                const parsed = JSON.parse(botonValue);
                statusValue = parseInt(parsed.status) || 0;
                taskValue = parseInt(parsed.cnt_task) || 0;
              } catch (e) {
                console.error('Error parsing boton value:', e);
              }
            } else {
              statusValue = parseInt(botonValue) || 0;
              taskValue = article[`cnt_task_${levelKey}`] || 0;
            }
            
            row[`level_${levelKey}`] = {
              status: statusMap[statusValue] || 'not_apply',
              task: taskValue,
              actions: article[`cnt_actions_${levelKey}`] || 0
            };
          });
          
          return row;
        });
        
        const generatedColumns = Object.keys(legalLevels).map(levelKey => ({
          field: `level_${levelKey}`,
          headerName: legalLevels[levelKey].tooltip,
          width: 180
        }));
        
        setDynamicColumns(generatedColumns);
        
        const lastRecord = result[result.length - 1] || {};
        const subtotalData = {};
        let totalPercentage = 0;
        let cntElements = 0;
        
        Object.keys(legalLevels).forEach((levelKey) => {
          const botonValue = lastRecord[`boton_${levelKey}`];
          let statusValue = 0;
          let percentageValue = '';
          
          if (typeof botonValue === 'string' && botonValue.startsWith('{')) {
            try {
              const parsed = JSON.parse(botonValue);
              statusValue = parseInt(parsed.status) || 0;
              percentageValue = parsed.percentage || '';
              
              if (statusValue !== 0) {
                cntElements++;
                if (percentageValue && percentageValue.trim() !== '') {
                  totalPercentage += parseFloat(percentageValue);
                }
              }
            } catch (e) {
              statusValue = parseInt(botonValue) || 0;
            }
          } else {
            statusValue = parseInt(botonValue) || 0;
          }
          
          subtotalData[`level_${levelKey}`] = { 
            status: statusMap[statusValue] || 'not_apply',
            percentage: percentageValue
          };
        });
        
        const avgPercentage = cntElements !== 0 ? Math.round((totalPercentage / cntElements) * 100) / 100 : '';
        
        const subtotalRow = { 
          id: 'sub_total', 
          row: 'sub_total', 
          business_compliance: avgPercentage,
          ...subtotalData 
        };
        
        const finalRows = [
          subtotalRow,
          ...mappedRows,
          subtotalRow
        ];

        setRowData(finalRows);
        setGeoLevels(legalLevels);
      }
    } catch (error) {
      console.error('Error fetching article details:', error);
    }
  };

  useEffect(() => {
    fetchArticleDetails();
  }, [optinDrawerData?.id]);
  

  const calculateFinalStatus = (statusPerRow) => {
    const filteredStatuses = Object.values(statusPerRow).filter((status) => status);
    if (filteredStatuses.length === 0) return '';
    const firstStatus = filteredStatuses[0];
    if (filteredStatuses.every((status) => status === firstStatus)) return firstStatus;
    if (filteredStatuses.includes('delayed') || filteredStatuses.includes('not_completed')) return 'not_completed';
    if (filteredStatuses.includes('under_progress') || filteredStatuses.includes('partially_completed') || filteredStatuses.includes('in_progress')) return 'in_progress';
    if (filteredStatuses.includes('in_transition')) return 'in_transition';
    return filteredStatuses[0];
  };

  const calculateColumnStatus = (statusObject) => {
    const finalStatusObject = {};
    for (const [column, statuses] of Object.entries(statusObject)) {
      finalStatusObject[column] = { status: calculateFinalStatus(statuses) };
    }
    return finalStatusObject;
  };

  const renderSubtotalRow = (params) => {
    const status = params?.value?.status || '';
    const percentage = params?.value?.percentage || '';

    return (
      <Tooltip title={t(status)}>
        <Box
          sx={{
            backgroundColor: statusColorObject[status],
            color: 'white',
            padding: 0,
            height: '100%',
            width: '100%',
            fontWeight: '500',
            fontSize: '15px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {percentage}
        </Box>
      </Tooltip>
    );
  };

  const handleTaskClick = (articleId, levelKey) => {
    const levelStr = geoLevels[levelKey]?.level_str || levelKey;
    setSelectedArticle(articleId);
    setSelectedLevel(levelStr);
    setOperationsModalOpen(true);
  };

  const handleOperationsModalClose = (shouldRefresh) => {
    setOperationsModalOpen(false);
    if (shouldRefresh) {
      fetchArticleDetails();
    }
  };

  const renderColumnData = (params) => {
    const data = params?.value || {};
    const statusIcon = statusIconObject[data?.status] || <ErrorOutline />;
    const articleId = params?.data?.id;
    const levelKey = params?.column?.colId?.replace('level_', '');
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '100%' }}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {statusIcon}
        </span>
        {/* Botones actuales */}
        <Button
          variant="outlined"
          size="small"
          sx={{ minWidth: 'auto', px: 1, py: 0.5, fontSize: '12px' }}
          onClick={() => handleTaskClick(articleId, levelKey)}
        >
          {t('Tareas')} ({data?.task ?? 0})
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{ minWidth: 'auto', px: 1, py: 0.5, fontSize: '12px' }}
        >
          {t('Acciones')} ({data?.actions ?? 0})
        </Button>
        {/* Contadores originales */}
        {/*
        <span style={{ fontSize: '14px' }}>({data?.task ?? 0})</span>
        <span style={{ fontSize: '14px' }}>({data?.actions ?? 0})</span>
        */}
      </div>
    );
  };



  const baseColumnDefs = [
    {
      headerName: t('Status'),
      field: 'status',
      flex: 0.5,
      minWidth: 80,
      cellStyle: { textAlign: 'center' },
      cellRenderer: (params) => {
        if (params?.data?.id === 'sub_total') return null;
        
        const finalStatus = params?.data?.status || 'not_apply';

        return (
          <Tooltip title={t(finalStatus)}>
            <Box
              sx={{
                backgroundColor: statusColorObject[finalStatus],
                color: 'white',
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {statusIconObject[finalStatus]}
            </Box>
          </Tooltip>
        );
      }
    },
    { 
      headerName: t('type_of_item'), 
      field: 'type_of_item', 
      flex: 1, 
      minWidth: 120, 
      cellStyle: (params) => ({
        textAlign: 'center',
        backgroundColor: params?.data?.id === 'sub_total' ? '#f5f5f5' : '#fafafa'
      }),
      cellRenderer: (params) => {
        if (params?.data?.id === 'sub_total') return <span style={{ fontWeight: 'bold' }}>{t('Subtotal')}</span>;
        return params.value;
      }
    },
    { 
      headerName: t('name'), 
      field: 'name', 
      flex: 2, 
      minWidth: 200, 
      cellStyle: (params) => ({
        textAlign: 'center',
        backgroundColor: params?.data?.id === 'sub_total' ? '#f5f5f5' : '#fafafa'
      })
    },
    { 
      headerName: t('business_compliance'),
      field: 'business_compliance',
      flex: 1,
      minWidth: 150,
      cellStyle: (params) => ({
        textAlign: 'center',
        backgroundColor: params?.data?.id === 'sub_total' ? '#f5f5f5' : '#fafafa'
      }),
      cellRenderer: (params) => {
        // Mostrar el valor tal como viene, sin formateo automático
        return params.value || '';
      },
      headerComponent: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%', justifyContent: 'center' }}>
          <span>{t('business_compliance')}</span>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setVideoUrl('https://unydos.com/videosAmatiaNutresa/ML-3.mp4');
              setOpenVideoModal(true);
            }}
            sx={{ padding: 0, minWidth: 'auto' }}
          >
            <PlayCircleOutline fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

  const generateRowData = (columns) => {
    if (!isValidArray(rowData)) return [];
    return rowData; // Los subtotales ya están incluidos en rowData
  };

  const generateColumns = (columns) => {
    if (!columns || columns.length === 0) return baseColumnDefs;
    
    const processedColumns = columns.map((col) => ({
      headerName: col.headerName,
      field: col.field,
      flex: 1.5,
      minWidth: 180,
      headerComponent: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%', justifyContent: 'center' }}>
          <span>{col.headerName}</span>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setVideoUrl('https://unydos.com/videosAmatiaNutresa/ML-2.mp4');
              setOpenVideoModal(true);
            }}
            sx={{ padding: 0, minWidth: 'auto' }}
          >
            <PlayCircleOutline fontSize="small" />
          </IconButton>
        </Box>
      ),
      cellStyle: (params) => ({
        textAlign: 'center',
        backgroundColor: params?.data?.id === 'sub_total' ? '#f5f5f5' : '#fafafa'
      }),
      cellRenderer: (params) => {
        if (params?.data?.id === 'sub_total') {
          return renderSubtotalRow(params);
        } else {
          return renderColumnData(params);
        }
      }
    }));
    
    return [...baseColumnDefs, ...processedColumns];
  };

  useEffect(() => {
    if (rowData.length === 0) {
      setProcessedRowData([]);
      return;
    }
    
    const columns = generateColumns(dynamicColumns);
    setColumnDefs(columns);
    
    const rows = generateRowData(dynamicColumns);
    setProcessedRowData(rows);
  }, [rowData, dynamicColumns]);

  const handleOpenDrawer = (params) => {
    setIsDrawerOpen(true);
    setRowId(params?.data.id);
    setColumnId(params?.column?.colId);
    setColumnData(params);
  };

  return (
    <Box sx={{ width: '100%', height: '600px' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>{requirementName}</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {t('Si las estructuras no se muestran, si el usuario es administrador, el dominio (URL) no está configurado en la configuración de la empresa. Para otros usuarios no se asignan estructuras.')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {Object.entries(statusIconObject).map(([key, icon]) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <span style={{ color: statusColorObject[key], display: 'flex', alignItems: 'center' }}>{icon}</span>
              <Typography variant="caption">{t(key)}</Typography>
            </Box>
          ))}
        </Box>
        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
          {t('Los registros de estado se descartan del recuento del porcentaje del artículo.')}
        </Typography>
      </Box>
      <TableComponent
        rowData={processedRowData}
        columnDefs={columnDefs}
        pagination={false}
        pinnedColumn={['status', 'type_of_item', 'name', 'business_compliance']}
      />
      {isDrawerOpen && (
        <ComplianceModal
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          rowData={rowData}
          rowId={rowId}
          setRowId={setRowId}
          columnId={columnId}
          columnData={columnData}
        />
      )}
      <Dialog
        open={openVideoModal}
        onClose={() => setOpenVideoModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <video
            src={videoUrl}
            controls
            autoPlay
            style={{ width: '100%', height: 'auto' }}
          />
        </DialogContent>
      </Dialog>
      <ArticleOperationsModal
        open={operationsModalOpen}
        onClose={handleOperationsModalClose}
        legalId={optinDrawerData?.id}
        articleId={selectedArticle}
        levelStr={selectedLevel}
      />
    </Box>
  );
}
