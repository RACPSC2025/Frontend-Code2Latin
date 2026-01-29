import { Select, MenuItem, InputLabel, Chip, Box } from '@mui/material';
import BaseFormControl from '../BaseFormControl';
import { useEffect } from 'react';

const InputSelectField = ({ field, value, onChange, error, ...rest }) => {
  const labelID = `simple-select-${field.id}-label`;
  const isDisabled = !field.options || field.options.length === 0;
  const isMultiple = field.multiple || false;

  const handleChange = (event) => {
    const newValue = event.target.value;
    onChange(field.id, newValue);
  };

  const renderValue = (selected) => {
    if (!isMultiple) return selected;
    
    if (!selected || selected.length === 0) return '';
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selected.map((val) => {
          const option = field.options.find(opt => opt.value === val);
          return (
            <Chip key={val} label={option?.label || val} size="small" />
          );
        })}
      </Box>
    );
  };

  const selectValue = isMultiple ? (Array.isArray(value) ? value : []) : (value?.toString() ?? '');

  /*
  useEffect(() => {
    if (field) {
        console.log('Rendering category field - value:', value, 'options:', field.options);
    }
  }, [field]);
  */

  return (
    <BaseFormControl field={field} value={value} error={error} {...rest}>
      <InputLabel id={labelID}>{field.label}</InputLabel>
      <Select
        labelId={labelID}
        id={field.id}
        label={field.label}
        //value={value}
        multiple={isMultiple}
        value={selectValue}
        onChange={handleChange}
        disabled={isDisabled}
        renderValue={isMultiple ? renderValue : undefined}
        MenuProps={isMultiple ? {
          PaperProps: {
            style: {
              maxHeight: 224,
              width: 250,
            },
          },
        } : undefined}
      >
        {field.options &&
          field.options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </Select>
    </BaseFormControl>
  );
};

export default InputSelectField;
