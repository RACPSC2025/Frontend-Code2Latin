import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { MoreVertOutlined, Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import TableComponent from '../../components/TableComponent';
import ArticleFormModal from './ArticleFormModal';
import SpeedDialComponent from '../../components/SpeedDialComponent';

import { useDispatch, useSelector } from 'react-redux';
import { Fragment, useEffect, useState, useRef } from 'react';

import { fetchArticles } from '../../stores/legal/fetchArticlesSlice';
import legalService from '../../services/legalService';

import {
  selectFilterItemValue,
  setFilter
} from '../../stores/filterSlice';

const useFilterItemValue = (module, fieldName) =>
  useSelector((state) => selectFilterItemValue(state, module, fieldName));


export default function Articles({ optinDrawerData }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);

  const { loading, data: articles, error } = useSelector((state) => state.fetchArticles);
  const [rowData, setRowData] = useState([]);
  const [dropdownData, setDropdownData] = useState({
    categories: [],
    articleTypes: [],
    temas: [],
    parentArticles: []
  });

  // Get organizational level filters from Redux
  const level1Selected = useFilterItemValue('legalMatrix', 'level1');
  const level2Selected = useFilterItemValue('legalMatrix', 'level2');
  const level3Selected = useFilterItemValue('legalMatrix', 'level3');
  const level4Selected = useFilterItemValue('legalMatrix', 'level4');
  const listLegalStatus = useFilterItemValue('legalMatrix', 'legal_list_status');

  // Load dropdown data on component mount
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [categoriesRes, typesRes, temasRes] = await Promise.all([
          legalService.getLegalCategories(),
          legalService.getArticleTypes(),
          legalService.getTemas()
        ]);
        
        setDropdownData(prev => ({
          ...prev,
          categories: categoriesRes.status === 1 ? categoriesRes.data : [],
          articleTypes: typesRes.status === 1 ? typesRes.data : [],
          temas: temasRes.status === 1 ? temasRes.data : []
        }));
      } catch (error) {
        console.error('Error loading dropdown data:', error);
      }
    };
    
    loadDropdownData();
  }, []);

  // Load parent articles and fetch articles when requisito changes
  useEffect(() => {
    const loadData = async () => {
      if (optinDrawerData?.id) {
        try {
          const response = await legalService.getIdArticulo(optinDrawerData.id, '');
          if (response.status === 1 && response.data) {
            setDropdownData(prev => ({
              ...prev,
              parentArticles: response.data
            }));
          }
        } catch (error) {
          console.error('Error loading parent articles:', error);
        }
        
        const node = level4Selected || level3Selected || level2Selected || level1Selected || '';
        const params = {
          node,
          requisito: optinDrawerData.id,
          page: 1,
          rows: 100,
          sidx: 'id_articulo',
          sord: 'asc'
        };
        dispatch(fetchArticles(params));
      }
    };
    
    loadData();
  }, [optinDrawerData, dispatch, level1Selected, level2Selected, level3Selected, level4Selected]);

  // Helper functions to get display values
  const getCategoryName = (categoryKey) => {
    const category = dropdownData.categories.find(cat => cat.key === categoryKey);
    return category ? category.label : categoryKey;
  };

  const getItemTypeName = (itemType) => {
    const type = dropdownData.articleTypes.find(type => type.item_type === itemType);
    return type ? type.item_type : itemType;
  };

  const getTemasNames = (temasIds) => {
    if (!temasIds) return '';
    const ids = temasIds.split(',');
    return ids.map(id => {
      const tema = dropdownData.temas.find(t => t.key === id.trim());
      return tema ? tema.label : id;
    }).join(', ');
  };

  const getCriticityName = (criticity) => {
    const criticityMap = {
      'Alta': t('high'),
      'Media': t('medium'),
      'Baja': t('low'),
      'Ninguna': t('none')
    };
    return criticityMap[criticity] || criticity;
  };

  const getStatusName = (status) => {
    const statusMap = {
      'Continuo': t('Continuo'),
      'Abierto': t('Abierto'),
      'Cerrado': t('Cerrado'),
      'Vencido': t('Vencido')
    };
    return statusMap[status] || status;
  };

  const getGapName = (gap) => {
    const gapMap = {
      'csin': t('csin'),
      '1gap': t('1gap'),
      '2gap': t('2gap'),
      '3gap': t('3gap')
    };
    return gapMap[gap] || gap;
  };

  const getAuthorityStatusName = (status) => {
    const statusMap = {
      'attended': t('attended'),
      'compliment': t('compliment')
    };
    return statusMap[status] || status;
  };

  const getParentArticleName = (parentId) => {
    if (!parentId) return '';
    const parent = dropdownData.parentArticles.find(article => 
      String(article.key) === String(parentId)
    );
    return parent ? parent.label : parentId;
  };

  useEffect(() => {
    if (articles && articles.length > 0) {
      setRowData(articles);
    } else {
      setRowData([]);
    }
  }, [articles, dropdownData.parentArticles]);


  
  const columnDefs = [
    {
      field: 'options',
      headerName: t('options'),
      width: 100,
      cellRenderer: (params) => {
        const tempStatus = String(params.data.estado || '').toLowerCase();
        const matchedStatus = listLegalStatus?.find((status) => {
          const statusNumber = String(status.value_number || '').toLowerCase();
          const statusValue = String(status.value || '').toLowerCase();
          const statusLabel = String(status.label || '').toLowerCase();
          return statusNumber === tempStatus || statusValue === tempStatus || statusLabel === tempStatus;
        });

        return (
          <Box sx={{ pl: 3 }}>
            {matchedStatus && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: '5px',
                  bgcolor: matchedStatus.color_code
                }}
              />
            )}
            {!matchedStatus && tempStatus && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: '5px',
                  bgcolor: '#1976d2'
                }}
              />
            )}
            <Tooltip title={t('options')}>
              <IconButton size="small" color="primary">
                <MoreVertOutlined />
              </IconButton>
            </Tooltip>
          </Box>
        );
      }
    },
    {
      field: 'numeracion',
      headerName: t('code'),
      filter: 'agTextColumnFilter'
    },
    {
      field: 'item_type',
      headerName: t('item_type'),
      filter: 'agTextColumnFilter',
      cellRenderer: (params) => getItemTypeName(params.value)
    },
    {
      field: 'parent_article_id',
      headerName: t('article_id'),
      filter: 'agTextColumnFilter',
      cellRenderer: (params) => getParentArticleName(params.value)
    },
    {
      field: 'compensation',
      headerName: t('compensation'),
      filter: 'agTextColumnFilter'
    },
    {
      field: 'nombre',
      headerName: t('name'),
      largeText: true,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'percentage',
      headerName: t('compliance_percentage'),
      filter: 'agNumberColumnFilter',
      cellRenderer: (params) => {
        const cleanValue = String(params.value || '0').replace('%', '');
        const numValue = parseFloat(cleanValue);
        const badgeData = isNaN(numValue) ? '0%' : `${numValue}%`;

        const tempStatus = String(params.data.estado).toLowerCase();
        const matchedStatus = listLegalStatus.find((status) => {
          const statusNumber = String(status.value_number).toLowerCase();
          const statusValue = String(status.value).toLowerCase();
          const statusLabel = String(status.label).toLowerCase();
          return statusNumber === tempStatus || statusValue === tempStatus || statusLabel === tempStatus;
        });

        const badgeColor = matchedStatus?.color_code || '#1976d2';

        return (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography
              sx={{
                border: `4px solid ${badgeColor}`,
                px: 1,
                borderRadius: '4px',
                color: 'black !important',
                backgroundColor: '#fff',
                maxWidth: '60px',
                textAlign: 'center'
              }}
              className="badge"
            >
              {badgeData}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'numero_actividades',
      headerName: t('number_activities'),
      filter: 'agNumberColumnFilter'
    },
    {
      field: 'descripcion',
      headerName: t('description'),
      largeText: true,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'id_tema_requisito',
      headerName: t('thematic_group'),
      filter: 'agTextColumnFilter',
      cellRenderer: (params) => getTemasNames(params.value)
    },
    {
      field: 'criticity',
      headerName: t('criticality'),
      filter: 'agTextColumnFilter',
      cellRenderer: (params) => getCriticityName(params.value)
    },
    {
      field: 'risk_level',
      headerName: t('evidence_level'),
      filter: 'agTextColumnFilter'
    },
    {
      field: 'category_name',
      headerName: t('category'),
      filter: 'agTextColumnFilter',
      cellRenderer: (params) => getCategoryName(params.value)
    },
    {
      field: 'estado',
      headerName: t('status'),
      filter: 'agTextColumnFilter',
      cellRenderer: (params) => getStatusName(params.value)
    },
    {
      field: 'gap',
      headerName: 'GAP',
      filter: 'agTextColumnFilter',
      cellRenderer: (params) => getGapName(params.value)
    },
    {
      field: 'comments',
      headerName: t('comments'),
      largeText: true,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'estado_autoridad',
      headerName: t('authority_status'),
      filter: 'agTextColumnFilter',
      cellRenderer: (params) => getAuthorityStatusName(params.value)
    }
  ];



  const handleArticleCreated = () => {
    if (optinDrawerData?.id) {
      const node = level4Selected || level3Selected || level2Selected || level1Selected || '';
      const params = {
        node,
        requisito: optinDrawerData.id,
        page: 1,
        rows: 100,
        sidx: 'id_articulo',
        sord: 'asc'
      };
      dispatch(fetchArticles(params));
    }
  };

  const speedDialActions = [
    {
      icon: <Add />,
      name: 'Add_articles'
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <TableComponent rowData={rowData} columnDefs={columnDefs} editable={true} />
      <ArticleFormModal
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        requisitoId={optinDrawerData?.id}
        onSuccess={handleArticleCreated}
      />
      <SpeedDialComponent
        openSpeedDial={openSpeedDial}
        handleCloseSpeedDial={() => setOpenSpeedDial(false)}
        handleOpenSpeedDial={() => setOpenSpeedDial(true)}
        speedDialActions={speedDialActions}
        handleClick={() => setOpenSpeedDial(false)}
        handleActionClick={() => setIsDrawerOpen(true)}
      />
    </Box>
  );
}
