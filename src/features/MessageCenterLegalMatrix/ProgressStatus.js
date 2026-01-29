import { Check } from '@mui/icons-material';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ProgressStatus({
  status = '',
  setStatus = () => {},
  rowData = [],
  rowId = 0,
  columnId = 0
}) {
  const { t } = useTranslation();
  const [isStatusUpdated, setIsStatusUpdated] = useState(false);
  const [columnStatus, setColumnStatus] = useState();

  const storedColumns = JSON.parse(localStorage.getItem('ComplianceTableColumn')) || [];
  const statusArray = ['not_apply', 'completed', 'partially_completed', 'in_transition', 'not_completed'];

  const handleSelectStatus = (newStatus) => {
    setStatus(newStatus);
    setColumnStatus(newStatus);
  };

  const handleSaveStatus = () => {
    const updatedRows = rowData.map((row) => {
      return row.id === rowId
        ? { ...row, status: columnStatus, [columnId]: { ...row[columnId], status: columnStatus } }
        : row;
    });
    localStorage.setItem('ComplianceRowData', JSON.stringify(updatedRows));

    setIsStatusUpdated(true);
    setTimeout(() => {
      setIsStatusUpdated(false);
    }, 1500);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {isStatusUpdated && (
        <Alert
          severity="success"
          icon={<Check fontSize="inherit" />}
          sx={{ mt: 1, mb: 2, width: 'fit-content' }}
        >
          {t('Status updated successfully.')}
        </Alert>
      )}

      <FormControl
        size="small"
        sx={{
          minWidth: 200,
          gap: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <InputLabel id="type-select-label">{t('type')}</InputLabel>
        <Select
          labelId="type-select-label"
          label={t('type')}
          value={status}
          onChange={(e) => handleSelectStatus(e.target.value)}
        >
          {statusArray.map((item, index) => (
            <MenuItem key={index} value={item}>
              {t(item)}
            </MenuItem>
          ))}
        </Select>

        <Button
          sx={{
            width: 'fit-content',
            color: 'white',
            alignSelf: 'flex-start'
          }}
          variant="contained"
          onClick={handleSaveStatus}
        >
          {t('Save')}
        </Button>
      </FormControl>
    </Box>
  );
}
