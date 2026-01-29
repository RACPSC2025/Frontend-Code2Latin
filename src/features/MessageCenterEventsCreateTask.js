import { Box, Button, Typography } from '@mui/material';
import { Suspense, lazy, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import BaseTab from '../components/BaseTab';
import { saveTask } from '../stores/tasks/saveTaskSlice';

const TaskWhenStep = lazy(() => import('./MessageCenterCreateTask/TaskWhenStep'));
const TaskWhatStep = lazy(() => import('./MessageCenterCreateTask/TaskWhatStep'));
const TaskWhereStep = lazy(() => import('./MessageCenterCreateTask/TaskWhereStep'));
const TaskWhoStep = lazy(() => import('./MessageCenterCreateTask/TaskWhoStep'));
const TaskWhyStep = lazy(() => import('./MessageCenterCreateTask/TaskWhyStep'));
const TaskHowStep = lazy(() => import('./MessageCenterCreateTask/TaskHowStep'));

const steps = ['What', 'Where', 'When', 'Who', 'Why', 'How'];

export function MessageCenterEventsCreateTask({ onCloseModal }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [whatFormModel, setWhatFormModel] = useState({});
  const [whereFormModel, setWhereFormModel] = useState({});
  const [whenFormModel, setWhenFormModel] = useState({});
  const [whoFormModel, setWhoFormModel] = useState({});
  const [whyFormModel, setWhyFormModel] = useState({});
  const [howFormModel, setHowFormModel] = useState({});
  const [taskCreationData, setTaskCreationData] = useState({});
  const [taskSubmissionStatus, setTaskSubmissionStatus] = useState('');

  const isStepOptional = (step) => {
    return step === 1 || step === 3;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === steps.length - 1) {
      setActiveStep(6);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleTaskWhatStep = (data) => {
    setWhatFormModel(data);
  };

  const handleTaskWhereStep = (data) => {
    setWhereFormModel(data);
  };

  const handleTaskWhenStep = (data) => {
    setWhenFormModel(data);
  };

  const handleTaskWhoStep = (data) => {
    setWhoFormModel(data);
  };

  const handleTaskWhyStep = (data) => {
    setWhyFormModel(data);
  };

  const handleSaveTask = () => {
    dispatch(saveTask(taskCreationData)).then((data) => {
      if (data?.payload?.messgaes === 'Success') {
        setTaskSubmissionStatus('success');
      } else {
        setTaskSubmissionStatus('error');
      }
    });
  };

  const handleSubmitForm = () => {
    // setActiveStep(6);
    // postTask();
    handleSaveTask();
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const tabItems = [
    { key: 'what', label: `${t('what')}` },
    { key: 'where', label: `${t('where')}` },
    { key: 'when', label: `${t('when')}` },
    { key: 'who', label: `${t('who')}` },
    { key: 'why', label: `${t('why')}` },
    { key: 'how', label: `${t('how')}` }
  ];

  const StepsDataTest = {
    What: (
      <TaskWhatStep onTaskWhatStepChange={handleTaskWhatStep} taskWhatFormModel={whatFormModel} />
    ),
    Where: (
      <TaskWhereStep
        onTaskWhereStepChange={handleTaskWhereStep}
        taskWhereFormModel={whereFormModel}
      />
    ),
    When: (
      <TaskWhenStep onTaskWhenStepChange={handleTaskWhenStep} taskWhenFormModel={whenFormModel} />
    ),
    Who: <TaskWhoStep onTaskWhoStepChange={handleTaskWhoStep} taskWhoFormModel={whoFormModel} />,
    Why: <TaskWhyStep onTaskWhyStepChange={handleTaskWhyStep} taskWhyFormModel={whyFormModel} />,
    How: <TaskHowStep />
  };

  useEffect(() => {
    setWhatFormModel({
      task_title: '',
      tags: '',
      corrective_plan: false,
      manage_costs: false,
      task_description: '',
      fase: '',
      subfase: '',
      pma_id: '',
      program_id: '',
      sub_program_id: '',
      project_management_id: '',
      environmental_program_id: '',
      agreement_manager_id: ''
    });

    setWhereFormModel({
      geovisor_link: '',
      business: '',
      country: '',
      region: '',
      plant: ''
    });

    setWhenFormModel({
      activity_type: '',
      start_date: '',
      end_date: '',
      cron_start_date: '',
      cron_end_date: '',
      id_alert: '',
      initial_date: '',
      losanos: '',
      losmeses: '',
      losdias: '',
      plan: '',
      range: '',
      range_value: '',
      recure_every: '',
      sub_plan: ''
    });

    setWhoFormModel({
      responsible: '',
      reviewer: '',
      contractor_company: '',
      contract: ''
    });

    setWhyFormModel({
      goals: '',
      location: ''
    });
  }, []);

  useEffect(() => {
    const whatFormModelPOST = {
      ...whatFormModel,
      corrective_plan: whatFormModel.corrective_plan ? 'on' : 'off',
      manage_costs: whatFormModel.manage_costs ? 'on' : 'off',
      task_description: JSON.stringify(whatFormModel.task_description)
    };
    setTaskCreationData({
      ...whatFormModelPOST,
      ...whereFormModel,
      ...whenFormModel,
      ...whoFormModel,
      ...whyFormModel,
      ...howFormModel,
      who: []
      // activity_type: '1'
    });
  }, [activeStep]);

  return (
    <Box sx={{ width: '100%' }}>
      <BaseTab
        items={tabItems}
        activeTab={activeStep}
        tabContainerProps={{
          sx: {
            mb: 2
          },
          onChange: (event, newValue) => setActiveStep(newValue)
        }}
      />
      <Box
        sx={
          {
            // px: 2,
            // pb: 2
          }
        }
      >
        {activeStep === steps.length ? (
          <Box>
            <Typography sx={{ mt: 2, mb: 1, textAlign: 'center' }}>
              {t('stepsCompleted')}
              <Box>
                <Button sx={{ mt: 2 }} variant="contained" onClick={handleSubmitForm}>
                  {t('sendForm')}
                </Button>
              </Box>
              <Box>
                <Button sx={{ mt: 2 }} variant="outlined" onClick={handleReset}>
                  {t('reset')}
                </Button>
              </Box>
            </Typography>
            <Typography>{taskSubmissionStatus}</Typography>
          </Box>
        ) : (
          <Box>
            <Suspense fallback={<p>{t('loading')}</p>}>
              <Box>{StepsDataTest[steps[activeStep]]}</Box>
            </Suspense>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                {t('back')}
              </Button>
              {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  {t('skip')}
                </Button>
              )}
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? `${t('finish')}` : `${t('next')}`}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
