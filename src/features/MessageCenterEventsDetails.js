import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import FormBuilder from '../components/FormBuilder';
import MessageCenterEventInfo from './MessageCenterEventInfo';
import BaseTab from '../components/BaseTab';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../lib/axios';
import { fetchMessageFormFields } from '../stores/messages/fetchMessageFormFieldsSlice';

export default function MessageCenterEventDetails({ selectedEvent }) {
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
  );
}
