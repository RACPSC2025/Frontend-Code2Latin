import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Modal,
  Tab,
  Tabs,
  Toolbar,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import FormBuilder from '../../components/FormBuilder';
import TagsSelector from '../../components/Input/TagsSelector';
import TableComponent from '../../components/TableComponent';
import { fetchListLevelExecutor } from '../../stores/tasks/fetchListLevelExecutorSlice';
import { getResponsibles } from '../../stores/tasks/getResponsiblesSlice';
import { updateResponsibles } from '../../stores/tasks/updateResponsiblesSlice';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function EditResponsablesDrawer({
  openEditResponsablesDrawer,
  onCloseEditResponsablesDrawer,
  taskDetails,
  formModel
}) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [responsables, setResponsables] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [errorEditResponsable, setErrorResponsableForm] = useState(false);
  const [levelEjecutor, setLevelEjecutor] = useState([]);
  const [positionUserList, setPositionUserList] = useState([]);
  const [editarResponsablesFormModel, setEditarResponsablesFormModel] = useState({});
  const [executor, setExecutor] = useState([]);
  const [reviewer, setReviewer] = useState([]);
  const [settings, setSettings] = useState({});
  const [editFormResp, setEditFormResp] = useState('');
  const [openModalEditResp, setOpenModalEditResp] = useState(false);

  const handleGetResponsibles = () => {
    const formData = new FormData();
    formData.append('logtask_id', taskDetails.id);
    formData.append('responsable_type', 1);
    dispatch(getResponsibles(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        setResponsables(data?.payload?.data);
      }
    });
  };

  const handleGetReviewers = () => {
    const formData = new FormData();
    formData.append('logtask_id', taskDetails.id);
    formData.append('responsable_type', 2);
    dispatch(getResponsibles(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        setReviewers(data?.payload?.data);
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

  const tableColumns = [
    {
      field: 'id',
      headerName: i18n.language === 'es' ? 'ID' : 'ID',
      type: 'string',
      flex: 1,
      minWidth: 70,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'NAME',
      headerName: i18n.language === 'es' ? 'Nombre' : 'Name',
      type: 'string',
      flex: 1,
      minWidth: 190,
      maxWidth: 250,
      headerAlign: 'left',
      align: 'left'
    },
    {
      field: 'id_administradores',
      headerName: i18n.language === 'es' ? 'ID administrador' : 'Admin ID',
      type: 'string',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center'
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

  useEffect(() => {
    handleGetResponsibles();
    handleGetReviewers();
    handleListLevelExecutor();
  }, [taskDetails]);

  useEffect(() => {
    handleGetResponsibles();
  }, []);

  return (
    <Drawer
      anchor="right"
      open={openEditResponsablesDrawer}
      onClose={onCloseEditResponsablesDrawer}
      PaperProps={{
        sx: {
          width: {
            sm: '70vw',
            md: '60vw',
            lg: '50vw'
          },
          maxWidth: '700px'
        }
      }}
    >
      <AppBar
        position="static"
        sx={{
          bgcolor: 'primary.main',
          boxShadow: 'none'
        }}
      >
        <Toolbar>
          <Typography
            color="white"
            variant="h6"
            sx={{
              flexGrow: 1,
              fontSize: '1.25rem',
              fontWeight: 500
            }}
          >
            {t('list_of_subtask_managers')}
          </Typography>
          <IconButton
            edge="end"
            onClick={onCloseEditResponsablesDrawer}
            aria-label="close"
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main'
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'rgba(0, 0, 0, 0.7)',
              '&.Mui-selected': {
                color: 'primary.main'
              }
            }
          }}
        >
          <Tab label={t('responsible')} />
          <Tab label={t('edit_responsible')} />
        </Tabs>

        <Box sx={{ height: 'calc(100vh - 112px)', overflow: 'auto' }}>
          <TabPanel value={tabValue} index={0}>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.87)'
                }}
              >
                {t('implementers')}
              </Typography>
              <TableComponent rowData={responsables} columnDefs={tableColumns} pagination={false} />
              {/* <DataGrid
                rows={responsables}
                columns={tableColumns}
                hideFooter={true}
                autoHeight
                sx={{
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: 2,
                  '& .MuiDataGrid-cell': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    fontSize: '0.875rem',
                    py: 1
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    borderBottom: '2px solid rgba(0, 0, 0, 0.12)',
                    '& .MuiDataGrid-columnHeader': {
                      '&:focus': {
                        outline: 'none'
                      }
                    }
                  },
                  '& .MuiDataGrid-row': {
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }
                }}
              /> */}

              <Typography
                variant="h6"
                sx={{
                  mt: 3,
                  mb: 2,
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.87)'
                }}
              >
                {t('review_officers')}
              </Typography>
              <TableComponent rowData={reviewers} columnDefs={tableColumns} pagination={false} />
              {/* <DataGrid
                rows={reviewers}
                columns={tableColumns}
                hideFooter={true}
                autoHeight
                sx={{
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: 2,
                  '& .MuiDataGrid-cell': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    fontSize: '0.875rem',
                    py: 1
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    borderBottom: '2px solid rgba(0, 0, 0, 0.12)',
                    '& .MuiDataGrid-columnHeader': {
                      '&:focus': {
                        outline: 'none'
                      }
                    }
                  },
                  '& .MuiDataGrid-row': {
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }
                }}
              /> */}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box>
              {errorEditResponsable && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {t('please_complete_all_required_fields')}
                </Alert>
              )}

              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: 'rgba(20, 184, 166, 0.05)',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'primary.light'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <InfoOutlinedIcon color="primary" />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: 'primary.main'
                    }}
                  >
                    {i18n.language === 'es' ? 'Instrucción' : 'Instruction'}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(0, 0, 0, 0.7)',
                    lineHeight: 1.5
                  }}
                >
                  {i18n.language === 'es'
                    ? 'Por favor selecciona la estructura funcional y asigna las personas responsables.'
                    : 'Please select the functional structure and assign the responsible persons.'}
                </Typography>
              </Box>

              <Box sx={{ '& > *:not(:last-child)': { mb: 1.5 } }}>
                <FormBuilder
                  showActionButton={false}
                  inputFields={editarResponsablesFormData.slice(0, 1)}
                  initialValues={editarResponsablesFormModel}
                  controlled={true}
                  onChange={(id, value) => {
                    setEditarResponsablesFormModel((prevState) => ({
                      ...prevState,
                      [id]: value
                    }));
                  }}
                />

                {settings[0]?.setting_value === 'TRUE' && reviewer.length > 0 ? (
                  <TagsSelector
                    onTagsChange={handleExecutorSelection}
                    listOfTags={executor}
                    placeholder={t('select_responsible_execution')}
                  />
                ) : (
                  <FormBuilder
                    showActionButton={false}
                    inputFields={editarResponsablesFormData.slice(1, 2)}
                    initialValues={editarResponsablesFormModel}
                    controlled={true}
                    onChange={(id, value) => {
                      setEditarResponsablesFormModel((prevState) => ({
                        ...prevState,
                        [id]: value
                      }));
                    }}
                  />
                )}

                {settings[1]?.setting_value === 'TRUE' && reviewer.length > 0 ? (
                  <TagsSelector
                    onTagsChange={handleReviewerSelection}
                    listOfTags={reviewer}
                    placeholder={t('select_responsible_validation')}
                  />
                ) : (
                  <FormBuilder
                    showActionButton={false}
                    inputFields={editarResponsablesFormData.slice(2)}
                    initialValues={editarResponsablesFormModel}
                    controlled={true}
                    onChange={(id, value) => {
                      setEditarResponsablesFormModel((prevState) => ({
                        ...prevState,
                        [id]: value
                      }));
                    }}
                  />
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleUpdateResponsibles}
                    sx={{
                      color: 'white',
                      width: 'auto',
                      minWidth: '150px',
                      py: 1.5,
                      px: 4
                    }}
                  >
                    {t('Save')}
                  </Button>
                </Box>
              </Box>
            </Box>
          </TabPanel>
        </Box>
      </Box>

      <Modal open={openModalEditResp} onClose={() => setOpenModalEditResp(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              fontSize: '1.25rem',
              fontWeight: 500
            }}
          >
            {editFormResp}
          </Typography>
          <Button variant="contained" size="large" onClick={() => setOpenModalEditResp(false)}>
            Ok
          </Button>
        </Box>
      </Modal>
    </Drawer>
  );
}

export default EditResponsablesDrawer;
