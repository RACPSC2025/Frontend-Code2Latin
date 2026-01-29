import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Box, Button, Drawer, IconButton, Modal, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import FormBuilder from '../../components/FormBuilder';
import { fetchListLevelExecutor } from '../../stores/tasks/fetchListLevelExecutorSlice';
import { getPositionUserList } from '../../stores/tasks/getPositionUserListSlice';
import { getSettings } from '../../stores/tasks/getSettingsSlice';
import { updateLogtaskDetails } from '../../stores/tasks/updateLogtaskDetailsSlice';
import { updateResponsibles } from '../../stores/tasks/updateResponsiblesSlice';

function EditCycleDetailsDrawer({
  openCycleDetailsDrawer,
  onCloseCycleDetailsDrawer,
  formModel,
  taskDetails,
  onDrawerOpened,
  onCloseEditDrawer
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openCollapseCiclo, setOpenCollapseCiclo] = useState(true);
  const [openCollapseResponsables, setOpenCollapseResponsables] = useState(false);
  const [editarCicloFormModel, setEditarCicloFormModel] = useState([]);
  const [editarResponsablesFormModel, setEditarResponsablesFormModel] = useState({});
  const [levelEjecutor, setLevelEjecutor] = useState([]);
  const [positionUserList, setPositionUserList] = useState([]);
  const [errorEditForm, setErrorEditForm] = useState(false);
  const [errorEditResponsable, setErrorResponsableForm] = useState(false);
  const [warningDateEditForm, setWarningDateEditForm] = useState(false);
  const [executor, setExecutor] = useState([]);
  const [reviewer, setReviewer] = useState([]);
  const [setting, setSettings] = useState({});
  const [editFormResp, setEditFormResp] = useState('');
  const [openModalEditResp, setOpenModalEditResp] = useState(false);

  const settings = useSelector((state) => state?.getSettings?.data?.data ?? {});

  const handleGetSettings = () => {
    dispatch(getSettings());
  };

  const handleCloseDrawer = () => {
    setEditarResponsablesFormModel({});
    onCloseCycleDetailsDrawer();
    onDrawerOpened();
    onCloseEditDrawer();
  };

  const handleUpdateLogtaskDetails = async () => {
    if (
      !(
        parseInt(editarCicloFormModel.percentage) >= 0 &&
        !!editarCicloFormModel?.real_closing_date?.trim() &&
        !!editarCicloFormModel?.start_date?.trim() &&
        !!editarCicloFormModel?.end_date?.trim()
      )
    ) {
      setErrorEditForm(true);
      return;
    } else {
      setErrorEditForm(false);
    }

    if (!dateValidation()) {
      setWarningDateEditForm(true);
      return;
    } else {
      setWarningDateEditForm(false);
    }

    const formData = new FormData();
    formData.append('logtask_id', editarCicloFormModel.logtask_id);
    formData.append('percentage', editarCicloFormModel.percentage);
    formData.append('real_closing_date', editarCicloFormModel.real_closing_date);
    // formData.append('completado', editarCicloFormModel.completado);
    formData.append('start_date', editarCicloFormModel.start_date);
    formData.append('end_date', editarCicloFormModel.end_date);

    dispatch(updateLogtaskDetails(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        setEditFormResp(t('cycle_edited_correctly'));
        setOpenModalEditResp(true);
      } else {
        setEditFormResp(t('unable_to_edit_cycle'));
        setOpenModalEditResp(true);
      }
    });
  };

  const handleUpdateResponsibles = async () => {
    if (
      !(
        !!editarResponsablesFormModel?.location_resp?.trim() &&
        !!editarResponsablesFormModel?.responsible?.trim() &&
        !!editarResponsablesFormModel?.reviewer?.trim()
      )
    ) {
      setErrorResponsableForm(true);
      return;
    } else {
      setErrorResponsableForm(false);
    }

    const formData = new FormData();
    formData.append('logtask_id', formModel.logtask_id);
    formData.append('location_resp', editarResponsablesFormModel.location_resp);
    formData.append('responsible', editarResponsablesFormModel.responsible);
    formData.append('reviewer', editarResponsablesFormModel.reviewer);

    dispatch(updateResponsibles(formData)).then((data) => {
      if (response.data.messages === 'Success') {
        setEditFormResp(t('successfully_created'));
        setOpenModalEditResp(true);
      } else {
        setEditFormResp(t('error_creating'));
        setOpenModalEditResp(true);
      }
    });
  };

  const handleListLevelExecutor = () => {
    dispatch(fetchListLevelExecutor()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        setLevelEjecutor(data?.payload?.data);
      }
    });
  };

  const handleGetPositionUserList = () => {
    dispatch(getPositionUserList()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const positionUserList = data?.payload?.data?.map((positionUser) => ({
          value: positionUser.id,
          label: `${positionUser.position_name} (${positionUser.person_name})`
        }));
        setExecutor(positionUserList);
        setReviewer(positionUserList);
        setPositionUserList(positionUserList);
      }
    });
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
  };

  const editarCicloFormData = [
    {
      id: 'start_date',
      label: t('StartDate'),
      type: 'date',
      defaultValue: ''
    },
    {
      id: 'end_date',
      label: t('completion'),
      type: 'date',
      defaultValue: ''
    },
    {
      id: 'percentage',
      label: t('progress'),
      type: 'text',
      defaultValue: '',
      required: true
    },
    {
      id: 'real_closing_date',
      label: t('actual_date_of_closure'),
      type: 'date',
      defaultValue: ''
    }
  ];

  const editarResponsablesFormData = [
    {
      id: 'location_resp',
      label: t('functional_structure'),
      type: 'dropdown',
      defaultValue: '',
      options: levelEjecutor
    },
    {
      id: 'responsible',
      label: t('responsible_execution'),
      type: 'autocomplete',
      defaultValue: '',
      options: positionUserList
    },
    {
      id: 'reviewer',
      label: t('validation_officer'),
      type: 'autocomplete',
      defaultValue: '',
      options: positionUserList
    }
  ];

  const dateValidation = () => {
    if (editarCicloFormModel.start_date !== '') {
      const fechaInicio = new Date(editarCicloFormModel.start_date);
      const finalizacion = new Date(editarCicloFormModel.end_date);

      return finalizacion >= fechaInicio;
    }
    return false;
  };

  const handleExecutorSelection = (tags) => {
    const tagValues = tags.map((tag) => tag.value);
    const joinedTagValues = tagValues.join(',');
    setEditarResponsablesFormModel((prevState) => ({ ...prevState, responsible: joinedTagValues }));
  };

  const handleReviewerSelection = (tags) => {
    const tagValues = tags.map((tag) => tag.value);
    const joinedTagValues = tagValues.join(',');
    setEditarResponsablesFormModel((prevState) => ({ ...prevState, reviewer: joinedTagValues }));
  };

  useEffect(() => {
    if (formModel) {
      setEditarCicloFormModel(formModel);
    }
  }, [formModel]);

  useEffect(() => {
    // listLevelEjecutor();
    handleListLevelExecutor();
    // getPositionUserList();
    handleGetPositionUserList();
    // fetchSettings();
    handleGetSettings();
  }, []);

  return (
    <Drawer
      anchor="right"
      open={openCycleDetailsDrawer}
      onClose={handleCloseDrawer}
      PaperProps={{
        sx: {
          maxWidth: '700px', // Maximum width on all screens
          width: {
            sm: '70vw', // On 1280px width, make it 35vw
            md: '70vw', // On 1366px width, make it 38vw
            lg: '700px' // On 1920px width and above, make it 40vw
          }
        }
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography color="white" variant="h5" sx={{ flexGrow: 1 }}>
            {t('edit_cycle_and_responsibles')}
          </Typography>
          <IconButton edge="end" onClick={handleCloseDrawer} aria-label="close">
            <CloseIcon sx={{ color: 'white' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        <Box padding="16px">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            margin="10px 0"
          >
            <Box>
              <Box>
                {editarCicloFormModel !== null && (
                  <FormBuilder
                    showActionButton={false}
                    inputFields={editarCicloFormData}
                    initialValues={editarCicloFormModel}
                    controlled={true}
                    onChange={(id, value) => {
                      if (id === 'percentage') {
                        if ((parseInt(value) >= 0 && parseInt(value) <= 100) || value === '') {
                          setEditarCicloFormModel((prevState) => ({
                            ...prevState,
                            [id]: parseInt(value)
                          }));
                        }
                        return;
                      }
                      setEditarCicloFormModel((prevState) => ({ ...prevState, [id]: value }));
                    }}
                  />
                )}

                <Box margin="20px 0">
                  <Button
                    variant="contained"
                    size="large"
                    margin="10px 0"
                    onClick={handleUpdateLogtaskDetails}
                  >
                    {t('Save')}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
      <Modal open={openModalEditResp} onClose={() => setOpenModalEditResp(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h5" sx={{ marginBottom: '40px' }}>
            {editFormResp}
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ marginTop: '30px' }}
            onClick={() => setOpenModalEditResp(false)}
          >
            Ok
          </Button>
        </Box>
      </Modal>
    </Drawer>
  );
}

export default EditCycleDetailsDrawer;
