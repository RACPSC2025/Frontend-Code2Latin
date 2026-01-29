import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useTranslation } from 'react-i18next';

function WorkInProgress() {
  const { t } = useTranslation();
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '100px' }}>
      <ConstructionIcon style={{ fontSize: '50px' }} />
      <Typography variant="h4" gutterBottom>
        {t('work_in_progress')}
      </Typography>
      <Typography variant="subtitle1">
        {t('Were_working_hard')}
      </Typography>
    </Container>
  );
}

export default WorkInProgress;
