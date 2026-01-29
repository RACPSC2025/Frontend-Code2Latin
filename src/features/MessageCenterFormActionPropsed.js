import React from 'react';
import { useTranslation } from 'react-i18next';
import FormBuilder from '../components/FormBuilder';

function MessageCenterFormActionProposed({ model, onUpdateModel }) {
  const { t } = useTranslation();

  const contractorList = [
    {
      label: 'Contractor 1',
      value: '1'
    },
    {
      label: 'Contractor 2',
      value: '2'
    },
    {
      label: 'Contractor 3',
      value: '3'
    }
  ];

  const formFields = [
    {
      id: 'action',
      label: t('ActionToTake'),
      type: 'textarea'
    },
    {
      id: 'executionSuggestion',
      label: t('ExecutionSuggestion'),
      type: 'textarea'
    },
    {
      id: 'startDate',
      label: t('ExpectedStartDate'),
      type: 'datetime',
      gridSize: 6
    },
    {
      id: 'executionResponsible',
      label: t('ExecutionManager'),
      type: 'text',
      gridSize: 6
    },
    {
      id: 'executionResponsibleEmail',
      label: t('Email'),
      type: 'text',
      gridSize: 6
    },
    {
      id: 'endDate',
      label: t('ProposedClosingDate'),
      type: 'datetime',
      gridSize: 6
    },
    {
      id: 'reviewResponsible',
      label: t('ReviewManager'),
      type: 'text',
      gridSize: 6
    },
    {
      id: 'reviewResponsibleEmail',
      label: t('ReviewManager'),
      type: 'text',
      gridSize: 6
    },
    {
      id: 'contractor',
      label: t('Contractor'),
      type: 'dropdown',
      options: contractorList
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

export default MessageCenterFormActionProposed;
