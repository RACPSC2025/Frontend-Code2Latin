import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormBuilder from '../../components/FormBuilder';
import RequisitosLegalesTreeView from './RequisitosLegalesTreeView';

function TaskWhyStep({ onTaskWhyStepChange, taskWhyFormModel }) {
  const [whyFormModel, setWhyFormModel] = useState({});

  const { t } = useTranslation();

  const FormDataWhy = [
    {
      id: 'goals',
      label: `${t('goals_to_achieve')}`,
      type: 'text',
      defaultValue: ''
    },
    {
      id: 'compliance',
      label: `${t('compliance')}`,
      type: 'text',
      defaultValue: ''
    },
    {
      id: 'only_articles',
      label: `${t('only_articles')}`,
      type: 'switch',
      defaultValue: false
    }
  ];

  useEffect(() => {
    setWhyFormModel(taskWhyFormModel);
  }, []);

  useEffect(() => {
    onTaskWhyStepChange(whyFormModel);
  }, [whyFormModel, onTaskWhyStepChange]);

  const handleRequisitosChange = (location) => {
    setWhyFormModel({
      location
    });
  };

  return (
    <>
      <Typography variant="body1" margin="20px 0">
        {t('why_step_description')}
      </Typography>
      <FormBuilder
        showActionButton={false}
        inputFields={FormDataWhy.slice(0, 1)}
        controlled={true}
        initialValues={whyFormModel}
        onChange={(id, value) => {
          setWhyFormModel((prevState) => ({ ...prevState, [id]: value }));
        }}
      />
      <Box sx={{ margin: '20px 0' }}>
        <RequisitosLegalesTreeView onRequisitosLegalesTreeViewChange={handleRequisitosChange} />
      </Box>
    </>
  );
}

export default TaskWhyStep;
