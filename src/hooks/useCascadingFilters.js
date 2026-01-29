import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing cascading filters with loading states
 * @param {Object} config Configuration object for filters
 * @param {Array} config.filterDefinitions Array of filter definitions with id, label, and fetch function
 * @param {Function} config.onFilterChange Optional callback when filters change
 * @param {Object} config.initialValues Optional initial values for filters
 * @returns {Object} filter state and helper methods
 */
export const useCascadingFilters = ({ filterDefinitions, onFilterChange, initialValues = {} }) => {
  // Initialize state for each filter level
  const [filters, setFilters] = useState(
    filterDefinitions.map((filter) => ({
      id: filter.id,
      label: filter.label,
      value: '', // Start with empty values and set them after loading options
      options: [],
      isLoading: false,
      isDisabled: filter.id !== filterDefinitions[0].id // Only enable first filter initially
    }))
  );

  // Helper to update a specific filter
  const updateFilter = (filterId, updates) => {
    setFilters((prevFilters) =>
      prevFilters.map((filter) => (filter.id === filterId ? { ...filter, ...updates } : filter))
    );
  };

  // Get current values as a memoized function to prevent unnecessary re-renders
  const getSelectedValues = useCallback(() => {
    const values = {};
    filters.forEach((filter) => {
      values[filter.id] = filter.value;
    });
    return values;
  }, [filters]);

  // Handle selection change for a specific filter
  const handleFilterChange = async (filterId, newValue) => {
    const filterIndex = filters.findIndex((f) => f.id === filterId);

    // Update the current filter value
    updateFilter(filterId, { value: newValue });

    // Reset all dependent filters (filters that come after this one)
    if (filterIndex >= 0) {
      for (let i = filterIndex + 1; i < filters.length; i++) {
        updateFilter(filters[i].id, {
          value: '',
          options: [],
          isDisabled: true
        });
      }
    }

    // If a filter is reset or changed, load its dependent filter's options
    if (filterIndex < filters.length - 1) {
      // Create current values including the new value that was just set
      const currentValues = {};
      filters.forEach((f) => {
        currentValues[f.id] = f.id === filterId ? newValue : f.value;
      });

      // Use the next filter id and current values (including the new one)
      const nextFilterId = filters[filterIndex + 1].id;
      await loadFilterOptions(nextFilterId, currentValues);
    }

    // Call the external change handler if provided
    if (onFilterChange) {
      // Create a new values object with the updated value
      const currentValues = getSelectedValues();
      currentValues[filterId] = newValue;
      onFilterChange(currentValues);
    }
  };

  // Load options for a filter based on parent values
  const loadFilterOptions = async (filterId, currentValues) => {
    const filterIndex = filters.findIndex((f) => f.id === filterId);
    if (filterIndex < 0) return;

    // Get parent values to pass to the fetch function
    const parentValues = {};
    for (let i = 0; i < filterIndex; i++) {
      // Use values from the current state or from the provided currentValues
      const id = filters[i].id;
      parentValues[id] = currentValues ? currentValues[id] : filters[i].value;
    }

    // Set loading state
    updateFilter(filterId, { isLoading: true, isDisabled: true });

    try {
      // Call the fetch function defined in filterDefinitions
      const filterDef = filterDefinitions.find((f) => f.id === filterId);
      const isAvailableFetchOptions = filterDef && filterDef.fetchOptions;

      // For first level filter, always load options
      // For dependent filters, check if parent has a value
      const parentHasValue =
        filterIndex === 0 || Object.values(parentValues).some((val) => val !== '');

      if (isAvailableFetchOptions && parentHasValue) {
        const options = await filterDef.fetchOptions(parentValues);

        updateFilter(filterId, {
          options,
          isLoading: false,
          isDisabled: options.length === 0 // Disable if no options
        });

        return options;
      } else {
        throw new Error('No fetchOptions found for filter');
      }
    } catch (error) {
      console.error(`Error loading options for ${filterId}:`, error);
      updateFilter(filterId, {
        options: [],
        isLoading: false,
        isDisabled: true
      });
    }

    return [];
  };

  // Load initial options for the first filter
  useEffect(() => {
    if (filterDefinitions.length > 0 && filterDefinitions[0].fetchOptions) {
      loadFilterOptions(filterDefinitions[0].id).then(() => {
        // Initialize with initial values if provided
        if (Object.keys(initialValues).length > 0) {
          setSelectedValues(initialValues);
        }
      });
    }
  }, []);

  // Set filters with pre-selected values (useful for restoring state)
  const setSelectedValues = useCallback(
    (values = {}) => {
      // Update values for each filter that has a value specified
      Object.entries(values).forEach(async ([id, value]) => {
        if (value) {
          const filterIndex = filters.findIndex((f) => f.id === id);
          if (filterIndex >= 0) {
            await handleFilterChange(id, value);
          }
        }
      });
    },
    [filters]
  );

  return {
    filters,
    handleFilterChange,
    getSelectedValues,
    setSelectedValues,
    resetFilters: () => {
      setFilters(
        filterDefinitions.map((filter, index) => ({
          id: filter.id,
          label: filter.label,
          value: '',
          options: index === 0 ? filters[0].options : [],
          isLoading: false,
          isDisabled: index !== 0
        }))
      );
      // Notify parent that all filters were reset
      if (onFilterChange) {
        const emptyValues = {};
        filterDefinitions.forEach((filter) => {
          emptyValues[filter.id] = '';
        });
        onFilterChange(emptyValues);
      }
    }
  };
};

export default useCascadingFilters;
