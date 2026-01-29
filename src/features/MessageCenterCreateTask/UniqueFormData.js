import FormBuilder from '../../components/FormBuilder';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function UniqueFormData({ formModel, onFormModelChange, alert }) {
  const [uniqueFormModel, setUniqueFormModel] = useState({});

  const { t } = useTranslation();

  useEffect(() => {
    onFormModelChange(uniqueFormModel);
  }, [uniqueFormModel, onFormModelChange]);

  useEffect(() => {
    setUniqueFormModel(formModel);
  }, []);

  const applyAlert = {
    id: 'id_alert',
    label: `${t('apply_alert')}`,
    type: 'dropdown',
    options: alert
  };

  const uniqueFormData = [
    {
      id: 'start_date',
      label: `${t('initial_date')}`,
      type: 'datetime',
      defaultValue: ''
    },
    {
      id: 'end_date',
      label: `${t('final_date')}`,
      type: 'datetime',
      defaultValue: ''
    },
    applyAlert
  ];

  return (
    <>
      <FormBuilder
        inputFields={uniqueFormData}
        showActionButton={false}
        controlled={true}
        initialValues={uniqueFormModel}
        onChange={(id, value) => {
          setUniqueFormModel((prevState) => ({ ...prevState, [id]: value }));
        }}
      />
    </>
  );
}

export default UniqueFormData;
