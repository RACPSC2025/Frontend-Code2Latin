import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import { Badge, Box, Chip, IconButton } from '@mui/material';
import { useEffect, useState, useRef, useCallback } from 'react';
import { debounce } from 'radash';
import TableComponent from '../../components/TableComponent';
import { formatDayjs } from '../../utils/dateTimeFunctions';
import { COLUMN_TYPES, COLUMN_TYPE_TO_WIDTH_MAPPING } from '../config/table';
import { Description, Field, Label, Textarea } from '@headlessui/react';
import clsx from 'clsx';
import axiosInstance from '../../lib/axios';

export default function ActionTable({
  actions,
  actionStatus,
  columnConfig,
  isFetching,
  onClickTableAction,
  newActionByUser
}) {
  const [tableWidth, setTableWidth] = useState(1560); // Default initial width
  const tableContainerRef = useRef(null);

  // Update width when container resizes
  const updateWidth = useCallback(() => {
    if (tableContainerRef.current) {
      setTableWidth(tableContainerRef.current.offsetWidth);
    }
  }, []);

  // Debounced version of updateWidth using radash
  const debouncedUpdateWidth = useCallback(debounce({ delay: 100 }, updateWidth), [updateWidth]);

  useEffect(() => {
    // Initial width calculation
    updateWidth();

    // Set up ResizeObserver to detect container size changes
    let resizeObserver;
    if (tableContainerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(debouncedUpdateWidth);
      resizeObserver.observe(tableContainerRef.current);
    }

    // Fallback to window resize for broader compatibility
    window.addEventListener('resize', debouncedUpdateWidth);

    // Clean up
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', debouncedUpdateWidth);
    };
  }, [debouncedUpdateWidth, updateWidth]);

  // Define the columns for the Data Grid
  const getFinalColumnConfig = (columnConfig, width) => {
    const finalColumms = [];
    const actionColumnWidth = getAbsoluteColumnWidth(COLUMN_TYPES.ACTIONS, width);
    let remainingWidth = width - actionColumnWidth;
    let isColumnWidthAcceptable = false;

    // columnas que no quieres renderizar
    const skippedColumns = ['responsible_person', 'action_created_by', 'nb_pais'];

    for (let i = 0; i < columnConfig.length; i++) {
      if (skippedColumns.includes(columnConfig[i]['field'])) continue;

      const { column_type, ...restColumnConfig } = columnConfig[i];

      const columnWidth = getAbsoluteColumnWidth(column_type, width);
      remainingWidth = remainingWidth - columnWidth;

      isColumnWidthAcceptable =
        remainingWidth > 0 ||
        (remainingWidth < 0 && columnWidth + remainingWidth >= columnWidth * 0.75);

      if (!isColumnWidthAcceptable) break;

      restColumnConfig.width = columnWidth;

      // 🔥 Manejo especial para columnas con administradores
      if (
        restColumnConfig.field === 'responsible_person_name' ||
        restColumnConfig.field === 'reviewer_person_name'
      ) {
        finalColumms.push({
          ...restColumnConfig,
          headerName:
            restColumnConfig.field === 'responsible_person_name'
              ? 'Responsable'
              : 'Revisor',
          editable: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: administradores.map((a) => a.label),
          },
          valueFormatter: (params) => {
            const admin = administradores.find(
              (a) => a.label === params.value || a.value === params.value
            );
            return admin ? admin.label : params.value;
          },
          valueParser: (params) => {
            const admin = administradores.find((a) => a.label === params.newValue);
            return admin ? admin.value : params.newValue;
          },
        });
      } else {
        // 👉 todas las demás columnas normales
        finalColumms.push({
          column_type: i === 0 ? COLUMN_TYPES.ID_WITH_STATUS : column_type,
          ...restColumnConfig,
          cellRenderer: (params) => {
            return getTableDefaultCellRenderer(params);
          },
        });
      }

      if (remainingWidth < 0) break;
    }

    return finalColumms;
  };

  const getAbsoluteColumnWidth = (columnType, totalAbsoluteWidth) => {
    const relativeWidthPercent = COLUMN_TYPE_TO_WIDTH_MAPPING[columnType] || 10;
    return Math.floor(totalAbsoluteWidth * (relativeWidthPercent / 100));
  };

  const [editableActions, setEditableActions] = useState(actions);
  const [newActionDescription, setNewActionDescription] = useState('');

  // Sincronizar con prop si cambia
  useEffect(() => {
    setEditableActions(actions);
  }, [actions]);

  const handleCellValueChanged = (params) => {
    const updatedRow = {
      ...params.data,
      [params.colDef.field]: params.newValue
    };

    const updatedData = editableActions.map((row) =>
      row.action_id === updatedRow.action_id ? updatedRow : row
    );

    setEditableActions(updatedData);
  };

  const handleCreateNewAction = () => {
    console.log('handleCreateNewAction called');
    console.log("columnConfig: ", columnConfig);
    console.log("editable actions: ", editableActions);

    console.log('New action description:', newActionDescription);
    
    const trimmedDesc = newActionDescription.trim();
    if (!trimmedDesc) return;

    const newRow = {
      action_id: `temp_${Date.now()}`, // ID temporal
      //action_id: '',
      //action_id: 'New action ' + newActionDescription,
      //description: trimmedDesc,
      description: newActionDescription,
      what_description: newActionDescription,
      //action_closing_date: '2025-12-31',
      //action_real_closing_date: '2025-12-31',

      comments_count: 0,
      action_status: '', // Ajusta según lógica
      //action_created_by: 'usuario_local', // Opcional
      // Otros campos requeridos por tu tabla pueden ir aquí
    }
     setEditableActions((prev) => [newRow, ...prev]);
     setNewActionDescription('');
  };

  
  const createNewActionByDescription = (newDesription) => {
    console.log('CreateNewActionByDescription called');
    console.log("columnConfig: ", columnConfig);
    console.log("editable actions: ", editableActions);

    const newRow = {
      //action_id: `temp_${Date.now()}`, // ID temporal
      action_id: '',
      description: newDesription,
      what_description: newDesription,
      //action_closing_date: '2025-12-31',
      //action_real_closing_date: '2025-12-31',

      comments_count: 0,
      action_status: '', // Ajusta según lógica
      //action_created_by: 'usuario_local', // Opcional
      // Otros campos requeridos por tu tabla pueden ir aquí
    }
     setEditableActions((prev) => [newRow, ...prev]);
     setNewActionDescription('');
  };

  useEffect(() => {
    if (newActionByUser !== '') {
      createNewActionByDescription(newActionByUser);
    }
  }, [newActionByUser]);
  
  const fetchUserName = async (user_id) => {
    try {
      const response = await axiosInstance.post(`/tasklist_api/list_administradores/`);
      const filteredId = response.data.data.filter(
        (user) => parseInt(user.value) === parseInt(user_id)
      );
      return filteredId[0].label;
    } catch (error) {
      console.error('Error fetching user name ', error);
      return [];
    }
  };

  
  const [administradores, setAdministradores] = useState([]);

  useEffect(() => {
    const fetchAdministradores = async () => {
      try {
        const response = await axiosInstance.post(`/tasklist_api/list_administradores/`);
        if (response.data.status === 200) {
          setAdministradores(response.data.data); // [{value, label}, ...]
        }
      } catch (error) {
        console.error("Error fetching administradores: ", error);
      }
    };

    fetchAdministradores();
  }, []);

  const getTableDefaultCellRenderer = (params) => {
    const {
      colDef: { column_type },
      data,
      value
    } = params;

    switch (column_type) {
      case COLUMN_TYPES.DATE:
        return !value ? '-' : formatDayjs(value, 'DD MMMM YYYY');
      case COLUMN_TYPES.ID_WITH_STATUS: {
        const { color_code } = actionStatus[data.action_status] || {};
        return (
          <Box sx={{ pl: 3 }}>
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: '5px',
                bgcolor: color_code
              }}
            />
            {data.action_id}
          </Box>
        );
      }
      case COLUMN_TYPES.STATUS: {
        const { color_code, label } = actionStatus[value] || {};
        return (
          <Chip label={label} size="small" sx={{ backgroundColor: color_code, color: 'white' }} />
        );
      }
      case COLUMN_TYPES.ACTIONS:
        return (
          <>
            <Badge
              badgeContent={data.comments_count}
              color="info"
              invisible={parseInt(data.comments_count) === 0}
              overlap="circular"
            >
              <IconButton
                aria-label="comment"
                onClick={(event) => {
                  event.stopPropagation();
                  onClickTableAction(data, 'view_comment');
                }}
              >
                <CommentIcon />
              </IconButton>
            </Badge>
            <IconButton
              aria-label="edit"
              sx={{ ml: 1 }}
              onClick={(event) => {
                event.stopPropagation();
                onClickTableAction(data, 'view_action');
              }}
            >
              <EditIcon />
            </IconButton>
          </>
        );
      default:
        return value;
    }
  };

  return (
    <Box
      ref={tableContainerRef}
      sx={{ height: '100%', width: '100%', bgcolor: 'background.paper', px: 2 }}
    >
      {isFetching ? (
        <TableComponent isLoading={isFetching} />
      ) : (
        <>
          
          <TableComponent
            rowData={editableActions.map((a) => ({ ...a }))}
            columnDefs={getFinalColumnConfig(columnConfig, tableWidth)}
            editable={true}
            pageOption={[20, 50, 100]}
            perPage={20}
            onCellValueChanged={handleCellValueChanged} 
          />
        </>
      )}
    </Box>
  );
}
