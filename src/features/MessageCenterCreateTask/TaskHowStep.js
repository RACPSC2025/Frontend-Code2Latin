import { Typography } from '@mui/material';
import { useState } from 'react';
import FormBuilder from '../../components/FormBuilder';
import LexicalInput from '../../components/Input/lexicalWYSWYG/LexicalInput';

import { useTranslation } from 'react-i18next';

function TaskHowStep() {
  const [HowFormModel, setHowFormModel] = useState({ task_description: '' });
  const handleLexicalInput = (data) => {
    setHowFormModel((prevState) => ({ ...prevState, task_description: data }));
  };

  const { t } = useTranslation();

  const FormDataHow = [
    {
      id: 'tracking',
      label: `${t('type_of_tracking')}`,
      type: 'dropdown',
      defaultValue: '',
      options: [
        { value: 'default', label: t('default') },
        { value: 'verification_list', label: t('checklist') }
      ]
    },
    {
      id: 'internal_comments',
      label: `${t('allow_internal_comments')}`,
      type: 'switch',
      defaultValue: false
    },
    {
      id: 'upload',
      label: `${t('user_upload')}`,
      type: 'switch',
      defaultValue: false
    }
  ];

  return (
    <>
      <Typography variant="body1" margin="20px 0">
        {t('how_step_description')}
      </Typography>
      <FormBuilder showActionButton={false} inputFields={FormDataHow} />
      <LexicalInput placeholder={t('training_material')} JSONData={handleLexicalInput} />
    </>
  );
}

export default TaskHowStep;
