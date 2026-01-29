import React from 'react';
import FormBuilder from '../components/FormBuilder';
import { t } from 'i18next';

function MessageCenterFormActionObservation({ model, onUpdateModel }) {
  const processList = [
    { label: t('select'), value: '' }
    // ... other processes
  ];

  const originList = [
    { label: t('select'), value: '' }
    // ... other origins
  ];

  const causesList = [
    { label: t('select'), value: '' }
    // ... other causes
  ];

  const formFields = [
    {
      id: 'process',
      label: t('Process'),
      type: 'dropdown',
      options: processList
    },
    {
      id: 'origin',
      label: t('Origin'),
      type: 'dropdown',
      options: originList
    },
    {
      id: 'causes',
      label: t('Causes'),
      type: 'dropdown',
      options: causesList
    },
    {
      id: 'sourceDescription',
      label: t('SourceDescription'),
      type: 'textarea'
    }
  ];

  return (
    <FormBuilder
      inputFields={formFields}
      initialValues={model}
      showActionButton={false}
      controlled={true}
      onChange={onUpdateModel}
    />
  );
}

export default MessageCenterFormActionObservation;
