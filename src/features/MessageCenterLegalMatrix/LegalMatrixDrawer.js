import { Close } from '@mui/icons-material';
import { AppBar, Box, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LegalMatrixForm from './LegalMatrixForm';

export default function LegalMatrixDrawer({
  openCreateTask = false,
  setOpenCreateTask = () => {}
}) {
  const { t } = useTranslation();
  return (
    <>
      {/* /* Legal Matrix Form  Drawer */}
      <Drawer
        anchor="right"
        open={openCreateTask}
        onClose={() => setOpenCreateTask()}
        PaperProps={{
          sx: {
            maxWidth: '70vw', // Maximum width on all screens
            width: {
              sm: '70vw', // On 1280px width, make it 35vw
              md: '60vw', // On 1366px width, make it 38vw
              lg: '50vw' // On 1920px width and above, make it 40vw
            }
          }
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography color="white" variant="h5" sx={{ flexGrow: 1 }}>
              {t('create_a_legal_requirement')}
            </Typography>
            <IconButton edge="end" onClick={() => setOpenCreateTask()} aria-label="close">
              <Close sx={{ color: 'white' }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ px: 2 }}>
          <LegalMatrixForm />
        </Box>
      </Drawer>
    </>
  );
}
