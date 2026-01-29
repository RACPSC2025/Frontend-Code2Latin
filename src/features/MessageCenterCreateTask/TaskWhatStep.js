import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import FormBuilder from '../../components/FormBuilder';
import LexicalInput from '../../components/Input/lexicalWYSWYG/LexicalInput';
import TagsSelector from '../../components/Input/TagsSelector';
import { fetchConvenioList } from '../../stores/tasks/fetchConvenioListSlice';
import { fetchPhases } from '../../stores/tasks/fetchPhasesSlice';
import { fetchPMASList } from '../../stores/tasks/fetchPMASListSlice';
import { fetchProgramAmbiental } from '../../stores/tasks/fetchProgramAmbientalSlice';
import { fetchProyectoAmbiental } from '../../stores/tasks/fetchProyectoAmbientalSlice';
import { fetchSubPhases } from '../../stores/tasks/fetchSubPhasesSlice';
import { fetchTaskTags } from '../../stores/tasks/fetchTaskTagsSlice';
import { getPrograms } from '../../stores/tasks/getProgramsSlice';
import { getSubPrograms } from '../../stores/tasks/getSubProgramsSlice';
import { isValidArray } from '../../utils/others';

function TaskWhatStep({ onTaskWhatStepChange, taskWhatFormModel }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [whatFormModel, setWhatFormModel] = useState({});

  const tagList = useSelector((state) => state?.fetchTaskTags?.data ?? []);
  const phase = useSelector((state) => state?.fetchPhase?.data?.data ?? []);
  const subPhase = useSelector((state) => state?.fetchSubPhases?.data?.data ?? []);
  const pmasList = useSelector((state) => state?.fetchPMASList?.data?.data ?? []);
  const programs = useSelector((state) => state?.getPrograms?.data?.data ?? []);
  const subPrograms = useSelector((state) => state?.getSubPrograms?.data?.data ?? []);
  const proyectoAmbiental = useSelector((state) => state?.fetchProyectoAmbiental?.data?.data ?? []);
  const programAmbiental = useSelector((state) => state?.fetchProgramAmbiental?.data?.data ?? []);
  const convenio = useSelector((state) => state?.fetchConvenioList?.data?.data ?? []);

  const handleFetchTags = () => {
    dispatch(fetchTaskTags());
  };

  const handleFetchPhase = () => {
    dispatch(fetchPhases());
  };

  const handleFetchSubPhases = (phaseId) => {
    if (!phaseId) return;
    let formData = new FormData();
    formData.append('fase_id', phaseId);
    dispatch(fetchSubPhases(formData));
  };

  const handleFetchPmas = () => {
    dispatch(fetchPMASList());
  };

  const handleGetPrograms = (pmasId) => {
    if (!pmasId) return;
    const formData = new FormData();
    formData.append('pma_id', pmasId);
    dispatch(getPrograms(formData));
  };

  const handleGetSubPrograms = (programId) => {
    if (!programId) return;
    const formData = new FormData();
    formData.append('program_id', programId);
    dispatch(getSubPrograms(formData));
  };

  const handleFetchProyectoAmbiental = () => {
    dispatch(fetchProyectoAmbiental());
  };

  const handleFetchProgramAmbiental = () => {
    dispatch(fetchProgramAmbiental());
  };

  const handleFetchConvenioList = () => {
    dispatch(fetchConvenioList());
  };

  const handleLexicalInput = (data) => {
    setWhatFormModel((prevState) => ({ ...prevState, task_description: data }));
  };

  const handleTagsSelection = (tags) => {
    const tagValues = tags.map((tag) => tag.value);
    setWhatFormModel((prevState) => ({ ...prevState, tags: tagValues }));
  };

  const FormDataWhat = [
    {
      id: 'task_title',
      label: `${t('taskTitle')}`,
      type: 'text',
      required: true,
      defaultValue: ''
    },
    {
      id: 'tags',
      label: `${t('tags')}`,
      type: 'text',
      defaultValue: ''
    },
    {
      id: 'corrective_plan',
      label: `${t('corrective_plan')}`,
      type: 'switch',
      defaultValue: false
    },
    {
      id: 'manage_costs',
      label: `${t('manage_costs')}`,
      type: 'switch',
      defaultValue: false
    },
    {
      id: 'task_description',
      label: `${t('task_description')}`,
      type: 'textarea',
      defaultValue: ''
    },
    {
      id: 'fase',
      label: `${t('fase')}`,
      type: 'dropdown',
      options: phase,
      required: true,
      dependent: 'task_subphase',
      defaultValue: ''
    },
    {
      id: 'subfase',
      label: `${t('subfase')}`,
      type: 'dropdown',
      options: subPhase,
      defaultValue: ''
    },
    {
      id: 'pma_id',
      label: `${t('pma_id')}`,
      type: 'dropdown',
      defaultValue: '',
      options: pmasList
    },
    {
      id: 'program_id',
      label: `${t('program_id')}`,
      type: 'dropdown',
      defaultValue: '',
      options: programs
    },
    {
      id: 'sub_program_id',
      label: `${t('sub_program_id')}`,
      type: 'dropdown',
      defaultValue: '',
      options: subPrograms
    },
    {
      id: 'project_management_id',
      label: `${t('project_management_id')}`,
      type: 'dropdown',
      defaultValue: '',
      options: proyectoAmbiental
    },
    {
      id: 'environmental_program_id',
      label: `${t('environmental_program_id')}`,
      type: 'dropdown',
      defaultValue: '',
      options: programAmbiental
    },
    {
      id: 'agreement_manager_id',
      label: `${t('agreement_manager_id')}`,
      type: 'dropdown',
      defaultValue: '',
      options: convenio
    }
  ];

  useEffect(() => {
    handleFetchPhase();
    handleFetchTags();
    handleFetchSubPhases();
    handleFetchProyectoAmbiental();
    handleFetchProgramAmbiental();
    handleFetchConvenioList();
    setWhatFormModel(taskWhatFormModel);
  }, []);

  useEffect(() => {
    handleFetchSubPhases(whatFormModel.fase);
    handleFetchPmas();
    handleGetPrograms(whatFormModel.pma_id);
    handleGetSubPrograms(whatFormModel.program_id);
  }, [whatFormModel]);

  useEffect(() => {
    onTaskWhatStepChange(whatFormModel);
  }, [whatFormModel, onTaskWhatStepChange]);

  return (
    <>
      <Typography variant="body1" sx={{ mt: '20px', mb: '12px' }}>
        {t('what_step_description')}
      </Typography>
      <FormBuilder
        showActionButton={false}
        inputFields={FormDataWhat.slice(0, 1)}
        controlled={true}
        initialValues={whatFormModel}
        onChange={(id, value) => {
          setWhatFormModel((prevState) => ({ ...prevState, [id]: value }));
        }}
      />
      {isValidArray(tagList) && (
        <TagsSelector onTagsChange={handleTagsSelection} listOfTags={tagList} />
      )}
      <FormBuilder
        showActionButton={false}
        inputFields={FormDataWhat.slice(2, 4)}
        controlled={true}
        initialValues={whatFormModel}
        onChange={(id, value) => {
          setWhatFormModel((prevState) => ({ ...prevState, [id]: value }));
        }}
      />
      <LexicalInput placeholder={t('taskDescription')} JSONData={handleLexicalInput} />
      <Box sx={{ margin: '20px 0' }}>
        <FormBuilder
          showActionButton={false}
          inputFields={FormDataWhat.slice(5)}
          initialValues={whatFormModel}
          controlled={true}
          onChange={(id, value) => {
            setWhatFormModel((prevState) => ({
              ...prevState,
              [id]: value
            }));
          }}
        />
      </Box>
    </>
  );
}

export default TaskWhatStep;
