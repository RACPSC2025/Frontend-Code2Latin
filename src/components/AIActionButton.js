import { SmartToy } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AIActionButton({ title, description, button1_text, button2_text, createNewAction }) {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setAiPrompt('');
  };

  const handleCreateAction = () => {
    if (aiPrompt !== '') {
      createNewAction(aiPrompt);
    }
    handleCloseModal();
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<SmartToy />}
        onClick={handleOpenModal}
        sx={{
          textTransform: 'none',
          boxShadow: 2,
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-1px)'
          }
        }}
      >
        {t(title)}
      </Button>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: 3,
            minHeight: '400px'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToy color="primary" />
            <Typography variant="h6">{t(title)}</Typography>
          </Box>
          <IconButton edge="end" onClick={handleCloseModal} aria-label="close" size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('Descripción')}
          </Typography>

          <TextField
            autoFocus
            multiline
            rows={6}
            fullWidth
            variant="outlined"
            label={t(description)}
            placeholder={t(description)}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseModal} variant="outlined" sx={{ borderRadius: 2 }}>
            {t('Cancelar')}
          </Button>
          <Button
            onClick={handleCreateAction}
            variant="contained"
            disabled={!aiPrompt.trim()}
            startIcon={<SmartToy />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 400
            }}
          >
            {t(button1_text)}
          </Button>
          <Button
            onClick={handleCreateAction}
            variant="contained"
            disabled={!aiPrompt.trim()}
            startIcon={<SmartToy />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 400
            }}
          >
            {t(button2_text)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
