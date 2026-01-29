import { AttachFile } from '@mui/icons-material';
import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LegalMatrixForm from '../MessageCenterLegalMatrix/LegalMatrixForm';

export default function Details({
  handleMenuOpen = () => {},
  setCompliancedata = () => {},
  complianceData = {}
}) {
  const { t } = useTranslation();

  return (
    <Box sx={{ padding: '10px', width: '100%' }}>
      {/* Dashed Box */}
      <Box
        sx={{
          border: '2px dashed #19aabb',
          textAlign: 'center',
          padding: '20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <Typography
          color="primary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <AttachFile sx={{ rotate: '45deg' }} />
          {t('please_attach_full_legal_text_as_PDF')}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ marginTop: '20px' }}>
        <LegalMatrixForm />
      </Box>
    </Box>
  );
}
