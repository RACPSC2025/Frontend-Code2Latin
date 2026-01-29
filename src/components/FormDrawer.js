import CloseIcon from '@mui/icons-material/Close';
import { Alert as MuiAlert, Snackbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { Suspense, lazy, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showSuccessMsg } from '../utils/others';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Lazy load the FormBuilder component
const FormBuilder = lazy(() => import('./FormBuilder'));

export default function FormDrawer({
  open,
  handleClose,
  submitForm,
  title = 'Form Details',
  ...formBuilderProps
}) {
  const [openAlert, setOpenAlert] = useState(false);
  const { t } = useTranslation();

  const vertical = 'bottom';
  const horizontal = 'right';

  const showAlert = () => {
    setOpenAlert(true);
  };

  const hideAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  const handleFormSubmission = (formFields, resetForm) => {
    const cb = () => {
      handleClose();
      // showAlert();
      showSuccessMsg(t('FormSavedMessage'));
      setTimeout(resetForm, 500);
    };
    submitForm(formFields, cb);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: {
              lg: '35vw', // On 1280px width, make it 35vw
              xl: '38vw', // On 1366px width, make it 38vw
              xxl: '40vw' // On 1920px width and above, make it 40vw
            }
          }
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography color="white" variant="h6" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            <IconButton edge="end" onClick={handleClose} aria-label="close">
              <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div style={{ padding: '16px' }}>
          {/* Use Suspense to handle the loading state of the component */}
          <Suspense fallback={<div>{t('loading')}</div>}>
            <FormBuilder
              {...formBuilderProps}
              successCallback={handleFormSubmission}
              cancelCallback={handleClose}
            />
          </Suspense>
        </div>
      </Drawer>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openAlert}
        autoHideDuration={6000}
        onClose={hideAlert}
      >
        <Alert onClose={hideAlert} severity="success" sx={{ width: '100%' }}>
          {t('FormSavedMessage')}
        </Alert>
      </Snackbar>
    </>
  );
}
