import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputDateField from './InputDateField';

const InputDateRangePicker = ({ value = [], field, direction = 'row', onChange, ...rest }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const { t } = useTranslation();

  const fieldsLocale = {
    start: t('StartDate'),
    end: t('EndDate')
  };

  const areBothDateRangeSame = (dateRange1, dateRange2) => {
    const [startDate1 = null, endDate1 = null] = dateRange1;
    const [startDate2 = null, endDate2 = null] = dateRange2;

    return startDate1 === startDate2 && endDate1 === endDate2;
  };

  useEffect(() => {
    if (!areBothDateRangeSame(value, dateRange)) {
      setDateRange(value);
    }
  }, [value]);

  useEffect(() => {
    if (areBothDateRangeSame(dateRange, value)) return;

    const isValidDateRange =
      dateRange.every((datePart) => datePart !== null) ||
      dateRange.every((datePart) => datePart === null);

    if (isValidDateRange && onChange && typeof onChange === 'function') {
      onChange(field.id, dateRange);
    }
  }, [dateRange, value, onChange, field]);

  const isTopDown = direction === 'column' || direction === 'column-reverse';

  const handleDateChange = (newValue, idx) => {
    let [start, end] = dateRange;

    if (idx === 0) start = newValue;
    else end = newValue;

    setDateRange([start, end]);
  };

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: direction,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: isTopDown ? 2 : 0
      }}
    >
      <Box sx={{ position: 'absolute', right: '-10px', top: '-20px' }}>
        <Button
          size="small"
          sx={{ color: 'background.paper', p: 0 }}
          onClick={() => setDateRange([null, null])}
        >
          {t('Clear')}
        </Button>
      </Box>
      <Box sx={{ width: isTopDown ? '100%' : '45%' }}>
        <InputDateField
          field={{ id: 'start', label: fieldsLocale.start }}
          value={dateRange[0]}
          datePickerProps={rest}
          onChange={(_, date) => handleDateChange(date, 0)}
        />
      </Box>
      {isTopDown ? null : <Box>-</Box>}
      <Box sx={{ width: isTopDown ? '100%' : '45%' }}>
        <InputDateField
          field={{ id: 'end', label: fieldsLocale.end }}
          value={dateRange[1]}
          datePickerProps={rest}
          onChange={(_, date) => handleDateChange(date, 1)}
        />
      </Box>
    </Box>
  );
};

export default InputDateRangePicker;
