import React from 'react';
import { useTranslation } from 'react-i18next';
import FormBuilder from '../components/FormBuilder';

function MessageCenterFormActionClassification({ model, onUpdateModel }) {
  const { t } = useTranslation();

  const actionCategoryList = [{ label: t('select'), value: '' }];

  const statusList = [
    {
      label: 'Abierta',
      value: 'xyz'
    },
    {
      label: 'Test',
      value: 'pqr'
    }
  ];

  const analysisTypeList = [
    {
      label: t('select'),
      value: ''
    }
  ];

  const formFields = [
    {
      id: 'actionCategory',
      label: t('ActionCategory'),
      type: 'dropdown',
      options: actionCategoryList
    },
    {
      id: 'status',
      label: t('State'),
      type: 'dropdown',
      options: statusList,
      gridSize: 6
    },
    {
      id: 'analysisType',
      label: t('AnalysisType'),
      type: 'dropdown',
      options: analysisTypeList,
      gridSize: 6
    },
    {
      id: 'immediateActions',
      label: t('ImmediateActionsTaken'),
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

export default MessageCenterFormActionClassification;
