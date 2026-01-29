import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, IconButton, SvgIcon, Tooltip, Typography } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as AmatiaIcon } from '../assets/icons/amatia-v-logo.svg';
import { headerHeight, navbarCollapsedWidth, navbarWidth, STATUS } from '../config/constants';
import { useModuleData } from '../hooks/useModuleData';
import BaseFilter from './BaseFilter';
import TaskCyclesDoughnutChart from './TasksCyclesDoughnutChart';
import RequirementsArticlesDoughnutChart from './RequirementsArticlesDoughnutChart';
import StatusDoughnutChart from './StatusDoughnutChart';
import TheLayoutNavbarActionItem from './TheLayoutNavbarActionItem';

import { Apps, CalendarToday, CheckCircleOutline, MailOutline, Search } from '@mui/icons-material';
//import AppsIcon from '@mui/icons-material/Apps';
//import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
//import { CalendarIcon } from '@mui/x-date-pickers';
// import { ReactComponent as EnvironmentIcon } from '../assets/icons/amatia-smi-environment.svg';
// import { ReactComponent as PeopleIcon } from '../assets/icons/amatia-smi-people.svg';
// import { ReactComponent as SystemIcon } from '../assets/icons/amatia-smi-ssytem.svg';

import { fetchTaskListStatus } from '../stores/tasks/fetchTaskListStatusSlice';
import { fetchLegalListStatus } from '../stores/legal/fetchLegalListStatusSlice';

import {
  fetchAutocompleteOptions,
  removeAllFilters,
  removeFilter,
  selectFilterItemValue,
  selectListOptions,
  setFilter
} from '../stores/filterSlice';
import { t } from 'i18next';

// Custom hook to get list options
const useListOptions = (module, fieldName) =>
  useSelector((state) => selectListOptions(state, module, fieldName));

const useListOptionsGlobal = (fieldName) =>
  useSelector((state) => state.globalData?.[fieldName] ?? []);

const useFilterItemValue = (module, fieldName) =>
  useSelector((state) => selectFilterItemValue(state, module, fieldName));

// Module configuration for display purposes
const MODULE_CONFIG = [
  {
    id: 'legals',
    label: 'Legals',
    icon: Apps,
    activeModuleKey: 'legalMatrix',
    chartComponent: RequirementsArticlesDoughnutChart,
    getStatusData: (processedData) => [
      { key: STATUS.completed, value: processedData.completedTasks },
      { key: STATUS.delayed, value: processedData.delayedTasks },
      { key: STATUS.pending, value: processedData.openTasks },
      { key: STATUS.in_progress, value: processedData.inProgressTasks }
    ]
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: CalendarToday,
    activeModuleKey: 'events',
    chartComponent: TaskCyclesDoughnutChart,
    getStatusData: (processedData) => [
      { key: STATUS.completed, value: processedData.completedTasks },
      { key: STATUS.delayed, value: processedData.delayedTasks },
      { key: STATUS.pending, value: processedData.openTasks },
      { key: STATUS.in_progress, value: processedData.inProgressTasks }
    ]
  },
  {
    id: 'actions',
    label: t('Actions'),
    icon: CheckCircleOutline,
    activeModuleKey: 'actions',
    chartComponent: StatusDoughnutChart,
    getStatusData: (processedData) => [
      { key: STATUS.completed, value: processedData.completedActions },
      { key: STATUS.delayed, value: processedData.delayedActions },
      { key: STATUS.pending, value: processedData.pendingActions },
      { key: STATUS.in_progress, value: processedData.inProgressActions }
    ]
  }
];

function TheLayoutNavbar({ expanded = false, onToggle }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { moduleData, fetchAllModulesData, getModuleData, isModuleLoaded } = useModuleData();

  const [listLegalStatus, setListLegalStatus] = useState({});
  const [loadingLegalStatus, setLoadingLegalStatus] = useState(true);

  const [listTaskStatus, setListTaskStatus] = useState({});
  const [loadingTaskStatus, setLoadingTaskStatus] = useState(true);

  const [listActionStatus, setListActionStatus] = useState({});
  const [loadingActionStatus, setLoadingActionStatus] = useState(true);

  // Fetch data for all modules on component mount
  useEffect(() => {
    fetchAllModulesData();
  }, []);

  // Save the value in redux store
  const handleSetFilterItemValue = (module, id, value) => {
    if (!module) {
      console.error('El módulo es undefined o inválido');
      console.log('El módulo es undefined o inválido');
      return;
    }
    const payload = {
      module,
      updatedFilter: { [id]: value } // Debe estar dentro de `updatedFilter`
    };
    dispatch(setFilter(payload));
  };

  // Fetch task list status
  const handleFetchTaskListStatus = () => {
    dispatch(fetchTaskListStatus()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const eventData = data?.payload?.data ?? [];
        setLoadingTaskStatus(false);
        handleSetFilterItemValue('task', 'task_list_status', eventData);
        console.log('fetchTaskListStatus: ', eventData);
      }
    });
  };

  useEffect(() => {
    if (loadingTaskStatus) {
      handleFetchTaskListStatus();
    }
  }, [loadingTaskStatus]);

  // Fetch legal list status
  const handleFetchLegalListStatus = () => {
    dispatch(fetchLegalListStatus()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const eventData = data?.payload?.data ?? [];
        setLoadingLegalStatus(false);
        handleSetFilterItemValue('legalMatrix', 'legal_list_status', eventData);
        console.log('fetchLegalListStatus: ', eventData);
      }
    });
  };

  useEffect(() => {
    if (loadingLegalStatus) {
      handleFetchLegalListStatus();
    }
  }, [loadingLegalStatus]);

  // Process modules for display - memoized to prevent recalculation on every render
  const modules = useMemo(() => {
    return MODULE_CONFIG.map((module) => {
      const moduleProcessedData = getModuleData(module.id) || {};
      const isLoaded = isModuleLoaded(module.id);

      return {
        id: module.id,
        icon: module.icon,
        label: module.label,
        statusData: isLoaded ? module.getStatusData(moduleProcessedData) : [],
        isLoaded
      };
    }).filter((module) => module.isLoaded); // Only show modules that have loaded data
  }, [moduleData]);

  const activeModule = useSelector((state) => state.globalData.activeModule);
  const { data: actionCountData = {} } = useSelector(
    (state) => state?.actionData?.actionCount || {}
  );
  const actionCount = actionCountData?.data || {};

  // Default datasets for charts when data isn't available
  const cyclesDataset = [
    { key: STATUS.completed, value: 0 },
    { key: STATUS.delayed, value: 0 },
    { key: STATUS.pending, value: 0 },
    { key: STATUS.in_progress, value: 0 }
  ];

  // Get active module configuration - also memorized
  const activeModuleConfig = useMemo(
    () => MODULE_CONFIG.find((module) => module.activeModuleKey === activeModule),
    [activeModule, moduleData]
  );

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: `${!expanded ? navbarCollapsedWidth : navbarWidth}px`,
        overflow: 'hidden',
        height: '100vh',
        display: 'flex'
      }}
    >
      <Box
        sx={{
          bgcolor: 'black.main',
          width: `${navbarCollapsedWidth}px`,
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <Box
          sx={{
            height: `${headerHeight}px`,
            borderBottom: 'solid 1px #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0.5,
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <SvgIcon
            component={AmatiaIcon}
            inheritViewBox
            htmlColor="#fff"
            sx={{ width: '100%', height: '100%' }}
          />
        </Box>

        <Box
          sx={{
            height: `calc(100% - ${headerHeight}px)`,
            pb: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography variant="overline" color="icon.main" display="block" gutterBottom>
            DEV
          </Typography>

          <Tooltip title={expanded ? t('Collapse') : t('Expand')} placement="right">
            <IconButton
              onClick={onToggle}
              sx={{
                color: 'icon.main',
                p: 0.5,
                mb: 1
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          {modules.map((module, index) => (
            <TheLayoutNavbarActionItem
              key={module.id}
              icon={module.icon}
              label={t(module.label)}
              isActive={index === 0}
              sx={{ px: 0.5, mt: index > 0 ? 1 : 0 }}
              dataSet={module.statusData}
            />
          ))}

          <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Tooltip title={t('Settings')} placement="right">
              <IconButton
                sx={{
                  color: 'icon.main',
                  cursor: 'default'
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('Help')} placement="right">
              <IconButton sx={{ color: 'icon.main', mt: 1 }}>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {expanded && activeModule && (
        <Box
          className="mc-layout-expanded-navbar"
          sx={{
            width: `${navbarWidth - navbarCollapsedWidth}px`,
            height: '100%',
            bgcolor: 'blue.main',
            pt: 6,
            px: 2,
            overflow: 'auto'
          }}
        >
          {activeModule && (
            <Box sx={{ pt: 0, pb: 6 }}>
              {(() => {
                if (!activeModuleConfig) return null;

                const ChartComponent = activeModuleConfig.chartComponent;
                const moduleId = activeModuleConfig.id;
                let chartData = moduleData[moduleId]?.data;

                if (!chartData || !ChartComponent) return null;

                let chartCompoentProps = {};

                if (moduleId === 'actions') {
                  // chartData = activeModuleConfig.transformData(actionCount);
                  const statusData = activeModuleConfig.getStatusData(chartData);
                  chartCompoentProps = {
                    dataSet: statusData
                  };
                } else {
                  chartCompoentProps = {
                    dataSetTasks: chartData,
                    dataSetCycles: cyclesDataset
                  };
                }

                return <ChartComponent {...chartCompoentProps} />;
              })()}
            </Box>
          )}
          <BaseFilter component={activeModule} />
        </Box>
      )}
    </Box>
  );
}

export default TheLayoutNavbar;
