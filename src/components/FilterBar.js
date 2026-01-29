import React from 'react';
import { Box } from '@mui/material';
import InputSelectField from './Input/InputSelectField';

/**
 * Reusable filter bar component for displaying cascading filters
 * @param {Object} props Component props
 * @param {Array} props.filters Array of filter objects
 * @param {Function} props.onFilterChange Function to call when a filter changes
 * @param {Object} props.containerProps Additional props for the container Box
 * @returns {JSX.Element} Filter bar component
 */
const FilterBar = ({ children, filters, onFilterChange, containerProps = {} }) => {
  return (
    <Box
      display="flex"
      justifyContent="start"
      gap={1}
      alignItems="center"
      flexGrow={1}
      {...containerProps}
    >
      {filters.map((filter, index) => (
        <InputSelectField
          sx={{ maxWidth: 150 }}
          size="small"
          key={index}
          field={{
            id: filter.id,
            label: filter.label,
            options: filter.options || [],
            isDisabled: filter.isDisabled || filter.isLoading
          }}
          value={filter.value}
          onChange={(id, value) => onFilterChange(id, value)}
        />
      ))}
      {children}
    </Box>
  );
};

export default FilterBar;
