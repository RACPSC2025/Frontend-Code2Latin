import React from 'react';
import { useTranslation } from 'react-i18next';

import FormBuilder from '../components/FormBuilder';

function MessageCenterFormActionLocation({ model, onUpdateModel }) {
  const { t } = useTranslation();

  const businessList = [];

  const companyList = [];

  const regionList = [];

  const locationList = [];

  const inputFields = [
    {
      id: 'creationDate',
      label: t('CreationDate'),
      type: 'datetime', // make sure your FormBuilder can handle this type
      gridSize: 6
    },
    {
      id: 'realClosureDate',
      label: t('ActualClosingDate'),
      type: 'datetime', // make sure your FormBuilder can handle this type
      gridSize: 6
    },

    {
      id: 'business',
      label: t('Business'),
      type: 'dropdown',
      options: businessList,
      gridSize: 6
    },
    {
      id: 'company',
      label: t('Company'),
      type: 'dropdown',
      options: companyList,
      gridSize: 6
    },
    {
      id: 'region',
      label: t('Regional'),
      type: 'dropdown',
      options: regionList,
      gridSize: 6
    },
    {
      id: 'location',
      label: t('Location'),
      type: 'dropdown',
      options: locationList,
      gridSize: 6
    },
    {
      id: 'pointer',
      label: t('Prompter'),
      type: 'dropdown',
      options: []
    }
  ];

  return (
    <FormBuilder
      inputFields={inputFields}
      initialValues={model}
      showActionButton={false}
      controlled={true}
      onChange={onUpdateModel}
    />
  );
}

export default MessageCenterFormActionLocation;
