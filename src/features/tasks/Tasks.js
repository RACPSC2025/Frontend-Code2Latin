import {
  Apps,
  ArrowDownward,
  AssignmentReturned,
  CalendarMonth,
  Dashboard,
  DownloadDone,
  Insights,
  ListAlt,
  Loop,
  TableChart,
  Tune
} from '@mui/icons-material';
import {
  Box,
  FormControl,
  Button,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Checkbox,
  Select,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  OutlinedInput
} from '@mui/material';

//import { Menu, MenuItem } from '@mui/material';

import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import ReactCountryFlag from 'react-country-flag';
import ReactFlagsSelect from "react-flags-select";

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BaseFeaturePageLayout from '../../components/BaseFeaturePageLayout';
// SpeedDialComponent ubicado en Task.js (Boton Flotante) - Comentado temporalmente
// import SpeedDialComponent from '../../components/SpeedDialComponent';
import { STATUS } from '../../config/constants';
import { useLanguage } from '../../providers/languageProvider';
import { fetchEventsList } from '../../stores/events/fetchEventsListSlice';

import AIActionButton from '../../components/AIActionButton';

import { selectAppliedFilterModel, setSelectedStatus, setSelectedTaskView, selectedColumns } from '../../stores/filterSlice';
//import { setIsTaskSelected, setLogTaskSelected ,setSelectedTaskView } from '../../stores/filterSlice';
import {
  fetchAutocompleteOptions,
  removeAllFilters,
  removeFilter,
  selectFilterItemValue,
  selectListOptions,
  setFilter
} from '../../stores/filterSlice';

import { areDatesSame, formatDayjs, getCurrentDate } from '../../utils/dateTimeFunctions';
import CreateTask from './CreateTaskDrawer';
import DayTaskList from './DayTaskList';
import TaskCalender from './TaskCalender';
import TaskDetailsDrawer from './TaskDetailsDrawer';
import TaskGroupList from './TaskGroupList';
import TaskReport from './TaskReport';
import TaskTableList from './TaskTableList';
import TasksListView from './TasksListView';
import UpcomingTaskList from './UpcomingTaskList';
//import { selectAppliedFilterModel } from '../../stores/filterSlice';
//import { setSelectedStatus } from '../redux/statusSlice'; // Asegúrate de definir esta acción en tu Redux slice

const useAppliedFilterModel = (module) => {
  return useSelector((state) => selectAppliedFilterModel(state, module));
};

// Custom hook to get list options
const useListOptions = (module, fieldName) =>
  useSelector((state) => selectListOptions(state, module, fieldName));

const useListOptionsGlobal = (fieldName) =>
  useSelector((state) => state.globalData?.[fieldName] ?? []);

const useFilterItemValue = (module, fieldName) =>
  useSelector((state) => selectFilterItemValue(state, module, fieldName));

//const taskListLoading = useSelector((state) => state?.fetchListTaskNew?.loading ?? false);


export default function Component() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const dispatch = useDispatch();
  const calendarContainerRef = useRef(null);
  const dateFormat = 'YYYY-MM-DD';

  const [selectedEvent, setSeletedEvent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [events, setEvents] = useState([]);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState(null);
  
  // selectedView have "report" as default value
  const [selectedView, setSelectedView] = useState('list'); // ['calendar', 'list', 'table', 'report', 'insights', 'settings'
  
  const selectedTaskView = useSelector((state) => 
    selectFilterItemValue(state, 'task', 'selectedTaskView')
  );

  const listTaskStatus = useFilterItemValue('task', 'task_list_status') || [];
  const [taskListStatusLoading, settaskListStatusLoading] = useState(true);


  const handleChangeItemValue = (module, value, id) => {
    dispatch(setFilter(module, id, value));
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

  const changeView = (view) => {
    setSelectedView(view);
    if(view === 'list') {
      handleSetFilterItemValue('task', 'isSelectedTask', false);
    }
    handleSetFilterItemValue('task', 'selectedTaskView', view);
  };
  
  useEffect(() => {
    if (selectedTaskView != undefined) {
      setSelectedView(selectedTaskView);
    }    
  }, [selectedTaskView]); // Se ejecuta cuando cambian las variables de los filtros
  
  const [country, setCountry] = useState('Colombia');
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { in_progress, completed, delayed, pending } = STATUS;

  const filterData = useAppliedFilterModel('events'); // Tareas vencidad agregar

  const newActionFormModel = useRef(null);
  const [actionFormModel, setActionFormModel] = useState({});
  const [selectedAction, setSelectedAction] = useState(null);
  const [level1Options, setLevel1Options] = useState([]);
  const [level1Selected, setLevel1Selected] = useState('');
  const [level2Options, setLevel2Options] = useState([]);
  const [level2Selected, setLevel2Selected] = useState('');
  const [loadingLevel2, setLoadingLevel2] = useState(true);
  const [level3Options, setLevel3Options] = useState([]);
  const [level3Selected, setLevel3Selected] = useState('');
  const [loadingLevel3, setLoadingLevel3] = useState(true);
  const [level4Options, setLevel4Options] = useState([]);
  const [level4Selected, setLevel4Selected] = useState('');
  const [loadingLevel4, setLoadingLevel4] = useState(true);
  const [level5ptions, setLevel5Options] = useState([]);
  const [level5Selected, setLevel5Selected] = useState('');
  const [loadingLevel5, setLoadingLevel5] = useState(true);

  /*
  const mutateEventList = (event) => {
    console.log('event testttt', event);
    return event.map((item) => {
      let status;
      let taskStatus = item.status.toLowerCase();
      if (taskStatus === in_progress || item.status === '') {
        status = t('In progress');
      } else if (taskStatus === completed) {
        status = t('Completed');
      } else if (taskStatus === delayed) {
        status = t('Delayed');
      } else if (taskStatus === pending) {
        status = t('Pending');
      } else {
        status = '';
      }

      let color;
      switch (item.status.toLowerCase()) {
        case in_progress || '':
          color = 'blue';
          break;
        case delayed:
          color = 'red';
          break;
        case completed:
          color = 'green';
          break;
        case pending:
          color = 'orange';
          break;
        default:
          color = 'blue';
      }

      let description;
      if (language === 'en') {
        description = item.message_en;
      } else {
        description = item.message_es;
      }

      let title;
      if (language === 'en') {
        title = item.desc_en;
      } else {
        title = item.desc_es;
      }
      return {
        id: item.id_event,
        date: item.date_of_reminder,
        // Swap description and title, to show description in the calendar
        description: description,
        title: title,
        invited_by: item.executioner_user_names,
        meeting_link: null,
        time_of_event: null,
        reviewer: item.reviewer_user_names,
        executioner: item.executioner_user_names,
        status: status,
        form_code: item.form_code,
        business: item.nb_business,
        country: item.nb_country,
        plant: item.nb_plant,
        region: item.nb_region,
        region_value: item.region,
        color: color,
        en_status: item.status
      };
    });
  };
  */
  const mutateEventList = (event) => {
    return event.map((item) => {
      const matchedStatus = listTaskStatus.find(
        (s) => s.value === item.status
      );

      const statusLabel = matchedStatus ? t(matchedStatus.label) : '';
      const color = matchedStatus ? matchedStatus.color_code : 'gray';

      const description = language === 'en' ? item.message_en : item.message_es;
      const title = language === 'en' ? item.desc_en : item.desc_es;

      return {
        id: item.id_event,
        date: item.date_of_reminder,
        description: description,
        title: title,
        invited_by: item.executioner_user_names,
        meeting_link: null,
        time_of_event: null,
        reviewer: item.reviewer_user_names,
        executioner: item.executioner_user_names,
        status: statusLabel,
        form_code: item.form_code,
        business: item.nb_business,
        country: item.nb_country,
        plant: item.nb_plant,
        region: item.nb_region,
        region_value: item.region,
        color: color,
        en_status: item.status
      };
    });
  };

  /*
  const statusOptions = [
    { id: '-1', value: '0', label: 'All' },
    { id: '1', value: '1', label: 'In_Progress' },
    { id: '2', value: '2', label: 'Delayed' },
    { id: '3', value: '3', label: 'Cancel' },
    { id: '4', value: '4', label: 'Finish' }
   ];
   */
  /*
  const statusOptions = [
    { id: '-1', value: '0', label: 'All' },
    ...listTaskStatus.map((status) => ({
      id: status.value_number,
      value: status.value_number,
      label: status.label
    }))
  ];
  */
  const [statusOptions, setStatusOptions] = useState([
    { id: '-1', value: '-1', label: 'All' }
  ]);

  useEffect(() => {
    if (taskListStatusLoading  && listTaskStatus.length > 0) {
      settaskListStatusLoading(false);
      const options = listTaskStatus.map((status) => ({
        id: status.value_number,
        value: status.value_number,
        label: status.label
      }));
      setStatusOptions((prevOptions) => [...prevOptions, ...options]);
    }
  } , [listTaskStatus, taskListStatusLoading]);
   
  const filterArray = [
    {
      id: 'level1',
      label: 'Business',
      value: level1Selected,
      handleChange: setLevel1Selected,
      options: level1Options,
      isDisabled: false
    },
    {
      id: 'level2',
      label: 'Company',
      value: level2Selected,
      handleChange: setLevel2Selected,
      options: level2Options,
      isDisabled: loadingLevel2
    },
    {
      id: 'level3',
      label: 'Region',
      value: level3Selected,
      handleChange: setLevel3Selected,
      options: level3Options,
      isDisabled: loadingLevel3
    },
    {
      id: 'level4',
      label: 'Location',
      value: level4Selected,
      handleChange: setLevel4Selected,
      options: level4Options,
      isDisabled: loadingLevel4
    }
  ];

  const [currentStatus, setCurrentStatus] = useState(-1);

  const module = useSelector((state) => state.filter.module);
  
  const selectedStatus = useSelector((state) => 
    selectFilterItemValue(state, 'task', 'selectedStatus')
  ) || 0; // Valor por defecto si es undefined

  const handleChangeStatus = (event) => {
    handleSetFilterItemValue("task", "selectedStatus" ,event.target.value);
    setCurrentStatus(event.target.value);
  };

  const handleFetchEventList = () => {
    dispatch(fetchEventsList()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const eventData = data?.payload?.data ?? [];
        setEvents(mutateEventList(eventData));
      }
    });
  };

  const allEventsForSelectedDate = () => {
    const formattedDate = formatDayjs(selectedDate, dateFormat);
    return events.filter((event) => areDatesSame(event.date, formattedDate));
  };

  const handleEventClick = ({ event }) => {
    const eventDetails = events.find((e) => e.id === event.id);
    setSeletedEvent(eventDetails);
    setDrawerOpen(true);
  };

  // SpeedDialComponent ubicado en Task.js (Boton Flotante) - Comentado temporalmente
  /*
  const speedDialActions = [
    { icon: <DownloadDone />, name: 'Añadir Tarea Permanente', type: 'permanente' },
    { icon: <Loop />, name: 'Añadir Tarea Cíclica', type: 'ciclica' },
    { icon: <AssignmentReturned />, name: 'Añadir Tarea Única', type: 'unica' }
  ];
  */

  const [countrySelected, setCountrySelected] = useState("CO");

  //const viewTabArray = ['dashboard', 'calendar', 'list', 'table', 'report', 'adjustments'];
  const viewTabArray = ['calendar', 'list', 'table', 'report', 'adjustments'];

  const iconMapping = (viewTab, selectedView) => {
    const iconProps = {
      color: selectedView === viewTab ? 'warning' : 'action',
      fontSize: 'medium'
    };

    
    const icons = {
      calendar: <CalendarMonth {...iconProps} />,
      list: <ListAlt {...iconProps} />,
      table: <TableChart {...iconProps} />,
      report: <Insights {...iconProps} />,
      adjustments: <Tune {...iconProps} />
    };
    /*
    const icons = {
      dashboard: <Dashboard {...iconProps} />,
      calendar: <CalendarMonth {...iconProps} />,
      list: <ListAlt {...iconProps} />,
      table: <TableChart {...iconProps} />,
      report: <Insights {...iconProps} />,
      adjustments: <Tune {...iconProps} />
    };
    */

    return icons[viewTab] || null;
  };

  useEffect(() => {
    handleFetchEventList();
  }, [filterData]);
  
  function handleClearFilters() {
    setLevel1Selected('');
    setLevel2Selected('');
    setLevel3Selected('');
    setLevel4Selected('');
  }
  
  const selectedColumns = useSelector((state) => 
    selectFilterItemValue(state, 'task', 'selectedColumns')
  );

  //const [isUseColumns, setIsUseColumns] = useState(false);

  const adjustmentOptions = [
    { label: 'Select columns', value: 'selectedColumnsOption' },
  ];
  
  const [selectedAdjustments, setSelectedAdjustments] = useState([]);

  const [adjustmentAnchorEl, setAdjustmentAnchorEl] = useState(null);
  const [selectedAdjustmentOption, setSelectedAdjustmentOption] = useState(null);

  /*
  const handleOpenAdjustments = (event) => {
    setAdjustmentAnchorEl(event.currentTarget);
  };
  */

  const handleOpenAdjustments = (e) => {
    setAdjustmentAnchorEl(e.currentTarget);
  };

  const handleCloseAdjustments = () => {
    setAdjustmentAnchorEl(null);
  };

  const handleSelectAdjustment = (option) => {
    setSelectedAdjustmentOption(option);
    handleCloseAdjustments();
  };

  /*
  const handleToggleAdjustment = (value) => {
    value = !value;
    // cambios
    //handleSetFilterItemValue("tasks", "selectedColumns" , value);
    handleSetFilterItemValue('task', 'selectedColumns', updatedAdjustments);
    
    setSelectedAdjustments((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };
  */

  /*
  const handleToggleAdjustment = (value) => {
    const isSelected = selectedAdjustments.includes(value);
  
    const updatedAdjustments = isSelected
      ? selectedAdjustments.filter((item) => item !== value)
      : [...selectedAdjustments, value];
  
    setSelectedAdjustments(updatedAdjustments);
  
    // Si querés sincronizar con Redux:
    handleSetFilterItemValue('task', 'selectedColumns', updatedAdjustments);
  };
  */

  const handleToggleAdjustment = () => {
    const newValue = !selectedColumns;
    handleSetFilterItemValue('task', 'selectedColumns', newValue);
    handleCloseAdjustments(); // Si querés que se cierre el menú al hacer click
  };
  
  return (
    <Box sx={{ width: '100%', py: 1 }}>
      {/* Barra de Filtros y Navegación de Vistas (Estilo Imagen 1 & 2) */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        px: 3, 
        py: 1,
        bgcolor: 'white',
        borderBottom: '1px solid #edf2f4',
        mb: 0.5
      }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {filterArray.map((filter, index) => (
            <FormControl key={index} size="small" sx={{ minWidth: 140 }}>
              <Select
                id={filter.id}
                value={filter.value}
                displayEmpty
                disabled={filter.isDisabled}
                onChange={(e) => filter.handleChange(e.target.value)}
                sx={{ 
                  height: '40px', 
                  borderRadius: '6px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e6ed' },
                  color: filter.value ? '#263238' : '#90a4ae',
                  fontSize: '0.85rem'
                }}
                renderValue={(selected) => {
                  if (!selected) return <span style={{ color: '#90a4ae' }}>{t(filter.label)}</span>;
                  return filter.options.find(opt => opt.value === selected)?.label || selected;
                }}
              >
                {filter.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleClearFilters}
            sx={{ 
              fontWeight: 800, 
              color: '#00bcd4', 
              borderColor: '#00bcd480', 
              textTransform: 'none',
              px: 2,
              height: '40px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              '&:hover': { borderColor: '#00bcd4', bgcolor: 'rgba(0,188,212,0.04)' }
            }}
          >
            {t('LIMPIAR FILTROS')}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-end', pb: 0.5 }}>
          {viewTabArray.map((viewTab) => {
            const isActive = selectedView === viewTab;
            return (
              <Box
                key={viewTab}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { opacity: 1 }
                }}
                onClick={() => changeView(viewTab)}
              >
                <Box sx={{ color: isActive ? '#f57c00' : '#b0bec5', mb: 0.2 }}>
                  {iconMapping(viewTab, selectedView)}
                </Box>
                <Typography sx={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 800, 
                  color: isActive ? '#263238' : '#b0bec5',
                  textTransform: 'capitalize' 
                }}>
                  {t(viewTab)}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {selectedView === 'report' ? (
        <TaskReport />
      ) : selectedView === 'calendar' ? (
        <Box className="w-full px-1 py-3 overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-1/2">
              <TaskCalender
                events={events}
                language={language}
                handleDateClick={(arg) => setSelectedDate(dayjs(arg.dateStr))}
                handleEventClick={handleEventClick}
                initialDate={selectedDate.format('YYYY-MM-DD')}
              />
            </div>
            <div className="w-full lg:w-1/2 space-y-4">
              <DayTaskList
                eventDate={formatDayjs(selectedDate, 'ddd, MMM DD')}
                eventList={allEventsForSelectedDate()}
                eventClick={(eventInfo) => handleEventClick({ event: eventInfo })}
              />
              <UpcomingTaskList />
            </div>
          </div>
        </Box>
      ) : (
        <BaseFeaturePageLayout showFooter={true}>
          <Box className="px-0 py-0 w-full min-h-full flex-grow">
            <Box
              ref={calendarContainerRef}
              sx={{
                width: '100%',
                minHeight: '100%',
                bgcolor: 'white',
                p: 0
              }}
            >
              {selectedView === 'list' ? (
                <TasksListView
                  onCreateTask={(taskType) => {
                    // Guardamos el tipo de tarea seleccionado
                    setSelectedTaskType(taskType);
                    // Abrimos el formulario de creación
                    setOpenCreateTask(true);
                  }}
                />
              ) : selectedView === 'table' ? (
                <TaskTableList />
              ) : (
                <TaskCalender
                  events={events}
                  language={language}
                  handleDateClick={(arg) => setSelectedDate(dayjs(arg.dateStr))}
                  handleEventClick={handleEventClick}
                  initialDate={selectedDate.format('YYYY-MM-DD')}
                />
              )}
            </Box>
          </Box>

          {/* SpeedDialComponent ubicado en Task.js (Boton Flotante) - Comentado temporalmente */}
          {/*
          <SpeedDialComponent
            openSpeedDial={openSpeedDial}
            handleCloseSpeedDial={() => setOpenSpeedDial(false)}
            handleOpenSpeedDial={() => setOpenSpeedDial(true)}
            speedDialActions={speedDialActions}
            handleClick={() => {
              // Por defecto, si no se especifica un tipo, abrir con tipo genérico
              setOpenCreateTask(true);
            }}
            handleActionClick={(action) => {
              // Capturar el tipo de tarea seleccionada desde la acción
              setSelectedTaskType(action.type);
            }}
           />
          */}
        </BaseFeaturePageLayout>
      )}

      {/* Create Task Drawer */}
      <CreateTask
        openCreateTask={openCreateTask}
        selectedTaskType={selectedTaskType}
        handleCloseCreateTask={() => setOpenCreateTask(false)}
      />

      {/* Event Details Drawer */}
      <TaskDetailsDrawer
        selectedEvent={selectedEvent}
        drawerOpen={drawerOpen}
        handleCloseDrawer={() => setDrawerOpen(false)}
      />
    </Box>
  );
}

Component.displayName = 'Tasks';
