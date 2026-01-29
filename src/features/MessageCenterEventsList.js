import {
  AccessTime,
  ArrowForwardIosSharp,
  AttachFile,
  ChatBubble,
  DeleteForever,
  Edit,
  EditNote,
  ExpandMore,
  Forum,
  Person,
  Task
} from '@mui/icons-material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Pagination,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import TableComponent from '../components/TableComponent';
import TheFullPageLoader from '../components/TheFullPageLoader';
import { getActionLogtask } from '../stores/actions/getActionLogtaskSlice';
import { deleteLogtask } from '../stores/tasks/deleteLogtaskSlice';
import { fetchListTaskNew } from '../stores/tasks/fetchListTaskNewSlice';
import { fetchLogtaskList } from '../stores/tasks/fetchLogtaskListSlice';
import { getLogtaskDetails } from '../stores/tasks/getLogtaskDetailsSlice';
import { showErrorMsg } from '../utils/others';
import MessageCenterActionPlanDialog from './MessageCenterActionPlanDialog';
import EditActivityDetailsDrawer from './MessageCenterEventsList/EditActivityDetailsDrawer';
import EditCycleDetailsDrawer from './MessageCenterEventsList/EditCycleDetailsDrawer';
import EditEventDetailsDrawer from './MessageCenterEventsList/EditEventDetailsDrawer';
import EditResponsablesDrawer from './MessageCenterEventsList/EditResponsablesDrawer';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&::before': {
    display: 'none'
  }
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharp sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
  }
}));

function MessageCenterEventsList({ events }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [accordionExpanded, setAccordionExpanded] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [logtaskRows, setLogtaskRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [displayMoreButton, setDisplayMoreButton] = useState(false);
  const [openActivityDetailsDrawer, setOpenActivityDetailsDrawer] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCycleDetailsDrawer, setOpenCycleDetailsDrawer] = useState(false);
  const [openEditResponsablesDrawer, setOpenEditResponsablesDrawer] = useState(false);
  const [editCycleFormModel, setEditCycleFormModel] = useState({});
  const [openActionPlanModal, setOpenActionPlanModal] = useState(false);
  const [actionPlanData, setActionPlanData] = useState([]);
  const [openModalDeleteResp, setOpenModalDeleteResp] = useState(false);
  const [textModalDelete, setTextModalDelete] = useState(false);

  const shouldCreateNewAction = useSelector((state) => state.globalData.shouldCreateNewAction);

  const taskListLoading = useSelector((state) => state?.fetchListTaskNew?.loading ?? false);
  const logtaskListLoading = useSelector((state) => state?.fetchLogtaskList?.loading ?? false);

  const handleFetchListTaskNew = (currentPage) => {
    const formData = new FormData();
    formData.append('page', currentPage);
    dispatch(fetchListTaskNew(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        setTasks(data?.payload?.data);
        setNumberOfPages(data?.payload?.total_pages);
      } else {
        showErrorMsg(data?.payload);
      }
    });
  };

  const handleFetchLogtaskList = (taskId) => {
    dispatch(fetchLogtaskList({ task_id: taskId })).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const newLogtaskRows = data?.payload?.data.map((logtask) => ({
          id: parseInt(logtask.id),
          title: logtask.logtask_title,
          start_date: logtask.start_date,
          finish_date: logtask.end_date,
          action_plan: parseInt(logtask.actions_count),
          real_closing_date: logtask.real_closing_date,
          closing_opportunity: parseInt(logtask.closing_opportunity_days),
          progress: parseFloat(logtask.percentage),
          completed: logtask.complete !== 'NOT Completed'
        }));

        setLogtaskRows(newLogtaskRows);
      }
    });
  };

  const handleDeleteLogtask = (task_id) => {
    const formData = new FormData();
    formData.append('logtask_id', task_id);

    dispatch(deleteLogtask(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        setTextModalDelete(t('cycle_removed_successfully'));
      } else {
        setTextModalDelete(t('some_problem_elimination_cycle'));
      }
      setOpenModalDeleteResp(true);
    });
  };

  const handleGetLogtaskDetails = (taskId) => {
    const formData = new FormData();
    formData.append('logtask_id', taskId);
    dispatch(getLogtaskDetails(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const startDate = data?.payload?.data.start_date?.split(' ')[0];
        const endDate = data?.payload?.data.end_date?.split(' ')[0];
        setEditCycleFormModel({
          logtask_id: taskId,
          percentage: data?.payload?.data.percentage,
          real_closing_date: data?.payload?.data.real_closing_date,
          // completado: data?.payload?.data.completado,
          start_date: startDate,
          end_date: endDate
        });
      }
    });
  };

  let actionPlanIdCounter = 0;

  const handleGetActionLogtask = (task) => {
    const formData = new FormData();
    formData.append('logtask_id', task.id);
    dispatch(getActionLogtask(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const actionPlanData = data?.payload?.data.map((item) => ({
          ...item,
          id: actionPlanIdCounter++
        }));
        setActionPlanData(actionPlanData);
      }
    });
  };

  useEffect(() => {
    // fetchTasks(currentPage);
    handleFetchListTaskNew(currentPage);
  }, [currentPage]);

  const handleOpenEditDrawer = (logtask) => {
    setSelectedRow(logtask);
    setOpenEditDrawer(true);
  };

  const handleCloseEditDrawer = () => {
    setOpenEditDrawer(false);
    setTasks([]);
    // fetchTasks(currentPage);
    handleFetchListTaskNew(currentPage);
    setAccordionExpanded({});
  };

  const handleOpenCycleDetailsDrawer = (logtask) => {
    setSelectedRow(logtask);
    // getLogtaskDetails(logtask.id);
    handleGetLogtaskDetails(logtask?.id);
    setOpenCycleDetailsDrawer(true);
  };

  const handleCloseCycleDetailsDrawer = () => {
    setOpenCycleDetailsDrawer(false);
  };

  const handleOpenEditResponsablesDrawer = (task) => {
    setSelectedRow(task);
    setOpenEditResponsablesDrawer(true);
  };

  const handleCloseEditResponsablesDrawer = () => {
    setOpenEditResponsablesDrawer(false);
  };

  const handleOpenDeleteDialog = (logtask) => {
    setSelectedRow(logtask);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenActivityDrawer = (logtask) => {
    setSelectedRow(logtask);
    setOpenActivityDetailsDrawer(true);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenActionPlan = (logtask) => {
    setSelectedRow(logtask);
    setOpenActionPlanModal(true);
    // getActionPlan(logtask);
    handleGetActionLogtask(logtask);
  };

  const handleCLoseActionPlan = () => {
    setOpenActionPlanModal(false);
  };

  const handleOpenMoreButton = (event, task) => {
    handleOpenActivityDrawer(task);
  };

  const handleExpandAccordion = (event, index, task) => {
    event.stopPropagation();
    setAccordionExpanded({ [index]: !accordionExpanded[index] });
    // fetchLogTask(task.id);
    handleFetchLogtaskList(task?.id);
  };

  const handleDeleteCycle = () => {
    // deleteCycle(selectedRow.id);
    handleDeleteLogtask(selectedRow.id);
    setOpenDeleteDialog(false);
  };

  const handleOnDrawerOpened = () => {
    setSelectedRow([]);
  };

  const actionPlanTableColumns = [
    {
      field: 'ID',
      headerName: 'ID de la acción',
      width: 100,
      type: 'string'
    },
    {
      field: 'module_id',
      headerName: 'ID del módulo',
      width: 100,
      type: 'string'
    },
    {
      field: 'action_category',
      headerName: 'Categoría de la acción',
      width: 100,
      type: 'string'
    },
    {
      field: 'action_start_date',
      headerName: 'Fecha de inicio',
      width: 100,
      type: 'string'
    },
    {
      field: 'action_closing_date',
      headerName: 'Fecha propuesta de cierre',
      width: 100,
      type: 'string'
    },
    {
      field: 'action_status',
      headerName: 'Estado de la acción',
      width: 200,
      type: 'string'
    },
    {
      field: 'responsible_person',
      headerName: 'Responsable',
      width: 200,
      type: 'string'
    },
    {
      field: 'reviewer_person',
      headerName: 'Revisor',
      width: 200,
      type: 'string'
    },
    {
      field: 'real_closing_date',
      headerName: 'Fecha de cierre real',
      width: 200,
      type: 'string'
    },
    {
      field: 'why_description',
      headerName: 'Descripción de por qué',
      width: 200,
      type: 'string'
    },
    {
      field: 'what_description',
      headerName: 'Descripción de qué',
      width: 200,
      type: 'string'
    },
    {
      field: 'how_description',
      headerName: 'Descripción de cómo',
      width: 200,
      type: 'string'
    },
    {
      field: 'comment_count',
      headerName: 'Comentarios',
      width: 200,
      type: 'string'
    },
    {
      field: 'action_status',
      headerName: 'Estado',
      width: 200,
      type: 'string'
    }
  ];

  const tableColumns = [
    {
      field: 'actions',
      headerName: t('Actions'),
      width: 200,
      type: 'string',
      cellRenderer: (params) => {
        return (
          <Box>
            <Tooltip title={t('edit')}>
              <IconButton onClick={() => handleOpenCycleDetailsDrawer(params?.data)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('delete')}>
              <IconButton onClick={() => handleOpenDeleteDialog(params?.data)}>
                <DeleteForever />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('followups')}>
              <IconButton onClick={() => handleOpenEditDrawer(params?.data)}>
                <Forum />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('responsible')}>
              <IconButton onClick={() => handleOpenEditResponsablesDrawer(params?.data)}>
                <Person />
              </IconButton>
            </Tooltip>
          </Box>
        );
      }
    },
    { field: 'title', headerName: t('title'), width: 180, type: 'string' },
    { field: 'start_date', headerName: t('ExpectedStartDate'), width: 150, type: 'string' },
    { field: 'finish_date', headerName: t('end_date'), width: 150, type: 'string' },
    {
      field: 'action_plan',
      headerName: t('action_plan'),
      width: 120,
      type: 'string',
      cellRenderer: (params) => {
        return (
          <Button
            variant="outlined"
            startIcon={<ChatBubble />}
            color="primary"
            onClick={() => handleOpenActionPlan(params.data)}
          >
            {params.value}
          </Button>
        );
      }
    },
    { field: 'real_closing_date', headerName: t('ActualClosingDate'), width: 150, type: 'string' },
    {
      field: 'closing_opportunity',
      headerName: t('opportunity_for_closure'),
      width: 150,
      type: 'string'
    },
    { field: 'progress', headerName: t('progress'), width: 80, type: 'string' },
    { field: 'completed', headerName: t('Completed'), width: 80, type: 'boolean' }
  ];

  return (
    <>
      {taskListLoading ? (
        <Box
          sx={{
            width: '100%',
            height: '41rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TheFullPageLoader loaderText="" background="transparent" />
        </Box>
      ) : (
        <Box margin="10px">
          {tasks && tasks.length > 0 && (
            <>
              {tasks.map((task, index) => {
                const date = new Date(task.task_end_date);
                const formattedDate = `${date.getDate()} ${date.toLocaleDateString('default', { month: 'short' })}, ${date.getFullYear()}`;

                return (
                  <Accordion
                    expanded={accordionExpanded[index] || false}
                    style={{ cursor: 'default', '&:hover': { cursor: 'default' } }}
                    key={index}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMore
                          fontSize="large"
                          style={{
                            cursor: 'pointer',
                            '&:hover': { cursor: 'pointer' }
                          }}
                          onClick={(event) => handleExpandAccordion(event, index, task)}
                        />
                      }
                      style={{ cursor: 'default', '&:hover': { cursor: 'default' } }}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <Box sx={{ width: '70%' }}>
                          <Box display="flex" alignItems="center" gap={1} margin="5px 0">
                            <Task />
                            <Typography variant="body2">{task.task_title}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1} margin="5px 0">
                            <Person color="primary" />
                            <Typography variant="body2" color="primary">
                              <Tooltip title="Responsables" arrow>
                                {Object.entries(task.responsibles).map(
                                  ([key, responsible], index) => responsible
                                )}
                              </Tooltip>
                              <Tooltip title="Revisores" arrow>
                                |{' '}
                                {Object.entries(task.reviewers).map(
                                  ([key, reviewer], index) => reviewer
                                )}
                              </Tooltip>
                              {/* // TODO: Add circle avatar for each responsible and reviewer if there are > 3 */}
                            </Typography>
                            <Tooltip title={t('created_by')} arrow>
                              <Chip label="superAdmin" color="primary" size="small" />
                            </Tooltip>
                          </Box>
                          <Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <AccessTime />
                                <Typography variant="body2" color="textSecondary">
                                  {formattedDate}
                                </Typography>
                              </Box>
                              <Box display="flex" gap={1}>
                                <Tooltip title="comentarios" arrow>
                                  <Box display="flex" alignItems="center">
                                    <Forum style={{ marginRight: '5px' }} />
                                    <Typography variant="body2" color="textSecondary">
                                      {parseInt(task.comment_count)}
                                    </Typography>
                                  </Box>
                                </Tooltip>
                                <Box display="flex" alignItems="center">
                                  <AttachFile />
                                  <Typography variant="body2" color="textSecondary">
                                    17
                                  </Typography>
                                </Box>
                              </Box>
                              <Box display="flex" gap={0.3}>
                                <Tooltip title={t('tags')} arrow>
                                  {Object.entries(task.tags).map(([key, tagObject], index) => (
                                    <Chip
                                      key={key}
                                      label={tagObject.tag_name}
                                      size="small"
                                      color="warning"
                                    />
                                  ))}
                                </Tooltip>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ width: '25%', mr: 1 }}>
                          <Box>
                            <BorderLinearProgress variant="determinate" value={Number(task.progress)} />
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Typography variant="body2" color="textSecondary">
                                {parseInt(task.progress)}% {t('of')} 100%
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {formattedDate}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Tooltip title="Editar Actividad" arrow>
                          <Box sx={{ width: '5%' }}>
                            <IconButton onClick={(event) => handleOpenMoreButton(event, task)}>
                              <EditNote />
                            </IconButton>
                          </Box>
                        </Tooltip>
                      </Box>
                    </AccordionSummary>
                    {accordionExpanded[index] && (
                      <AccordionDetails>
                        <Box display="flex" justifyContent="space-between">
                          <Box margin="10px 0">
                            <TextField label="Buscar" variant="outlined" size="small" />
                          </Box>
                        </Box>
                        <Box>
                          <TableComponent
                            rowData={logtaskRows}
                            columnDefs={tableColumns}
                            pageOption={[10, 25, 50, 100]}
                            isLoading={logtaskListLoading}
                          />
                          {/* {logtaskRows.length > 0 ? (
                            <>
                              <TableComponent
                                rowData={logtaskRows}
                                columnDefs={tableColumns}
                                pageOption={[10, 25, 50, 100]}
                              />
                              <DataGrid
                                key={index}
                                rows={logtaskRows}
                                columns={tableColumns}
                                getRowId={(row) => row.id}
                                initialState={{
                                  pagination: {
                                    paginationModel: { page: 0, pageSize: 10 }
                                  }
                                }}
                                pageSizeOptions={[10, 25, 50, 100]}
                              />
                            </>
                          ) : (
                            <h1>{t('no_data_to_show')}</h1>
                          )} */}
                        </Box>
                      </AccordionDetails>
                    )}
                  </Accordion>
                );
              })}
              <Box display="flex" justifyContent="center" alignItems="center" margin="20px 0">
                <Pagination
                  count={numberOfPages}
                  color="warning"
                  page={currentPage}
                  onChange={handlePageChange}
                />
              </Box>
            </>
          )}
          {Object.keys(selectedRow).length > 0 && (
            <EditEventDetailsDrawer
              openEditDrawer={openEditDrawer}
              onCloseEditDrawer={handleCloseEditDrawer}
              logTaskDetails={selectedRow}
              onDrawerOpened={handleOnDrawerOpened}
            />
          )}
          {Object.keys(selectedRow).length > 0 && (
            <EditActivityDetailsDrawer
              openActivityDetailsDrawer={openActivityDetailsDrawer}
              onCloseActivityDetailsDrawer={() => setOpenActivityDetailsDrawer(false)}
              taskDetails={selectedRow}
            />
          )}

          {openCycleDetailsDrawer && (
            <EditCycleDetailsDrawer
              openCycleDetailsDrawer={openCycleDetailsDrawer}
              onCloseCycleDetailsDrawer={handleCloseCycleDetailsDrawer}
              taskDetails={selectedRow}
              formModel={editCycleFormModel}
              onDrawerOpened={handleOnDrawerOpened}
              onCloseEditDrawer={handleCloseEditDrawer}
            />
          )}

          {openEditResponsablesDrawer && (
            <EditResponsablesDrawer
              openEditResponsablesDrawer={openEditResponsablesDrawer}
              onCloseEditResponsablesDrawer={handleCloseEditResponsablesDrawer}
              taskDetails={selectedRow}
            />
          )}
          <Menu
            id="more-button-menu"
            anchorEl={displayMoreButton}
            open={Boolean(displayMoreButton)}
            onClose={() => setDisplayMoreButton(false)}
          >
            <MenuItem onClick={() => handleOpenActivityDrawer()}>{t('edit_activity')}</MenuItem>
            <MenuItem onClick={() => {}}>Menu item 2</MenuItem>
            <MenuItem onClick={() => {}}>Menu item 3</MenuItem>
          </Menu>

          <Dialog
            open={openActionPlanModal}
            onClose={handleCLoseActionPlan}
            PaperProps={{
              style: {
                height: '90%',
                width: '100vw'
              }
            }}
            fullWidth={true}
            maxWidth={'xl'}
          >
            <DialogContent>
              {/* <Box marginBottom='20px'>
            <Typography variant="h4" align="center">
              Plan de Acción
            </Typography>
            <DataGrid
              rows={actionPlanData}
              columns={actionPlanTableColumns}
              hideFooter={true}
              autoHeight={true}
            />
          </Box>
          <Button
            variant="contained"
            color="warning"
            size="large"
            marginTop='40px'
            onClick={() => dispatch(toggleShouldCreateNewAction({ status: true }))}
          >
            + {t('createAction')}
          </Button> */}
              <MessageCenterActionPlanDialog task={selectedRow.id} />
            </DialogContent>
          </Dialog>

          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <Box display="flex" justifyContent="center" alignItems="center">
                <HighlightOffIcon
                  color="error"
                  sx={{ fontSize: 80 }}
                  margin="10px 0"
                  align="center"
                />
              </Box>
              <Typography variant="h4" align="center">
                {t('are_you_sure_you_want_to_remove_this_cycle')}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                padding="5px 20px"
                alignItems="center"
              >
                <Button
                  size="large"
                  variant="outlined"
                  onClick={handleCloseDeleteDialog}
                  color="primary"
                >
                  {t('Cancel')}
                </Button>
                {/* <Button size="large" variant="contained">
              Borrado Suave
            </Button> */}
                <Button size="large" color="error" variant="contained" onClick={handleDeleteCycle}>
                  {t('soft_delete')}
                </Button>
              </Box>
            </DialogActions>
          </Dialog>
          <Modal open={openModalDeleteResp} onClose={() => setOpenModalDeleteResp(false)}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4
              }}
            >
              <Typography variant="h5" sx={{ marginBottom: '40px' }}>
                {textModalDelete}
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{ marginTop: '30px' }}
                onClick={() => setOpenModalDeleteResp(false)}
              >
                Ok
              </Button>
            </Box>
          </Modal>
        </Box>
      )}
    </>
  );
}

export default MessageCenterEventsList;
