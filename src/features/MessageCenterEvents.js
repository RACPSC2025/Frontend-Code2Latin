import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import FullCalendar from '@fullcalendar/react';
import {
  Apps,
  ArrowDownward,
  AssignmentReturned,
  CalendarMonth,
  Close,
  Dashboard,
  DownloadDone,
  Insights,
  ListAlt,
  Loop,
  TableChart,
  Tune
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Toolbar,
  Typography
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BaseFeaturePageLayout from '../components/BaseFeaturePageLayout';
import SpeedDialComponent from '../components/SpeedDialComponent';
import { STATUS } from '../config/constants';
import axiosInstance from '../lib/axios';
import { useLanguage } from '../providers/languageProvider';
import { fetchEventsList } from '../stores/events/fetchEventsListSlice';
import { selectAppliedFilterModel } from '../stores/filterSlice';
import { fetchTaskListLevel } from '../stores/tasks/fetchtaskListLevelSlice';
import {
  areDatesSame,
  formatDayjs,
  getCurrentDate,
  getFirstDayOfAdjacentMonth
} from '../utils/dateTimeFunctions';
import MessageCenterEventLists from './MessageCenterEventLists';
import { MessageCenterEventsCreateTask } from './MessageCenterEventsCreateTask';
import MessageCenterEventDetails from './MessageCenterEventsDetails';
import MessageCenterEventsList from './MessageCenterEventsList';
import MessageCetnerEventsReport from './MessageCenterEventsReport';
import MessageCenterEventsTable from './MessageCenterEventsTable';
import MessageCenterEventTaskTabs from './MessageCenterEventTaskTabs';

const useAppliedFilterModel = (module) => {
  return useSelector((state) => selectAppliedFilterModel(state, module));
};

export default function Component() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { language } = useLanguage();
  const calendarRef = useRef(null);
  const calendarContainerRef = useRef(null);
  const isBothCalendarInSync = useRef(false);
  const dateFormat = 'YYYY-MM-DD';

  const [selectedEvent, setSeletedEvent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [events, setEvents] = useState([]);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('calendar'); // ['calendar', 'list', 'table', 'insights', 'settings'
  const [calendarioIconColor, setCalendarioIconColor] = useState('warning');
  const [listaIconColor, setListaIconColor] = useState('action');
  const [tablaIconColor, setTablaIconColor] = useState('action');
  const [reporteIconColor, setReporteIconColor] = useState('action');
  const [country, setCountry] = useState('Colombia');
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
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { in_progress, completed, delayed, pending } = STATUS;

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const filterData = useAppliedFilterModel('events'); // Tareas vencidad agregar

  const handleOpenSpeedDial = () => setOpenSpeedDial(true);
  const handleCloseSpeedDial = () => setOpenSpeedDial(false);

  const mutateEventList = (event) => {
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

  const handleFetchEventList = () => {
    dispatch(fetchEventsList()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const eventData = data?.payload?.data ?? [];
        setEvents(mutateEventList(eventData));
      }
    });
  };

  const prepareAPIParams = () => {
    const formData = new FormData();

    if (Object.keys(filterData).length > 0) {
      Object.keys(filterData).forEach((filterKey) => {
        formData.append(filterKey, filterData[filterKey]);
      });
    }

    formData.append('filter_start_date', '2021-01-01');
    formData.append('filter_end_date', '2026-12-31');

    if (level1Selected) {
      formData.append('filter_region', level1Selected);
    }
    if (level2Selected) {
      formData.append('filter_country', level2Selected);
    }
    if (level3Selected) {
      formData.append('filter_business', level3Selected);
    }
    if (level4Selected) {
      formData.append('filter_plant', level4Selected);
    }

    return formData;
  };

  const handleFetchTaskListLevel = (level, formData) => {
    const data = { level, formData };
    dispatch(fetchTaskListLevel(data)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const level1Options = data?.payload?.data.map((item) => ({
          value: item.value,
          label: item.label
        }));
        setLevel1Options(level1Options);
      }
    });
  };

  // Loader for the events
  useEffect(() => {
    if (events.length) {
      // setLoading(false);
    }
  }, [events]);

  // Sync the calendar with the selected date
  useEffect(() => {
    if (language && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.setOption('locale', language);
    }
  }, [language, calendarRef]);

  const allEventsForSelectedDate = useMemo(() => {
    const formattedDate = formatDayjs(selectedDate, dateFormat);
    return events.filter((event) => areDatesSame(event.date, formattedDate));
  }, [selectedDate, events]);

  const handleFullCalendarChange = (direction = 'prev') => {
    const calendarApi = calendarRef.current.getApi();
    if (direction === 'prev') {
      calendarApi.prev();
    } else {
      calendarApi.next();
    }
    return calendarApi;
  };

  const changeFullCalendarAndSelectDate = (direction = 'prev') => {
    const calendarApi = handleFullCalendarChange(direction);

    const newDate = getFirstDayOfAdjacentMonth(selectedDate, direction);
    const newDateInUTC = formatDayjs(newDate, '', true);

    setSelectedDate(newDate);
    calendarApi.select(newDateInUTC);

    isBothCalendarInSync.current = true;
  };

  const handleFullCalendarDateClick = (arg) => {
    setSelectedDate(dayjs(arg.dateStr));
  };

  const handleEventClick = ({ event }) => {
    const eventDetails = events.find((e) => e.id === event.id);
    setSeletedEvent(eventDetails);
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const fullCalendarCustomButtons = {
    prevCustomButton: {
      text: t('Previous'),
      click: () => changeFullCalendarAndSelectDate('prev')
    },
    nextCustomButton: {
      text: t('Next'),
      click: () => changeFullCalendarAndSelectDate('next')
    },
    todayCustomButton: {
      text: t('Today'),
      click: () => {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.today();
      }
    }
  };
  const fullCalendarHeaderToolbar = {
    start: 'title', // will normally be on the left. if RTL, will be on the right
    center: '',
    end: 'todayCustomButton prevCustomButton,nextCustomButton' // will normally be on the right. if RTL, will be on the left
  };

  function handleCreateTaskButton() {
    setOpenCreateTask(true);
  }

  function handleCloseCreateTask() {
    setOpenCreateTask(false);
  }

  function handleLimpiarFiltrosGeo() {
    setLevel1Selected('');
    setLevel2Selected('');
    setLevel3Selected('');
    setLevel4Selected('');
  }

  const speedDialActions = [
    { icon: <DownloadDone />, name: 'Añadir Tarea Permanente' },
    { icon: <Loop />, name: 'Añadir Tarea Cíclica' },
    { icon: <AssignmentReturned />, name: 'Añadir Tarea Única' }
  ];

  useEffect(() => {
    // fetchLevel1Options();
    handleFetchTaskListLevel(1);
    setEvents([]);
    handleFetchEventList();
  }, [filterData]);

  useEffect(() => {
    if (level1Selected) {
      // filterData.append('filter_region', level1Selected);
      // fetchLevel2Options(level1Selected);
      const level2FormData = new FormData();
      level2FormData.append('id_level1', level1Selected);
      handleFetchTaskListLevel(2, level2FormData);
      handleFetchEventList();
    }
  }, [level1Selected]);

  useEffect(() => {
    if (level2Selected) {
      // fetchLevel3Options(level2Selected);
      const level3FormData = new FormData();
      level3FormData.append('id_level2', level2Selected);
      handleFetchTaskListLevel(3, level3FormData);
      handleFetchEventList();
    }
  }, [level2Selected]);

  useEffect(() => {
    if (level3Selected) {
      // fetchLevel4Options(level3Selected);
      const level4FormData = new FormData();
      level4FormData.append('id_level3', level3Selected);
      handleFetchTaskListLevel(4, level4FormData);
      handleFetchEventList();
    }
  }, [level3Selected]);

  useEffect(() => {
    if (level4Selected) {
      handleFetchEventList();
    }
  }, [level4Selected]);

  return (
    <Box sx={{ m: 0, p: 0 }}>
      <Box
        sx={{
          bgcolor: '#f5f5f5',
          width: '100%',
          pl: '30px'
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            bgcolor: '#f5f5f5',
            width: '100%',
            pl: 0,
            pr: 3,
            pt: 1,
            pb: 0
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="start" gap={4}>
            <FormControl size="small" sx={{ minWidth: 200, marginBottom: -1 }}>
              <InputLabel id="country-select-label">País</InputLabel>
              <Select
                labelId="country-select-label"
                value={country}
                onChange={handleCountryChange}
                label="País"
              >
                <MenuItem value="Todos">
                  <Box display="flex" alignItems="center">
                    Todos
                  </Box>
                </MenuItem>
                <MenuItem value="United States">
                  <Box display="flex" alignItems="center">
                    <ReactCountryFlag countryCode="US" svg style={{ marginRight: 8 }} />
                    United States
                  </Box>
                </MenuItem>
                <MenuItem value="Costa Rica">
                  <Box display="flex" alignItems="center">
                    <ReactCountryFlag countryCode="CR" svg style={{ marginRight: 8 }} />
                    Costa Rica
                  </Box>
                </MenuItem>
                <MenuItem value="Colombia">
                  <Box display="flex" alignItems="center">
                    <ReactCountryFlag countryCode="CO" svg style={{ marginRight: 8 }} />
                    Colombia
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            {/* Other components and JSX */}
            <Tabs value={tabValue} onChange={handleChangeTab} aria-label="basic tabs example">
              <Tab
                label="Ambiental"
                icon={<Apps />}
                iconPosition="start"
                sx={{ textTransform: 'capitalize' }}
              />
              <Tab
                label="Calidad Inocuidad"
                icon={<Apps />}
                iconPosition="start"
                sx={{ textTransform: 'capitalize' }}
              />
              <Tab
                label="Legal"
                icon={<Apps />}
                iconPosition="start"
                sx={{ textTransform: 'capitalize' }}
              />
              <Tab
                label="Comercial"
                icon={<Apps />}
                iconPosition="start"
                sx={{ textTransform: 'capitalize' }}
              />
            </Tabs>
          </Box>

          <Box display="flex" width="full" justifyContent="end" alignItems="end" gap={2}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                window.open('https://dev.sofacto.info/ocensa_amb/dashboard-center/html/', '_blank');
              }}
            >
              <Dashboard color="action" fontSize="medium" />
              <Typography variant="h8">Dashboard</Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedView('calendar');
                setCalendarioIconColor('warning');
                setListaIconColor('action');
                setTablaIconColor('action');
                setReporteIconColor('action');
              }}
            >
              <CalendarMonth color={calendarioIconColor} fontSize="medium" />
              <Typography variant="h8">{t('calendar')}</Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedView('list');
                setCalendarioIconColor('action');
                setListaIconColor('warning');
                setTablaIconColor('action');
                setReporteIconColor('action');
              }}
            >
              <ListAlt color={listaIconColor} fontSize="medium" />
              <Typography variant="h8">{t('list')}</Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedView('table');
                setTablaIconColor('warning');
                setCalendarioIconColor('action');
                setListaIconColor('action');
                setReporteIconColor('action');
              }}
            >
              <TableChart color={tablaIconColor} fontSize="medium" />
              <Typography variant="h8">{t('table')}</Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedView('report');
                setTablaIconColor('action');
                setCalendarioIconColor('action');
                setListaIconColor('action');
                setReporteIconColor('warning');
              }}
            >
              <Insights color={reporteIconColor} fontSize="medium" />
              <Typography variant="h8">{t('reports')}</Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <Tune color="action" fontSize="medium" />
              <Typography variant="h8">{t('adjustments')}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {selectedView === 'report' && <MessageCetnerEventsReport />}
      <BaseFeaturePageLayout showFooter={false}>
        {selectedView !== 'report' && (
          <Box
            sx={{
              pl: 1,
              width: '60%',
              minHeight: '100%',
              flexGrow: 1,
              pt: 1
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                minWidth: 0,
                pl: 1,
                pt: 1,
                height: 'calc(100vh - 142px)',
                overflowY: 'auto'
              }}
            >
              <Box
                ref={calendarContainerRef}
                sx={{
                  width: '98%',
                  minHeight: '100%',
                  bgcolor: 'background.white',
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'grey.300',
                  p: 1
                }}
                // height: 'calc(100vh - 155px)',
              >
                <Box display="flex" justifyContent="space-between" margin="10px" sx={{ pb: 2 }}>
                  <Box display="flex" alignItems="center">
                    <ArrowDownward color="warning" />
                    <Typography color="warning" variant="h6" sx={{ textTransform: 'capitalize' }}>
                      {t('Delayed')}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    {/* //! Hide Create task button  */}
                    {/* <Button variant="contained" color="warning" onClick={handleCreateTaskButton}>
                    + {t('createTask')}
                    </Button> */}
                  </Box>
                </Box>
                {selectedView === 'calendar' && (
                  <FullCalendar
                    ref={calendarRef}
                    headerToolbar={fullCalendarHeaderToolbar}
                    customButtons={fullCalendarCustomButtons}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    fixedWeekCount={false}
                    events={events}
                    dateClick={handleFullCalendarDateClick}
                    eventClick={handleEventClick}
                    initialDate={selectedDate.format('YYYY-MM-DD')}
                    selectable={true}
                    dayMaxEventRows={true}
                    views={{
                      dayGridMonth: {
                        dayMaxEventRows: 3
                      }
                    }}
                    moreLinkClassNames="message-center-fc-more-link"
                  />
                )}
                {selectedView === 'list' && <MessageCenterEventsList />}
                {selectedView === 'table' && <MessageCenterEventsTable />}
              </Box>
            </Box>
          </Box>
        )}
        <Box
          sx={{
            width: {
              lg: '50%'
            },
            px: 1,
            pt: 1,
            m: 1,
            display: `${selectedView === 'calendar' ? '' : 'none'}`,
            overflow: 'hidden'
          }}
        >
          <MessageCenterEventLists
            eventDate={formatDayjs(selectedDate, 'ddd, MMM DD')}
            eventList={allEventsForSelectedDate}
            eventClick={(eventInfo) => handleEventClick({ event: eventInfo })}
          />
          <Box
            sx={{
              width: '100%',
              height: '50%',
              bgcolor: 'background.paper',
              borderRadius: 1,
              border: 1,
              borderColor: 'grey.300',
              overflowY: 'auto',
              mb: 1
            }}
          >
            <MessageCenterEventTaskTabs />
          </Box>
        </Box>

        <SpeedDialComponent
          openSpeedDial={openSpeedDial}
          handleCloseSpeedDial={handleCloseSpeedDial}
          handleOpenSpeedDial={handleOpenSpeedDial}
          speedDialActions={speedDialActions}
          handleClick={handleCreateTaskButton}
        />
      </BaseFeaturePageLayout>

      {/* /* Create Task Drawer */}
      <Drawer
        anchor="right"
        open={openCreateTask}
        onClose={handleCloseCreateTask}
        PaperProps={{
          sx: {
            maxWidth: '70vw', // Maximum width on all screens
            width: {
              sm: '70vw', // On 1280px width, make it 35vw
              md: '60vw', // On 1366px width, make it 38vw
              lg: '50vw' // On 1920px width and above, make it 40vw
            }
          }
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography color="white" variant="h5" sx={{ flexGrow: 1 }}>
              {t('createTask')}
            </Typography>
            <IconButton edge="end" onClick={handleCloseCreateTask} aria-label="close">
              <Close sx={{ color: 'white' }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ px: 2, pb: 2 }}>
          <MessageCenterEventsCreateTask />
        </Box>
      </Drawer>

      {/* Event Details Drawer */}

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
        PaperProps={{
          sx: {
            maxWidth: '400px', // Maximum width on all screens
            width: {
              sm: '50vw', // On 1280px width, make it 35vw
              md: '30vw', // On 1366px width, make it 38vw
              lg: '400px' // On 1920px width and above, make it 40vw
            }
          }
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography color="white" variant="h5" sx={{ flexGrow: 1 }}>
              {t('EventDetails')}
            </Typography>
            <IconButton edge="end" onClick={closeDrawer} aria-label="close">
              <Close sx={{ color: 'white' }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <MessageCenterEventDetails selectedEvent={selectedEvent} />
      </Drawer>
    </Box>
  );
}

Component.displayName = 'MessageCenterEvents';
