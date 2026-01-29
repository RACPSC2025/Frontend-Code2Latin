import React, { useMemo, useCallback } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import BaseFormControl from '../BaseFormControl';

import { convertToDayJsObject, formatDayjs } from '../../utils/dateTimeFunctions';

import './InputDateField.css';

const InputDateField = ({
  field = {},
  value,
  onChange = () => {},
  error = '',
  datePickerProps = {},
  ...rest
}) => {
  const formatValue = field?.formatValue ?? 'YYYY-MM-DD';

  const dayJsObjValue = useMemo(() => {
    if (value !== null) {
      return convertToDayJsObject(value);
    }
    return value;
  }, [value]);

  const handleChange = useCallback(
    (newValue) => {
      let formattedValue = newValue;

      if (formatValue) {
        if (typeof formatValue === 'function') {
          // If formatValue is a function
          formattedValue = formatValue(newValue);
        } else if (typeof formatValue === 'string') {
          // If formatValue is a string
          formattedValue = newValue ? formatDayjs(newValue, formatValue) : newValue;
        }
      }

      onChange(field.id, formattedValue);
    },
    [onChange, field.id, formatValue]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BaseFormControl field={field} value={value} error={error} {...rest}>
        <DatePicker
          {...datePickerProps}
          format="YYYY-MM-DD"
          className="mc-date-picker"
          label={field.label}
          value={dayJsObjValue}
          onChange={handleChange}
          slotProps={{
            textField: {
              error: Boolean(error)
            }
          }}
        />
      </BaseFormControl>
    </LocalizationProvider>
  );
};

export default InputDateField;
