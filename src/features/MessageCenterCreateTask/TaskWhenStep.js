import { AssignmentReturned, DownloadDone, Loop } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Radio,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlertList } from '../../stores/tasks/fetchAlertListSlice';
import { isValidArray } from '../../utils/others';
import CyclicFormData from './CyclicFormData';
import PermanentFormData from './PermanentFormData';
import UniqueFormData from './UniqueFormData';

const containerStyle = {
  flexGrow: 1
};

function TaskWhenStep({ onTaskWhenStepChange, taskWhenFormModel }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selectedWhenSwitch, setSelectedWhenSwitch] = useState(null);
  const [switchForDialog, setSwitchForDialog] = useState(null);
  const [taskHeader, setTaskHeader] = useState(t('choose_task_type'));
  const [whenFormModel, setWhenFormModel] = useState({});
  const [uniqueFormModel, setUniqueFormModel] = useState({});
  const [cyclicFormModel, setCyclicFormModel] = useState({});
  const [permanentFormModel, setPermanentFormModel] = useState({});
  const [activityType, setActivityType] = useState('');
  const [openCollapse, setOpenCollapse] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const alertList = useSelector((state) => state?.fetchAlertList?.data?.data ?? []);

  const handleFetchAlert = () => {
    dispatch(fetchAlertList());
  };

  const handleWhenSwitch = (event) => {
    setSwitchForDialog(event.target.name);
    if (selectedWhenSwitch !== null) {
      setOpenDialog(true);
    } else {
      setSelectedWhenSwitch(event.target.name);
      setOpenCollapse(false);
    }
  };

  const handleAcceptDialog = () => {
    setSelectedWhenSwitch(switchForDialog);
    setOpenDialog(false);
    setOpenCollapse(false);
  };

  const handleUniqueFormData = (formData) => {
    setUniqueFormModel(formData);
  };

  const handleCyclicFormData = (formData) => {
    setCyclicFormModel(formData);
  };

  const handlePermanentFormData = (formData) => {
    setPermanentFormModel(formData);
  };

  useEffect(() => {
    handleFetchAlert();
  }, []);

  useEffect(() => {
    if (selectedWhenSwitch === 'uniqueSwitch') {
      setTaskHeader(t('unique_task'));
      setActivityType('1');
      setWhenFormModel((prevState) => ({
        ...prevState,
        activity_type: '1'
      }));
    } else if (selectedWhenSwitch === 'cyclicSwitch') {
      setTaskHeader(t('cyclic_task'));
      setActivityType('3');
      setWhenFormModel((prevState) => ({
        ...prevState,
        activity_type: '3'
      }));
    } else if (selectedWhenSwitch === 'permanentSwitch') {
      setTaskHeader(t('permanent_task'));
      setActivityType('5');
      setWhenFormModel((prevState) => ({
        ...prevState,
        activity_type: '5'
      }));
    } else {
      setWhenFormModel((prevState) => ({
        ...prevState,
        activity_type: ''
      }));
    }
  }, [selectedWhenSwitch]);

  useEffect(() => {
    setWhenFormModel((prevState) => ({
      ...prevState,
      ...uniqueFormModel,
      ...cyclicFormModel,
      ...permanentFormModel,
      activity_type: activityType
    }));
  }, [uniqueFormModel, cyclicFormModel, permanentFormModel]);

  useEffect(() => {
    setUniqueFormModel(taskWhenFormModel);
    setCyclicFormModel(taskWhenFormModel);
    setPermanentFormModel(taskWhenFormModel);
  }, []);

  useEffect(() => {
    onTaskWhenStepChange(whenFormModel);
  }, [whenFormModel, onTaskWhenStepChange]);

  return (
    <>
      <Typography variant="body1" margin="20px 0">
        {t('when_step_description')}
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        gap={5}
        alignItems="start"
        padding={2}
      >
        <Card
          sx={{
            minWidth: '100%',
            border: '1px solid rgba(211,211,211,0.6)'
          }}
        >
          <CardHeader
            title={taskHeader}
            action={
              <IconButton
                onClick={() => setOpenCollapse(!openCollapse)}
                aria-label="expand"
                size="small"
              >
                {openCollapse ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            }
          ></CardHeader>
          <Box>
            <Collapse in={openCollapse} timeout="auto" unmountOnExit>
              <CardContent>
                <Box display="flex" justifyContent="start" alignItems="center" gap={10}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    justifyContent="center"
                    alignItems="center"
                    sx={containerStyle}
                    width="10vw"
                  >
                    <AssignmentReturned fontSize="large" />
                    <Typography variant="h5">{t('unique')}</Typography>
                  </Box>
                  <Typography width="40%" paragraph={true}>
                  Este tipo de tarea se ejecuta una sola vez dentro del ciclo del proyecto. Se utiliza para actividades puntuales con una fecha de inicio y fin definidas, como una reunión específica, una entrega o la revisión de un documento. Una vez completada, no se vuelve a generar automáticamente.
                  </Typography>
                  <Radio
                    checked={selectedWhenSwitch === 'uniqueSwitch'}
                    name="uniqueSwitch"
                    onChange={handleWhenSwitch}
                  />
                </Box>
                <Box display="flex" justifyContent="start" alignItems="center" gap={10}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    justifyContent="center"
                    alignItems="center"
                    sx={containerStyle}
                    width="10vw"
                  >
                    <Loop fontSize="large" />
                    <Typography variant="h5">{t('cyclic')}</Typography>
                  </Box>
                  <Typography width="40%" paragraph={true}>
                  Son tareas que deben repetirse un número determinado de veces durante el desarrollo del proyecto. Por ejemplo, pueden ser inspecciones semanales, reportes mensuales o capacitaciones trimestrales. Se programan con una frecuencia establecida y se mantienen activas hasta cumplir con el número de repeticiones configuradas.
                  </Typography>
                  <Radio
                    checked={selectedWhenSwitch === 'cyclicSwitch'}
                    name="cyclicSwitch"
                    onChange={handleWhenSwitch}
                  />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={10}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    justifyContent="center"
                    alignItems="center"
                    sx={containerStyle}
                    width="10vw"
                  >
                    <DownloadDone fontSize="large" />
                    <Typography variant="h5">{t('permanent')}</Typography>
                  </Box>
                  <Typography width="40%" paragraph={true}>
                  Estas tareas no tienen un número fijo de repeticiones, ya que representan obligaciones continuas que deben cumplirse de forma permanente mientras el proyecto esté activo. Se generan dinámicamente en el tiempo y están asociadas a procesos críticos como el cumplimiento normativo, mantenimiento preventivo o monitoreo constante. No finalizan a menos que el proyecto se cierre o se desactiven manualmente.
                  </Typography>
                  <Radio
                    checked={selectedWhenSwitch === 'permanentSwitch'}
                    name="permanentSwitch"
                    onChange={handleWhenSwitch}
                  />
                </Box>
              </CardContent>
            </Collapse>
          </Box>
        </Card>

        {isValidArray(alertList) &&
          (selectedWhenSwitch === 'uniqueSwitch' ? (
            <UniqueFormData
              formModel={uniqueFormModel}
              onFormModelChange={handleUniqueFormData}
              alert={alertList}
            />
          ) : selectedWhenSwitch === 'cyclicSwitch' ? (
            <CyclicFormData
              formModel={cyclicFormModel}
              onFormModelChange={handleCyclicFormData}
              alert={alertList}
            />
          ) : selectedWhenSwitch === 'permanentSwitch' ? (
            <PermanentFormData
              formModel={permanentFormModel}
              onFormModelChange={handlePermanentFormData}
              alert={alertList}
            />
          ) : (
            <div>{t('choose_task_type')}</div>
          ))}

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-switch-task"
        >
          <DialogTitle>{t('switch_task')}</DialogTitle>
          <DialogContent>{t('switch_task_description')}</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              {t('Cancel')}
            </Button>
            <Button onClick={handleAcceptDialog} color="primary">
              {t('Accept')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

export default TaskWhenStep;
