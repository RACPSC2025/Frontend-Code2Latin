import { Box, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputDateField, InputTextField } from '../../components/Input';

export default function InceptionTableModal({
  isModalOpen,
  setIsModalOpen,
  modalType,
  handleSubmit
}) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(null);

  const handleClose = () => {
    setIsModalOpen(false);
    setInputValue(null);
  };

  const handleSave = () => {
    if (inputValue) {
      handleSubmit(inputValue);
    }
    handleClose();
  };

  return (
    <Dialog open={isModalOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ width: '100%', mt: 2 }}
        >
          {modalType === 'when' ? (
            <InputDateField
              field={{ id: 'date', label: t('Select Date') }}
              value={inputValue}
              onChange={(_, date) => setInputValue(date)}
            />
          ) : (
            <InputTextField
              field={{ id: 'responsible', label: t('Select Responsible') }}
              value={inputValue || ''}
              onChange={(_, value) => setInputValue(value)}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ mt: '5rem' }}>
        <Box display="flex" justifyContent="space-between" width="100%" padding="5px 20px">
          <Button size="large" variant="outlined" onClick={handleClose} color="primary">
            {t('Cancel')}
          </Button>
          <Button
            size="large"
            color="primary"
            variant="contained"
            onClick={handleSave}
            disabled={!inputValue}
          >
            {t('Submit')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
