import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { fetchTaskListLevel } from '../../stores/tasks/fetchtaskListLevelSlice';
import { useCascadingFilters } from '../../hooks/useCascadingFilters';
import FilterBar from '../../components/FilterBar';
import { setFilter, removeFilter, selectAppliedFilterModel } from '../../stores/filterSlice';

const OrganizationFilter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Get current filters from Redux
  const currentFilters = useSelector((state) => selectAppliedFilterModel(state, 'actions'));
  const [localFilterState, setLocalFilterState] = useState({});

  const getFormDataFromSelectedValues = (selectedValues) => {
    const formData = new FormData();
    Object.entries(selectedValues).forEach(([key, value]) => {
      formData.append(`id_${key}`, value);
    });
    return formData;
  };

  // Reusable function to fetch level data
  const fetchLevelData = (level, formData = null) => {
    return new Promise((resolve, reject) => {
      const payload = formData ? { level, formData } : { level };

      dispatch(fetchTaskListLevel(payload))
        .then((data) => {
          if (data?.payload?.messages === 'Success') {
            const levelOptions = data?.payload?.data.map((item) => ({
              value: item.value,
              label: item.label
            }));
            resolve(levelOptions);
          } else {
            reject(new Error(`Failed to fetch level ${level} data`));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  // Define your filter structure with fetch functions
  const filterDefinitions = [
    {
      id: 'level1',
      label: t('Negocio'),
      // Fetch initial options
      fetchOptions: async () => {
        return fetchLevelData(1);
      }
    },
    {
      id: 'level2',
      label: 'Compañía',
      // Fetch dependent options
      fetchOptions: async (parentValues) => {
        const formData = getFormDataFromSelectedValues(parentValues);
        return fetchLevelData(2, formData);
      }
    },
    {
      id: 'level3',
      label: 'Región',
      fetchOptions: async (parentValues) => {
        const formData = getFormDataFromSelectedValues(parentValues);
        return fetchLevelData(3, formData);
      }
    },
    {
      id: 'level4',
      label: 'Ubicación',
      fetchOptions: async (parentValues) => {
        const formData = getFormDataFromSelectedValues(parentValues);
        return fetchLevelData(4, formData);
      }
    }
  ];

  // Extract initial values from Redux store
  const getInitialValues = () => {
    const initialValues = {};
    filterDefinitions.forEach((filter) => {
      const reduxKey = `id_${filter.id}`;
      if (currentFilters[reduxKey]) {
        initialValues[filter.id] = currentFilters[reduxKey];
      }
    });
    return initialValues;
  };

  // Track changes and sync with Redux
  const handleFilterChange = (values) => {
    const previousValues = { ...localFilterState };
    setLocalFilterState(values);

    // Add or update filters in Redux
    Object.entries(values).forEach(([key, value]) => {
      if (value && value !== previousValues[key]) {
        dispatch(
          setFilter({
            module: 'actions',
            updatedFilter: { [`id_${key}`]: value }
          })
        );
      }
    });

    // Remove filters that were cleared
    Object.entries(previousValues).forEach(([key, prevValue]) => {
      if (prevValue && (!values[key] || values[key] === '')) {
        dispatch(
          removeFilter({
            module: 'actions',
            fieldID: `id_${key}`
          })
        );
      }
    });
  };

  // Use the custom hook with our handlers
  const {
    filters,
    handleFilterChange: internalHandleFilterChange,
    resetFilters
  } = useCascadingFilters({
    filterDefinitions,
    initialValues: getInitialValues(),
    onFilterChange: handleFilterChange
  });

  // Handle filter reset by clearing all organization filters
  const handleResetFilters = () => {
    // Reset local filters UI
    resetFilters();

    // Remove all organization filters from Redux
    Object.keys(localFilterState).forEach((key) => {
      if (localFilterState[key]) {
        dispatch(
          removeFilter({
            module: 'actions',
            fieldID: `id_${key}`
          })
        );
      }
    });

    // Clear local state
    setLocalFilterState({});
  };

  return (
    <FilterBar
      filters={filters}
      onFilterChange={internalHandleFilterChange}
      containerProps={{
        p: 1,
        bgcolor: 'background.paper'
      }}
    >
      <Button variant="outlined" color="primary" onClick={handleResetFilters}>
        {t('clear_filters')}
      </Button>
    </FilterBar>
  );
};

export default OrganizationFilter;
