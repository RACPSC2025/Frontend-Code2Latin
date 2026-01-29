import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActionCount } from '../stores/actions/fetchActionSlice';
import { fetchTaskCounts } from '../stores/tasks/fetchTaskCountsSlice';
import { fetchLegalCounts } from '../stores/legal/fetchLegalCountsSlice';
import { setModuleData, setModuleLoading, setModuleError } from '../stores/moduleStatisticsSlice';
import { showErrorMsg } from '../utils/others';

// Module configuration - centralized definition of all modules
const MODULE_CONFIG = [
  {
    id: 'actions',
    label: 'Actions',
    reduxFetchAction: fetchActionCount,
    transformData: (data) => ({
      completedActions: parseInt(data.closed),
      inProgressActions: parseInt(data.open),
      pendingActions: parseInt(data.cancelled),
      delayedActions: parseInt(data.delayed)
    })
  },
  {
    id: 'tasks',
    label: 'Tasks',
    reduxFetchAction: fetchTaskCounts,
    transformData: (data) => ({
      numberOfTasks: data.total_tasks,
      numberOfCycles: data.total_logtasks,
      completedTasks: parseInt(data.tasks['1']),
      inProgressTasks: parseInt(data.tasks['2']),
      openTasks: parseInt(data.tasks['3']),
      delayedTasks: parseInt(data.tasks['4']),
      completedCycles: parseInt(data.logtasks['1']),
      inProgressCycles: parseInt(data.logtasks['2']),
      openCycles: parseInt(data.logtasks['3']),
      delayedCycles: parseInt(data.logtasks['4'])
    })
  },
  {
    id: 'legals',
    label: 'Legals',
    reduxFetchAction: fetchLegalCounts,
    transformData: (data) => ({
      numberOfTasks: parseInt(data.total_articles),
      completedTasks: parseInt(data.completed_articles),
      inProgressTasks: parseInt(data.inprogress_articles),
      openTasks: parseInt(data.open_articles),
      delayedTasks: parseInt(data.delayed_articles),
      numberOfCycles: parseInt(data.total_requirements),
      completedCycles: parseInt(data.completed_requirements),
      inProgressCycles: parseInt(data.inprogress_requirements),
      openCycles: parseInt(data.open_requirements),
      delayedCycles: parseInt(data.delayed_requirements)
    })
  }
];

export const useModuleData = () => {
  const dispatch = useDispatch();
  const moduleData = useSelector((state) => state.moduleStatistics);

  // Debug logging
  // useEffect(() => {
  //   console.log('Module Statistics State Updated:', moduleData);
  // }, [moduleData]);

  // Function to fetch data for a specific module
  const fetchModuleData = (moduleConfig) => {
    // Set loading state
    dispatch(setModuleLoading({ moduleId: moduleConfig.id, loading: true }));

    dispatch(moduleConfig.reduxFetchAction())
      .then((response) => {
        if (response?.payload?.messages === 'Success') {
          const transformedData = moduleConfig.transformData(response?.payload?.data);
          dispatch(
            setModuleData({
              moduleId: moduleConfig.id,
              data: transformedData,
              loading: false
            })
          );
          // console.log(`${moduleConfig.id} data:`, transformedData);
        } else {
          dispatch(
            setModuleError({
              moduleId: moduleConfig.id,
              error: response?.payload?.message || 'Failed to fetch data'
            })
          );
          showErrorMsg(response?.payload?.message);
        }
      })
      .catch((error) => {
        dispatch(
          setModuleError({
            moduleId: moduleConfig.id,
            error: error.message || 'Network error'
          })
        );
      });
  };

  // Function to fetch data for a specific module by ID
  const fetchModuleDataById = (moduleId) => {
    const moduleConfig = MODULE_CONFIG.find((config) => config.id === moduleId);
    if (moduleConfig) {
      fetchModuleData(moduleConfig);
    } else {
      console.error(`Module config not found for ID: ${moduleId}`);
    }
  };

  // Function to fetch all modules data
  const fetchAllModulesData = () => {
    MODULE_CONFIG.forEach(fetchModuleData);
  };

  return {
    moduleData,
    fetchModuleData,
    fetchModuleDataById,
    fetchAllModulesData,
    // Helper functions for easier data access
    getModuleData: (moduleId) => moduleData[moduleId]?.data || null,
    getModuleLoading: (moduleId) => moduleData[moduleId]?.loading || false,
    getModuleError: (moduleId) => moduleData[moduleId]?.error || null,
    isModuleLoaded: (moduleId) =>
      moduleData[moduleId]?.data !== null && !moduleData[moduleId]?.loading
  };
};
