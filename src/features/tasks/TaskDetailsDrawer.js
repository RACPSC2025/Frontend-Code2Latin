import { Close } from '@mui/icons-material';
import { AppBar, Box, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseTab from '../../components/BaseTab';
import FormBuilder from '../../components/FormBuilder';
import { fetchMessageFormFields } from '../../stores/messages/fetchMessageFormFieldsSlice';
import MessageCenterEventInfo from '../MessageCenterEventInfo';
import { useDispatch } from 'react-redux';

export default function TaskDetailsDrawer({
  selectedEvent = {},
  drawerOpen = false,
  handleCloseDrawer = () => {}
}) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('info');
  const formData = new FormData();
  const [formFields, setFormFields] = useState([]);
  const [loadingForm, setLoadingForm] = useState(false);
  const { t } = useTranslation();

  const handleFetchMessageFormFields = () => {
    formData.append('form_code', selectedEvent?.form_code);
    dispatch(fetchMessageFormFields({ formData: formData, file: true })).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const response = data?.payload?.data;
        configFormFields(response);
      }
    });
  };

  useEffect(() => {
    const configFormFields = (form) => {
      if (!form) {
        setLoadingForm(false);
        return;
      }
      const fields = form
        .map((field) => {
          if (field.control_type !== 'dropdown') {
            return {
              id: field.id,
              type: field.control_type,
              // TODO: Add support for multi-language
              // TODO: Add support for options in dropdown
              label: field.label_en,
              required: field.is_require === '1'
            };
          }
        })
        .filter(Boolean);
      setFormFields(fields);
      setLoadingForm(false);
    };

    handleFetchMessageFormFields();

    // fetchFormFields().then((data) => {
    //   configFormFields(data);
    // });
  }, [activeTab]);

  const statusList = [
    {
      label: t('InProgress'),
      value: '1'
    },
    {
      label: t('Completed'),
      value: '2'
    }
  ];

  // TODO: Delete or refactor
  const formFieldsConfig = [
    {
      id: 'datetime',
      type: 'datetime',
      label: t('date_time'),
      required: true
    },
    {
      id: 'description',
      type: 'textarea',
      label: t('Description'),
      required: true
    },
    {
      id: 'url',
      type: 'text',
      label: 'URL',
      required: false
    },
    {
      id: 'status',
      type: 'dropdown',
      label: t('Status'),
      options: statusList,
      required: true
    },
    {
      id: 'filePicker',
      type: 'file',
      label: t('upload_file'),
      required: false
    }
  ];

  const handleFormSuccess = () => {};

  const handleFormCancel = () => {};

  const tabItems = [
    { key: 'info', label: t('task_details') },
    { key: 'form', label: t('additional_information') }
  ];

  let containerStyle = {
    px: 2,
    pt: activeTab === 'form' ? 1 : 2,
    pb: 2,
    flexGrow: 1,
    minHeight: 0,
    overflowY: 'auto'
  };

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={handleCloseDrawer}
      PaperProps={{
        sx: {
          maxWidth: '70vw', // Maximum width on all screens
          width: {
            sm: '70vw', // On 1280px width, make it 35vw
            md: '60vw', // On 1366px width, make it 38vw
            lg: '40vw' // On 1920px width and above, make it 40vw
          }
        }
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography color="white" variant="h5" sx={{ flexGrow: 1 }}>
            {t('EventDetails')}
          </Typography>
          <IconButton edge="end" onClick={handleCloseDrawer} aria-label="close">
            <Close sx={{ color: 'white' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <BaseTab
          items={tabItems}
          activeTab={activeTab === 'info' ? 0 : 1}
          tabContainerProps={{
            sx: { my: 2 },
            onChange: (_, value) => setActiveTab(value === 0 ? 'info' : 'form')
          }}
          showBorderBottom
        />
        <Box sx={containerStyle}>
          {selectedEvent && activeTab === 'info' ? (
            <MessageCenterEventInfo event={selectedEvent} />
          ) : activeTab === 'form' ? (
            loadingForm ? (
              <p>{t('loading')}</p>
            ) : formFields !== undefined ? (
              <FormBuilder
                inputFields={formFields}
                successCallback={handleFormSuccess}
                cancelCallback={handleFormCancel}
              />
            ) : (
              <Typography variant="body1">{t('noFormFields')}</Typography>
            )
          ) : (
            <Typography variant="body1">{t('noEventSelected')}</Typography>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
