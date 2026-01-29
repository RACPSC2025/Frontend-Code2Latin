import React from 'react';
import {
  AccessTime,
  ArrowForwardIosSharp,
  AttachFile,
  ChatBubble,
  DeleteForever,
  Edit,
  EditNote,
  ExpandMore,
  Forum,
  Person,
  Task
} from '@mui/icons-material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  Box,
  Button,
  Select,
  FormControl,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Pagination,
  TextField,
  Tooltip,
  Typography,
  Slider
} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import TableComponent from '../../components/TableComponent';
import TheFullPageLoader from '../../components/TheFullPageLoader';
import { getActionLogtask } from '../../stores/actions/getActionLogtaskSlice';
import { deleteLogtask } from '../../stores/tasks/deleteLogtaskSlice';

//import { fetchListTaskNew } from '../../stores/tasks/fetchListTaskNewSlice';
import { fetchListTaskNew, updateTaskProgress, fetchGetCountries } from '../../stores/tasks/fetchListTaskNewSlice';

import { fetchLogtaskList } from '../../stores/tasks/fetchLogtaskListSlice';
import { getLogtaskDetails } from '../../stores/tasks/getLogtaskDetailsSlice';
import { showErrorMsg } from '../../utils/others';
import MessageCenterActionPlanDialog from '../MessageCenterActionPlanDialog';
import EditActivityDetailsDrawer from '../MessageCenterEventsList/EditActivityDetailsDrawer';
import EditCycleDetailsDrawer from '../MessageCenterEventsList/EditCycleDetailsDrawer';
import EditEventDetailsDrawer from '../MessageCenterEventsList/EditEventDetailsDrawer';
import EditResponsablesDrawer from '../MessageCenterEventsList/EditResponsablesDrawer';

import { setIsTaskSelected, setLogTaskSelected ,setSelectedTaskView } from '../../stores/filterSlice';
import {
  fetchAutocompleteOptions,
  removeAllFilters,
  removeFilter,
  selectFilterItemValue,
  selectListOptions,
  setFilter
} from '../../stores/filterSlice';

//import ProgressSlider from "../../components/Input/ProgressSlider";

// Custom hook to get list options
const useListOptions = (module, fieldName) =>
  useSelector((state) => selectListOptions(state, module, fieldName));

const useListOptionsGlobal = (fieldName) =>
  useSelector((state) => state.globalData?.[fieldName] ?? []);

const useFilterItemValue = (module, fieldName) =>
  useSelector((state) => selectFilterItemValue(state, module, fieldName));

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&::before': {
    display: 'none'
  }
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharp sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
  }
}));

export default function TaskGroupList({ events }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [accordionExpanded, setAccordionExpanded] = useState({});
  //const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [logtaskRows, setLogtaskRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [displayMoreButton, setDisplayMoreButton] = useState(false);
  const [openActivityDetailsDrawer, setOpenActivityDetailsDrawer] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCycleDetailsDrawer, setOpenCycleDetailsDrawer] = useState(false);
  const [openEditResponsablesDrawer, setOpenEditResponsablesDrawer] = useState(false);
  const [editCycleFormModel, setEditCycleFormModel] = useState({});
  const [openActionPlanModal, setOpenActionPlanModal] = useState(false);
  const [actionPlanData, setActionPlanData] = useState([]);
  const [openModalDeleteResp, setOpenModalDeleteResp] = useState(false);
  const [textModalDelete, setTextModalDelete] = useState(false);

  const [countries, setCountries] = useState([]);

  const [tasks, setTasks] = useState([]);
  let [tasksFilters, setTasksFilters] = useState([]);
  const [loadTasks, setLoadTasks] = useState(true);
  const [list_type_of_rule, setList_type_of_rule] = useState([]);
  const [level1, setLevel1] = useState("");
  const [test, setTest] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const pageOption = [10, 20, 50, 100];

  const totalPages = Math.ceil(tasksFilters.length / rowsPerPage);
  const indexOfLastTask = currentPage * rowsPerPage;
  const indexOfFirstTask = indexOfLastTask - rowsPerPage;
  //const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const currentTasks = tasksFilters.slice(indexOfFirstTask, indexOfLastTask);

  const shouldCreateNewAction = useSelector((state) => state.globalData.shouldCreateNewAction);

  const taskListLoading = useSelector((state) => state?.fetchListTaskNew?.loading ?? false);
  const logtaskListLoading = useSelector((state) => state?.fetchLogtaskList?.loading ?? false);

  const listTaskStatus = useFilterItemValue('task', 'task_list_status');
  const currentStatus = useSelector((state) => 
    selectFilterItemValue(state, 'task', 'selectedStatus')
  ) || 0;
  
  const selectedLogTask = useSelector((state) => 
    selectFilterItemValue(state, 'task', 'selectedLogTask')
  ) || {};

  const actionKeyWords = useFilterItemValue('events', 'filter_keywords');
  
  //const [isSelectedTask, setIsSelectedTask] = useState(true);
  const isSelectedTask = useSelector((state) => 
    selectFilterItemValue(state, 'task', 'isSelectedTask')
  ) || false;
  
  const selectedTaskView = useSelector((state) => 
    selectFilterItemValue(state, 'task', 'selectedTaskView')
  ) || 0;


  const handleFetchListTaskNew = (currentPage) => {
    const formData = { page: currentPage };
    dispatch(fetchListTaskNew(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        setTasks(data?.payload?.data);
        setNumberOfPages(data?.payload?.total_pages);
      } else {
        showErrorMsg(data?.payload);
      }
    });
  };

  const handleFetchLogtaskList = (taskId) => {
    dispatch(fetchLogtaskList({ task_id: taskId })).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const newLogtaskRows = data?.payload?.data.map((logtask) => ({
          id: parseInt(logtask.id),
          task_id: parseInt(logtask.task_id),
          logtask_status: logtask.logtask_status,
          title: logtask.logtask_title,
          start_date: logtask.start_date,
          finish_date: logtask.end_date,
          action_plan: parseInt(logtask.actions_count),
          real_closing_date: logtask.real_closing_date,
          closing_opportunity: parseInt(logtask.closing_opportunity_days),
          progress: parseFloat(logtask.percentage),
          completed: logtask.complete !== 'NOT Completed',
          comments_logtask_count: logtask.comments_logtask_count,
          attachments_logtask_count: logtask.attachments_logtask_count
        }));

        setLogtaskRows(newLogtaskRows);
        //console.log("logtaskRows");
        //console.log(newLogtaskRows);
      }
    });
  };

  const handleDeleteLogtask = (task_id) => {
    const formData = new FormData();
    formData.append('logtask_id', task_id);

    dispatch(deleteLogtask(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        setTextModalDelete(t('cycle_removed_successfully'));
      } else {
        setTextModalDelete(t('some_problem_elimination_cycle'));
      }
      setOpenModalDeleteResp(true);
    });
  };

  const handleGetLogtaskDetails = (taskId) => {
    const formData = new FormData();
    formData.append('logtask_id', taskId);

    dispatch(getLogtaskDetails(formData )).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const startDate = data?.payload?.data.start_date?.split(' ')[0];
        const endDate = data?.payload?.data.end_date?.split(' ')[0];
        setEditCycleFormModel({
          logtask_id: taskId,
          percentage: data?.payload?.data.percentage,
          real_closing_date: data?.payload?.data.real_closing_date,
          // completado: data?.payload?.data.completado,
          start_date: startDate,
          end_date: endDate
        });
      }
    });
  };

  let actionPlanIdCounter = 0;

  const handleGetActionLogtask = (task) => {
    const formData = new FormData();
    formData.append('logtask_id', task.id);
    dispatch(getActionLogtask(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const actionPlanData = data?.payload?.data.map((item) => ({
          ...item,
          id: actionPlanIdCounter++
        }));
        setActionPlanData(actionPlanData);
      }
    });
  };

  const handleOpenEditDrawer = (logtask) => {
    setSelectedRow(logtask);
    setOpenEditDrawer(true);
  };

  const handleCloseEditDrawer = () => {
    setOpenEditDrawer(false);
    // setTasks([]);
    // fetchTasks(currentPage);
    // handleFetchListTaskNew(currentPage);
    // setAccordionExpanded({});
  };

  const handleOpenCycleDetailsDrawer = (logtask) => {
    //setSelectedRow(logtask);
    // getLogtaskDetails(logtask.id);
    handleGetLogtaskDetails(logtask?.id);
    setOpenCycleDetailsDrawer(true);
  };

  const handleCloseCycleDetailsDrawer = () => {
    setOpenCycleDetailsDrawer(false);
  };

  const handleOpenEditResponsablesDrawer = (task) => {
    setSelectedRow(task);
    setOpenEditResponsablesDrawer(true);
  };

  const handleCloseEditResponsablesDrawer = () => {
    setOpenEditResponsablesDrawer(false);
  };

  const handleOpenDeleteDialog = (logtask) => {
    setSelectedRow(logtask);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenActivityDrawer = (logtask) => {
    setSelectedRow(logtask);
    setOpenActivityDetailsDrawer(true);
  };

  const handleOpenActionPlan = (logtask) => {
    setSelectedRow(logtask);
    setOpenActionPlanModal(true);
    // getActionPlan(logtask);
    handleGetActionLogtask(logtask);
  };

  const handleCLoseActionPlan = () => {
    setOpenActionPlanModal(false);
  };

  const handleOpenMoreButton = (event, task) => {
    //console.log("OpenTask", task);
    handleOpenActivityDrawer(task);
  };

  const handleExpandAccordion = (event, index, task) => {
    event.stopPropagation();
    setAccordionExpanded({ [index]: !accordionExpanded[index] });
    // fetchLogTask(task.id);
    handleFetchLogtaskList(task?.id);
  };

  const handleDeleteCycle = () => {
    // deleteCycle(selectedRow.id);
    handleDeleteLogtask(selectedRow.id);
    setOpenDeleteDialog(false);
  };

  const handleOnDrawerOpened = () => {
    setSelectedRow([]);
  };

  
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

  
  const getTypeFilterTasksByCurrentStatus = (tasksFiltersTemp, currentStatus) => {
    //console.log("currentStatus F: ", currentStatus )
    if(currentStatus !== null && currentStatus !== "" && currentStatus !== 0  && currentStatus !== -1&& currentStatus !== "-1"){
      tasksFiltersTemp = (tasksFiltersTemp.filter((item) => item.task_status === currentStatus));
      //getTypeFilterTasksByDate(tasksFiltersTemp, actionStartDate, actionEndDate);
      setTasksFilters(tasksFiltersTemp);
    }
    else{
      //getTypeFilterTasksByDate(tasksFiltersTemp, actionStartDate, actionEndDate);
      setTasksFilters(tasksFiltersTemp);
    }
    setTasksFilters(tasksFiltersTemp);
  }
      

  useEffect(() => {
    if (loadTasks) {
      setLoadTasks(false);
      handleFetchListTaskNew();
    }
  }, [loadTasks]);
  
  /*
  useEffect(() => {
    if (tasks.length > 0) {
      setTasksFilters(tasks);
    }
  }, [tasks]); // Se ejecuta cuando cambia `tasks`
  */

  
  useEffect(() => {
    let tasksFiltersTemp = tasks

    if (tasksFiltersTemp.length > 0) {
      if(isSelectedTask){
        tasksFiltersTemp = tasks.filter((item) => item.id === selectedLogTask.task_id);
        //handleSetFilterItemValue('task', 'isSelectedTask', false);
        setTasksFilters(tasksFiltersTemp);
      }
      else{
        if (actionKeyWords && actionKeyWords.trim() !== "" && tasks.length > 0) {
          tasksFiltersTemp = (
            tasksFiltersTemp.filter((item) =>
              item.task_title.match(new RegExp(actionKeyWords, "i"))
            )
          );
          getTypeFilterTasksByCurrentStatus(tasksFiltersTemp, currentStatus);
        }
        else{
          getTypeFilterTasksByCurrentStatus(tasksFiltersTemp, currentStatus);
        }   
      }
    } 
  }, [tasks, isSelectedTask, selectedLogTask, currentStatus]);


  /*
  useEffect(() => {
    let tasksFiltersTemp = tasks;
    //console.log("tasksFiltersTemp");
    //console.log(tasksFiltersTemp);
    if (actionKeyWords && actionKeyWords.trim() !== "" && tasks.length > 0) {
      tasksFiltersTemp = (
        tasksFiltersTemp.filter((item) =>
          item.task_title.match(new RegExp(actionKeyWords, "i"))
        )
      );
      getTypeFilterTasksByCurrentStatus(tasksFiltersTemp, currentStatus, actionStartDate, actionEndDate, actionNameDateField, actionCategory);
    }
    else{
      getTypeFilterTasksByCurrentStatus(tasksFiltersTemp, currentStatus, actionStartDate, actionEndDate);
    }    
  }, [actionKeyWords, tasksFilters, tasks, currentStatus, actionStartDate, actionEndDate, actionNameDateField, actionCategory]); // Se ejecuta cuando cambian las variables de los filtros
  */

  /*
  useEffect(() => {
    let tasksFiltersTemp = tasks
    if (actionKeyWords && actionKeyWords.trim() !== "" && tasks.length > 0) {
      tasksFiltersTemp = (
        tasksFiltersTemp.filter((item) =>
          item.requirement_description.match(new RegExp(actionKeyWords, "i")) ||
          item.requirement_name.match(new RegExp(actionKeyWords, "i"))
        )
      );
      getTypeFilterTasksByTypeOfRule(tasksFiltersTemp, actionStatusTypeOfRule, actionStartDate, actionEndDate, actionNameDateField, actionCategory);
    }
    else{
      getTypeFilterTasksByTypeOfRule(tasksFiltersTemp, actionStatusTypeOfRule, actionStartDate, actionEndDate);
    }    
  }, [actionKeyWords, tasksFilters, tasks, actionStatusTypeOfRule, actionStartDate, actionEndDate, actionNameDateField, actionCategory]); // Se ejecuta cuando cambian las variables de los filtros
  
  */

  // Configuration to modify the progress of a task  
  //const [progressValue, setProgressValue] = useState(parseInt(task.progress) || 0);

  // 👉 Aquí defines tu función `progress`
  const progress = (value) => parseInt(value);

  const handleSliderChange = (event, newValue) => {
    //setProgress(newValue);
  };

  /*
  const handleSliderCommit = (taskId, newProgress) => {
    console.log("Change Task:", taskId, "Nuevo progreso:", newProgress);
    //updateTaskProgress
  };
  */

  const handleSliderCommit = (taskId, newProgress) => {
    //console.log("Change Task:", taskId, "Nuevo progreso:", newProgress);

    // Llamar al thunk para actualizar en el backend
    dispatch(updateTaskProgress({ id: taskId, progress: newProgress }))
      .unwrap()
      .then((response) => {
        console.log("Progreso actualizado con éxito:", response);
      })
      .catch((error) => {
        console.error("Error al actualizar progreso:", error);
      });
  };

  const actionPlanTableColumns = [
    {
      field: 'action_id',
      headerName: 'ID de la acción',
      width: 100,
      type: 'string'
    },
    {
      field: 'module_id',
      headerName: 'ID del módulo',
      width: 100,
      type: 'string'
    },
    {
      field: 'action_category',
      headerName: 'Categoría de la acción',
      width: 100,
      type: 'string'
    },
    {
      field: 'action_start_date',
      headerName: 'Fecha de inicio',
      width: 100,
      type: 'string'
    },
    {
      field: 'action_closing_date',
      headerName: 'Fecha propuesta de cierre',
      width: 100,
      type: 'string'
    },
    {
      field: 'action_status',
      headerName: 'Estado de la acción',
      width: 200,
      type: 'string'
    },
    {
      field: 'responsible_person',
      headerName: 'Responsable',
      width: 200,
      type: 'string'
    },
    {
      field: 'reviewer_person',
      headerName: 'Revisor',
      width: 200,
      type: 'string'
    },
    {
      field: 'real_closing_date',
      headerName: 'Fecha de cierre real',
      width: 200,
      type: 'string'
    },
    {
      field: 'why_description',
      headerName: 'Descripción de por qué',
      width: 200,
      type: 'string'
    },
    {
      field: 'what_description',
      headerName: 'Descripción de qué',
      width: 200,
      type: 'string'
    },
    {
      field: 'how_description',
      headerName: 'Descripción de cómo',
      width: 200,
      type: 'string'
    },
    {
      field: 'comment_count',
      headerName: 'Comentarios',
      width: 200,
      type: 'string'
    },
    {
      field: 'action_status',
      headerName: 'Estado',
      width: 200,
      type: 'string'
    }
  ];

  const tableColumns = [
    { field: 'id', headerName: t('ID'), width: 80, type: 'string' },
    //{ field: 'logtask_status', headerName: t('status'), width: 80, type: 'string' },
    {
    field: 'logtask_status',
    headerName: t('status'),
    width: 120,
    type: 'string',
    cellRenderer: (params) => {
      if (!params.value) return null;

      const tempStatus = String(params.value).toLowerCase();

      // buscar coincidencia en listTaskStatus
      const matchedStatus = listTaskStatus.find((status) => {
        const statusNumber = String(status.value_number).toLowerCase();
        const statusValue = String(status.value).toLowerCase();
        const statusLabel = String(status.label).toLowerCase();

        return (
          statusNumber === tempStatus ||
          statusValue === tempStatus ||
          statusLabel === tempStatus
        );
      });

      // si hay match, mostramos con color
      if (matchedStatus) {
        return (
          <Box>
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
            {matchedStatus.label}
          </Box>
        );
      }

        // fallback: si no hay match, mostramos el valor crudo
        return <span>{params.value}</span>;
      },
    },
    { field: 'progress', headerName: t('progress'), width: 120, type: 'string' },
    {
      field: 'actions',
      headerName: t('Acciones'),
      width: 200,
      type: 'string',
      cellRenderer: (params) => {
        //console.log("tasksFilters table: ", tasksFilters);
        //console.log("listTaskStatus: ", listTaskStatus);
        return (
          <Box display="flex" gap={1}>
            <Tooltip title={t('edit')}>
              <span>
                <IconButton onClick={() => handleOpenCycleDetailsDrawer(params?.data)}>
                  <Edit />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t('delete')}>
              <span>
                <IconButton onClick={() => handleOpenDeleteDialog(params?.data)}>
                  <DeleteForever />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t('followups')}>
              <span>
                <IconButton onClick={() => handleOpenEditDrawer(params?.data)}>
                  <Forum />
                  <Typography variant="body2" color="textSecondary">
                    {parseInt(params?.data.comments_logtask_count)}
                  </Typography>
                </IconButton>

                <IconButton onClick={() => handleOpenEditDrawer(params?.data)}>
                  <AttachFile />
                  <Typography variant="body2" color="textSecondary">
                  {parseInt(params?.data.attachments_logtask_count)}
                  </Typography>
                </IconButton>

              </span>
            </Tooltip>
            <Tooltip title={t('responsible')}>
              <span>
                <IconButton onClick={() => handleOpenEditResponsablesDrawer(params?.data)}>
                  <Person />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        );
      }
    },
    //{ field: 'title', headerName: t('title'), width: 180, type: 'string' },
    { field: 'start_date', headerName: t('ExpectedStartDate'), width: 150, type: 'string' },
    { field: 'finish_date', headerName: t('end_date'), width: 150, type: 'string' },
    /*
    {
      field: 'action_plan',
      headerName: t('action_plan'),
      width: 120,
      type: 'string',
      cellRenderer: (params) => {
        return (
          <Button
            variant="outlined"
            startIcon={<ChatBubble />}
            color="primary"
            onClick={() => handleOpenActionPlan(params.data)}
          >
            {params.value}
          </Button>
        );
      }
    },
    */
    { field: 'real_closing_date', headerName: t('ActualClosingDate'), width: 150, type: 'string' },
    {
      field: 'closing_opportunity',
      headerName: t('opportunity_for_closure'),
      width: 150,
      type: 'string'
    },
    { field: 'completed', headerName: t('Completed'), width: 120, type: 'boolean' }
  ];

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Back to the first page when change the total pages
  };

    
  function getLabelByStatus(status) {
    const match = listTaskStatus.find(item => item.value_number === String(status));
    return match ? match.label : null;
  }

  /*
  const { label, color } = getStatusProps(task.task_status);

  function getStatusProps(status) {
    const match = listTaskStatus.find(item => item.value_number === String(status));
    return match
      ? { label: match.label, color: match.color_code }
      : { label: "", color: "gray" }; // fallback
  }
  */

  const getCorrectText = (text) => {
    const bytes = new Uint8Array([...text].map(c => c.charCodeAt(0)));
    const correctText = new TextDecoder("utf-8").decode(bytes);
    return correctText;
  };

  return (
    <>
      {taskListLoading ? (
        <Box
          sx={{
            width: '100%',
            height: '41rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TheFullPageLoader loaderText="" background="transparent" />
        </Box>
      ) : (
        <>
        {/* Paginador arriba */}
        <div style={{ marginBottom: 10, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
        
        <FormControl sx={{ minWidth: 120 }}>
          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <span>{t("Page Size")}:</span>
            <select
              onChange={handleRowsPerPageChange}
              value={rowsPerPage}
              className="w-[70px] h-[30px] border border-gray-300 rounded-md px-2 py-1 text-sm 
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          bg-white shadow-sm hover:bg-gray-50"
            >
              {pageOption.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </FormControl>

        <span className="ag-paging-row-summary-panel">
          <span className="ag-paging-row-summary-panel-number">{1+(rowsPerPage*(currentPage-1))} </span>
          <span> {t("to")} </span>
          <span className="ag-paging-row-summary-panel-number">{rowsPerPage * currentPage}</span>
          <span > {t("of")} </span>
          <span className="ag-paging-row-summary-panel-number">{totalPages} </span>
        </span>

        <button className="contents h-[1em] w-[1em]" 
          onClick={() => goToPage(1)} disabled={currentPage === 1}>
          <FirstPageIcon className="h-[1em] w-[1em] MuiIcon-colorAction" disabled={currentPage === 1}/>
        </button>
        <button className="contents h-[1em] w-[1em]" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          <ArrowBackIosNewIcon className="!h-[13px] !w-[13px]"/>
        </button>
        <span>
          {t("page")} {currentPage} {t("of")} {totalPages}
        </span>
        <button className="contents h-[1em] w-[1em]" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          <ArrowForwardIosIcon className="!h-[13px] !w-[13px]"/>
        </button>
        <button className="contents h-[1em] w-[1em]"
          onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
          <LastPageIcon className="h-[1em] w-[1em]" />
        </button>
      </div>

        <Box className="max-h-[600px] overflow-y-auto m-[10px]">
          {tasksFilters && tasksFilters.length > 0 && (
            <>
              {/*{tasks.map((task, index) => {
              */}
              {currentTasks.map((task, index) => {
                const date = new Date(task.task_end_date);
                const formattedDate = `${date.getDate()} ${date.toLocaleDateString('default', { month: 'short' })}, ${date.getFullYear()}`;

                return (
                  <Accordion
                    expanded={accordionExpanded[index] || false}
                    style={{ cursor: 'default', '&:hover': { cursor: 'default' } }}
                    key={index}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMore
                          fontSize="large"
                          style={{
                            cursor: 'pointer',
                            '&:hover': { cursor: 'pointer' }
                          }}
                          onClick={(event) => handleExpandAccordion(event, index, task)}
                        />
                      }
                      style={{ cursor: 'default', '&:hover': { cursor: 'default' } }}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <Box sx={{ width: '70%' }}>
                          <Box display="flex" alignItems="center" gap={1} margin="5px 0">
                            <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                              ID: 
                            </Typography>
                            <Typography variant="body2">{task.id}</Typography>
                            <Task />
                            <Typography variant="body2">{task.task_title}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1} margin="5px 0">
                            <Person color="primary" />
                            <Typography variant="body2" color="primary">
                              <Tooltip title="Responsables" arrow>
                                {Object.entries(task.responsibles).map(
                                  ([key, responsible], index) => responsible
                                )}
                              </Tooltip>
                              <Tooltip title="Revisores" arrow>
                                    {' '} | {' '}
                                {Object.entries(task.reviewers).map(
                                  ([key, reviewer], index) => reviewer
                                )}
                              </Tooltip>
                              {/* // TODO: Add circle avatar for each responsible and reviewer if there are > 3 */}
                            </Typography>
                            <Tooltip title={t('created_by')} arrow>
                              <Chip label="superAdmin" color="primary" size="small" />
                            </Tooltip>
                          </Box>
                          <Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              {/*
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <AccessTime />
                                <Typography variant="body2" color="textSecondary">
                                  {formattedDate}
                                </Typography>
                              </Box>
                              */}
                              <Box display="flex" gap={1}>
                                <Tooltip title={t("comments")} arrow>
                                  <Box display="flex" alignItems="center">
                                    <Forum style={{ marginRight: '5px' }} />
                                    <Typography variant="body2" color="textSecondary">
                                      {parseInt(task.comment_count)}
                                    </Typography>
                                  </Box>
                                </Tooltip>
                                <Tooltip title={t("attachments")} arrow>
                                  <Box display="flex" alignItems="center">
                                    <AttachFile />
                                    <Typography variant="body2" color="textSecondary">
                                    {parseInt(task.num_documents)}
                                    </Typography>
                                  </Box>
                                </Tooltip>
                              </Box>
                              <Box display="flex" gap={0.3}>
                                <Tooltip title={t('tags')} arrow>
                                  {Object.entries(task.tags).map(([key, tagObject], index) => (
                                    <Chip
                                      key={key}
                                      //label={getCorrectText(tagObject.tag_name)}
                                      label={tagObject.tag_name}
                                      size="small"
                                      color="warning"
                                      className="mr-2"
                                    />
                                  ))}
                                </Tooltip>
                              </Box>
                            </Box>
                          </Box>
                        </Box>

                        <Box sx={{ width: '25%', mr: 1 }}>
                          <Box>
                            <BorderLinearProgress variant="determinate" value={Number(task.progress)} />
                            <Box display="flex" alignItems="center" justifyContent="space-between" 
                              sx={{ marginTop: '6px' }}
                            >
                              <Typography variant="body2" color="textSecondary">
                                {parseInt(task.progress)}% {t('of')} 100%
                              </Typography>
                              {/* 
                              <Typography variant="body2" color="textSecondary">
                                {formattedDate}
                              </Typography>
                              */}
                              <p className='text-gray-400 font-normal'>
                                {t(getLabelByStatus(task.task_status))}
                              </p>
                              {/*
                              <p style={{ color }} className="font-normal">
                                {t(label)}
                              </p>
                              */}
                            </Box>
                          </Box>
                        </Box>
                        
                        <Tooltip title="Editar Actividad" arrow>
                          <Box sx={{ width: '5%' }}>
                            <IconButton onClick={(event) => handleOpenMoreButton(event, task)}>
                              <EditNote />
                            </IconButton>
                          </Box>
                        </Tooltip>
                      </Box>
                    </AccordionSummary>
                    {accordionExpanded[index] && (
                      <AccordionDetails>
                        {/* hide search button for now
                        <Box display="flex" justifyContent="space-between">
                          <Box margin="10px 0">
                            <TextField label="Buscar" variant="outlined" size="small" />
                          </Box>
                        </Box>
                        */}
                        <Box sx={{ height: 300, width: '100%' }}>
                          <TableComponent
                            rowData={logtaskRows}
                            //rowData={task.logtask_list}
                            columnDefs={tableColumns}
                            pageOption={[10, 25, 50, 100]}
                            // isLoading={logtaskListLoading}
                          />
                        </Box>
                      </AccordionDetails>
                    )}
                  </Accordion>
                );
              })}
            </>
          )}
          {Object.keys(selectedRow).length > 0 && (
            <EditEventDetailsDrawer
              openEditDrawer={openEditDrawer}
              onCloseEditDrawer={handleCloseEditDrawer}
              logTaskDetails={selectedRow}
              onDrawerOpened={handleOnDrawerOpened}
            />
          )}
          {Object.keys(selectedRow).length > 0 && (
            <EditActivityDetailsDrawer
              openActivityDetailsDrawer={openActivityDetailsDrawer}
              onCloseActivityDetailsDrawer={() => setOpenActivityDetailsDrawer(false)}
              taskDetails={selectedRow}
            />
          )}

          {openCycleDetailsDrawer && (
            <EditCycleDetailsDrawer
              openCycleDetailsDrawer={openCycleDetailsDrawer}
              onCloseCycleDetailsDrawer={handleCloseCycleDetailsDrawer}
              taskDetails={selectedRow}
              formModel={editCycleFormModel}
              onDrawerOpened={handleOnDrawerOpened}
              onCloseEditDrawer={handleCloseEditDrawer}
            />
          )}

          {openEditResponsablesDrawer && (
            <EditResponsablesDrawer
              openEditResponsablesDrawer={openEditResponsablesDrawer}
              onCloseEditResponsablesDrawer={handleCloseEditResponsablesDrawer}
              taskDetails={selectedRow}
            />
          )}
          <Menu
            id="more-button-menu"
            anchorEl={displayMoreButton}
            open={Boolean(displayMoreButton)}
            onClose={() => setDisplayMoreButton(false)}
          >
            <MenuItem onClick={() => handleOpenActivityDrawer()}>{t('edit_activity')}</MenuItem>
            <MenuItem onClick={() => {}}>Menu item 2</MenuItem>
            <MenuItem onClick={() => {}}>Menu item 3</MenuItem>
          </Menu>

          <Dialog
            open={openActionPlanModal}
            onClose={handleCLoseActionPlan}
            PaperProps={{
              style: {
                height: '90%',
                width: '100vw'
              }
            }}
            fullWidth={true}
            maxWidth={'xl'}
          >
            <DialogContent>
              {/* <Box marginBottom='20px'>
              <Typography variant="h4" align="center">
                Plan de Acción
              </Typography>
              <DataGrid
                rows={actionPlanData}
                columns={actionPlanTableColumns}
                hideFooter={true}
                autoHeight={true}
              />
            </Box>
            <Button
              variant="contained"
              color="warning"
              size="large"
              marginTop='40px'
              onClick={() => dispatch(toggleShouldCreateNewAction({ status: true }))}
            >
              + {t('createAction')}
            </Button> */}
              <MessageCenterActionPlanDialog task={selectedRow.id} />
            </DialogContent>
          </Dialog>

          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <Box display="flex" justifyContent="center" alignItems="center">
                <HighlightOffIcon
                  color="error"
                  sx={{ fontSize: 80 }}
                  margin="10px 0"
                  align="center"
                />
              </Box>
              <Typography variant="h4" align="center">
                {t('are_you_sure_you_want_to_remove_this_cycle')}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                padding="5px 20px"
                alignItems="center"
              >
                <Button
                  size="large"
                  variant="outlined"
                  onClick={handleCloseDeleteDialog}
                  color="primary"
                >
                  {t('Cancel')}
                </Button>
                {/* <Button size="large" variant="contained">
                Borrado Suave
              </Button> */}
                <Button size="large" color="error" variant="contained" onClick={handleDeleteCycle}>
                  {t('soft_delete')}
                </Button>
              </Box>
            </DialogActions>
          </Dialog>
          <Modal open={openModalDeleteResp} onClose={() => setOpenModalDeleteResp(false)}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4
              }}
            >
              <Typography variant="h5" sx={{ marginBottom: '40px' }}>
                {textModalDelete}
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{ marginTop: '30px' }}
                onClick={() => setOpenModalDeleteResp(false)}
              >
                Ok
              </Button>
            </Box>
          </Modal>

        </Box>
        
        </>
      )}
    </>
  );
}
