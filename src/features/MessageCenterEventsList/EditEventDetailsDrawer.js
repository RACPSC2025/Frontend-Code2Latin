import { AccessTime, InsertDriveFile, MoreVert, TaskAlt } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Drawer,
  IconButton,
  Link,
  Modal,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FormBuilder from '../../components/FormBuilder';
import axiosInstance from '../../lib/axios';
import { useLanguage } from '../../providers/languageProvider';
import { uploadCommentAttachments } from '../../stores/actions/uploadCommentAttachmentsSlice';
import { showErrorMsg, showSuccessMsg } from '../../utils/others';
import { useDispatch, useSelector } from 'react-redux';
import AttachmentViewer from './AttachmentViewer';

import {
  fetchListOfUsers,
  fetchRegions,
  fetchUserDetails,
  setActiveModule
} from '../../stores/globalDataSlice';
//} from '../stores/globalDataSlice';

// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function EditEventDetailsDrawer({
  openEditDrawer,
  onCloseEditDrawer,
  logTaskDetails,
  onDrawerOpened
}) {
  const dispatch = useDispatch();
  const [selectedFile, setSezlectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [openCollapseActualizar, setOpenCollapseActualizar] = useState(false);
  const [openCollapseSeguimiento, setOpenCollapseSeguimiento] = useState(true);
  const [tabValue, setTabValue] = useState('comentarios');
  const [logtaskExecutedComments, setLogtaskExecutedComments] = useState([]);
  const [logtaskRevisorComments, setLogtaskRevisorComments] = useState([]);
  const [isLoading, setIsLoading] = useState('loading');
  const [openModal, setOpenModal] = useState(false);
  const [openModalEjecutor, setOpenModalEjecutor] = useState(false);
  const [addCommentForm, setAddCommentForm] = useState([]);
  const [commentExecutedAttachments, setCommentExecutedAttachments] = useState([]);
  const [commentRevisorAttachments, setCommentRevisorAttachments] = useState([]);
  const [progresoModel, setProgresoModel] = useState({
    progreso: logTaskDetails.progress,
    progreso_id: null
  });
  const [openModalConfirmation, setOpenModalConfirmation] = useState(false);
  const [commentConfirmation, setCommentConfirmation] = useState('');
  const [openModalCommentConfirmation, setOpenModalCommentConfirmation] = useState(false);
  const [isExecutor, setIsExecutor] = useState(true);
  const [errorCommentForm, setErrorCommentForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditCommentModal, setOpenEditCommentModal] = useState(false);
  const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [deleteCommentResponse, setDeleteCommentReponse] = useState('');
  const [updateProgressErrors, setUpdateProgressErrors] = useState(false);
  const [progressUpdated, setProgressUpdated] = useState(false);
  const [openAttachmentModal, setOpenAttachmentModal] = useState(false);
  const [commentType, setCommentType] = useState('');
  const [attachmentComment, setAttachmentComment] = useState('');
  const menuEditOpen = Boolean(anchorEl);
  const API_URL = process.env.REACT_APP_API_URL;
  //const [userData, setUserData] = useState(null);
  const userData = useSelector((state) => state.globalData.userDetails);


  const UPLOADS_URL = `${API_URL}uploads/registros/tasklegal/`;

  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      progreso: progresoModel.progreso || ''
    }
  });

  const { language } = useLanguage();
  const locale = language === 'en' ? 'en-US' : 'es-ES';

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  /*
  useEffect(() => {
    dispatch(fetchUserDetails('userId')).then((result) => {
      console.log('fetchUserDetails result:', result);
      console.log('User Details:', result.payload);
      setUserData(result.payload);
    });
    dispatch(fetchRegions());
  }, [dispatch]);
  */
  
  const attachImageToComment = async (logtaskId, commentId, file) => {
    try {
      const formData = new FormData();

      // IDs obligatorios
      formData.append("logtask_id", logtaskId);
      formData.append("comment_id", commentId);

      // Ruta donde se guardará
      //formData.append("full_path", "uploads/registros/task");
      //formData.append("full_path", "");
      formData.append("full_path", `${logtaskId}/${commentId}`);

      // Archivo: el backend espera un array "imagefiles[]"
      formData.append("imagefiles[]", file);
      
      const response = await axiosInstance.post(
        //"tasklist_api/add_comment_ajax",
        "task/add_comment_ajax_messagecenter",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error uploading attachment: ", error);
      return [];
    }
  };

  const handleSelectImage = (event) => {
    const file = event.target.files[0];
    setAttachmentComment(file);

    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUploadAttachment =  (selectedComment) => {
    //console.log('Uploading attachment for comment ID:', selectedComment);
    console.log('Uploading attachment for comment ID:');
    console.log('comment ID:', selectedComment.comment_id);
    //console.log('logTaskDetails:', logTaskDetails);
    console.log('logtask ID: ', logTaskDetails.id);
    if (attachmentComment) {
      //handleUploadComments(selectedComment, attachmentComment);
      attachImageToComment(logTaskDetails.id, selectedComment.comment_id, attachmentComment);
      setOpenAttachmentModal(false);
      setPreviewUrl(null);
      // Actualiza la lista de comentarios después de la carga
      setLogtaskExecutedComments([]);
      setLogtaskRevisorComments([]);
      fetchLogtaskComments(logTaskDetails.id);
    }
  };


  const handleMenuEditCommentOpen = (event, comment) => {
    setSelectedComment(comment);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuEditCommentClose = () => {
    setAnchorEl(null);
  };

  const handleOpenAttachmentModal = (comment_id) => {
    console.log('comment_id of handleOpenAttachmentModal', comment_id);
    setOpenAttachmentModal(true);
    setSelectedComment(comment_id);
  };

  const handleUploadComments = (comment_id, file) => {
    const formData = new FormData();
    formData.append('comment_id', comment_id);
    formData.append('imagefiles[]', file);
    /*
    dispatch(uploadCommentAttachments(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        showSuccessMsg(data?.payload?.messages);
      } else {
        showErrorMsg(data?.payload?.messages);
      }
    });
    */
  };

  const handleCloseAttachmentModal = () => {
    setOpenAttachmentModal(false);
    setAttachmentComment('');
    setPreviewUrl(null);
  };

  const handleOpenEditCommentModal = () => {
    setAddCommentForm((prevState) => ({
      ...prevState,
      comment: selectedComment.comment,
      sharepoint_link: selectedComment.sharepoint_link
    }));
    setAnchorEl(false);
    setOpenEditCommentModal(true);
  };

  const handleCloseEditCommentModal = () => {
    setOpenEditCommentModal(false);
  };

  const handleOpenDeleteCommentDialog = () => {
    setOpenDeleteCommentDialog(true);
  };

  const handleCloseDeleteCommentDialog = () => {
    setOpenDeleteCommentDialog(false);
  };

  const fetchUserName = async (user_id) => {
    try {
      const response = await axiosInstance.post(`/tasklist_api/list_administradores/`);
      const filteredId = response.data.data.filter(
        (user) => parseInt(user.value) === parseInt(user_id)
      );
      return filteredId[0].label;
    } catch (error) {
      console.error('Error fetching user name ', error);
      return [];
    }
  };

  useEffect(() => {}, [logtaskRevisorComments]);

  /*
  const getExecutedComments = async (logtask_id) => {
    try {
      let formData = new FormData();
      formData.append('comment_type', 'executed');
      const response = await axiosInstance.post(
        `/tasklist_api/get_logtask_comments/${logtask_id}`,
        formData
      );
      console.log('responseComments', response.data);
      for (const comment of response.data.data) {
        const userName = await fetchUserName(comment.user_id);
        const attachments = await fetchCommentsAttachments(comment.id);
        attachments.map((attachment) => {
          setCommentExecutedAttachments((prevAttachments) => [
            ...prevAttachments,
            {
              path: `${API_URL}${attachment.file_name}`
            }
          ]);
        });
        setLogtaskExecutedComments((prevComments) => [
          ...prevComments,
          {
            user_id: comment.user_id,
            comment: comment.comment,
            created: comment.created,
            userName: userName,
            comment_id: comment.id,
            attachment: attachments
          }
        ]);
      }
      setIsLoading('loaded');
    } catch (error) {
      console.error('Error fetching logtask comments ', error);
      setIsLoading('error');
      return [];
    }
  };
  */

  const getExecutedComments = async (logtask_id) => {
    try {
      let formData = new FormData();
      formData.append("comment_type", "executed");

      const response = await axiosInstance.post(
        `/tasklist_api/get_logtask_comments/${logtask_id}`,
        formData
      );

      console.log("responseComments", response.data);

      for (const comment of response.data.data) {
        const userName = await fetchUserName(comment.user_id);
        const attachmentsResponse = await fetchCommentsAttachments(comment.id);

        // attachmentsResponse ya es el array de adjuntos
        const attachments = Array.isArray(attachmentsResponse) ? attachmentsResponse : [];
        console.log("attachments for comment ", comment.id, ": ", attachments);

        setLogtaskExecutedComments((prevComments) => [
          ...prevComments,
          {
            user_id: comment.user_id,
            comment: comment.comment,
            created: comment.created,
            userName: userName,
            comment_id: comment.id,
            attachment: attachments,
          },
        ]);
      }

      setIsLoading("loaded");
    } catch (error) {
      console.error("Error fetching logtask comments ", error);
      setIsLoading("error");
      return [];
    }
  };

  const getRevisorComments = async (logtask_id) => {
    try {
      let formData = new FormData();
      formData.append("comment_type", "revisor");

      const response = await axiosInstance.post(
        `/tasklist_api/get_logtask_comments/${logtask_id}`,
        formData
      );

      console.log("responseCommentsReview", response.data);

      for (const comment of response.data.data) {
        const userName = await fetchUserName(comment.user_id);
        const attachmentsResponse = await fetchCommentsAttachments(comment.id);

        // Usar el array directamente, igual que en ejecutor
        const attachments = Array.isArray(attachmentsResponse) ? attachmentsResponse : [];

        setLogtaskRevisorComments((prevComments) => [
          ...prevComments,
          {
            user_id: comment.user_id,
            comment: comment.comment,
            created: comment.created,
            userName: userName,
            comment_id: comment.id,
            attachment: attachments,
          },
        ]);
      }

      setIsLoading("loaded");
    } catch (error) {
      console.error("Error fetching logtask comments ", error);
      setIsLoading("error");
      return [];
    }
  };

  const fetchLogtaskComments = async (logtask_id) => {
    setCommentExecutedAttachments([]);
    setCommentRevisorAttachments([]);
    await getExecutedComments(logtask_id);
    await getRevisorComments(logtask_id);
  };

  const fetchCommentsAttachments = async (comment_id) => {
    const formData = new FormData();
    formData.append('logtask_comment_id', comment_id);
    // formData.append('comment_type', 'hs_action');
    // formData.append('action_id', 1);
    try {
      // const response = await axiosInstance.post(`message_center_api/action_api/list_comments_attachment`, formData);
      //const response = await axiosInstance.post('/tasklist_api/get_comment_attachments', formData);
      const response = await axiosInstance.post('/tasklist_api/get_comment_attachments_messagecenter', formData);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching comment attachments ', error);
      return [];
    }
  };

  const fetchDeleteLogtaskComment = async (comment_id) => {
    const formData = new FormData();
    formData.append('comment_id', comment_id);
    try {
      const response = await axiosInstance.post('/tasklist_api/delete_logtask_comment', formData);
      setDeleteCommentReponse(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error deleting comment ', error);
      setDeleteCommentReponse(error);
      return error;
    }
  };

  useEffect(() => {
    setIsLoading('loading');
    setLogtaskExecutedComments([]);
    setLogtaskRevisorComments([]);
    // fetchLogtaskComments(logTaskDetails.id);
  }, []);

  useEffect(() => {
    if (logTaskDetails.length === 0) return;
    console.log('logTaskDetails', logTaskDetails);
    setIsLoading('loading');
    setLogtaskExecutedComments([]);
    setLogtaskRevisorComments([]);
    fetchLogtaskComments(logTaskDetails.id);
  }, [logTaskDetails]);

  const handleTabChange = (event, newValue) => {
    const validTabs = ['legalMatrix', 'events', 'actions'];
    if (validTabs.includes(newValue)) {
      setTabValue(newValue);
    }
  };

  const handleDeleteComment = async (comment_id) => {
    fetchDeleteLogtaskComment(comment_id);
    // TODO: update list of comments
    setAnchorEl(false);
    setLogtaskExecutedComments([]);
    setLogtaskRevisorComments([]);
    fetchLogtaskComments(logTaskDetails.id);
    setOpenDeleteCommentDialog(false);
  };

  const handleAgregarComentario = () => {
    setOpenModal(true);
  };

  const handleAgregarComentarioEjecutor = () => {
    setOpenModalEjecutor(true);
  };

  const handleCloseModalEjecutor = () => {
    setOpenModalEjecutor(false);
  };

  const handleCommentConfirmation = (executor) => {
    addCommentForm.comment_type =
      addCommentForm.type === 1 ? setCommentType('executed') : setCommentType('revisor');
    if (!!!addCommentForm?.comment?.trim() || !(addCommentForm?.type > 0)) {
      setErrorCommentForm(true);
      return;
    }
    setOpenModal(false);
    setOpenModalEjecutor(false);
    setIsExecutor(executor);
    setOpenModalConfirmation(true);
    setErrorCommentForm(false);
  };

  const handleCloseModalConfirmation = () => {
    setOpenModalConfirmation(false);
  };

  const handleCloseModalCommentConfirmation = () => {
    setOpenModalCommentConfirmation(false);
  };

  const actualizarProgresoFormData = [
    {
      id: 'progreso',
      label: t('progress'),
      type: 'text',
      defaultValue: '0.0'
    }
  ];

  // comment_type: 'executed' | 'revisor'
  const postComment = async (comment) => {
    console.log('user_id: ', userData);
    console.log('user_id: ', userData.id_administradores);
    console.log('Posting comment: ', comment);
    console.log('comment_type: ', commentType);
    
    try {
      const formData = new FormData();
      formData.append('comment', comment.comment);
      formData.append('sharepoint_link', comment.sharepoint_link);
      formData.append('logtask_id', comment.logtask_id);
      //formData.append('comment_type', comment.comment_type);
      formData.append('comment_type', commentType);
      formData.append('user_id', userData.id_administradores);
      formData.append('user_name', userData.fullname);
      const response = await axiosInstance.post('tasklist_api/add_logtask_comments_messagecenter', formData);
      return response.data;
    } catch (error) {
      console.error('Error posting comment ', error);
      return [];
    }
    
  };

  const updateComment = async (comment) => {
    const formData = new FormData();
    formData.append('comment_id', comment.comment_id);
    formData.append('sharepoint_link', addCommentForm.sharepoint_link);
    formData.append('comment', addCommentForm.comment);
    try {
      const response = await axiosInstance.post('tasklist_api/edit_logtask_comment', formData);
      setLogtaskExecutedComments([]);
      setLogtaskRevisorComments([]);
      fetchLogtaskComments(logTaskDetails.id);
      setOpenEditCommentModal(false);
      return response.data;
    } catch (error) {
      console.error('Error updating comment ', error);
    }
  };

  const handleAddReviewerComment = () => {
    const formDetails = {
      comment: addCommentForm.comment,
      sharepoint_link: addCommentForm.sharepoint_link,
      logtask_id: logTaskDetails.id,
      comment_type: 'revisor'
    };

    postComment(formDetails);
    setOpenModal(false);
  };

  const handleAddEjecutorComment = async () => {
    setOpenModalConfirmation(false);
    const formDetails = {
      comment: addCommentForm.comment,
      sharepoint_link: addCommentForm.sharepoint_link,
      logtask_id: logTaskDetails.id,
      comment_type: 'executed'
    };
    let resp = await postComment(formDetails);

    if (resp.status) {
      setCommentConfirmation(t('comment_created_successfully'));
    } else {
      setCommentConfirmation(t('could_not_create_comment'));
    }
    setLogtaskExecutedComments([]);
    setLogtaskRevisorComments([]);
    fetchLogtaskComments(logTaskDetails.id);
    setOpenModalCommentConfirmation(true);
  };

  const handleCloseEditDrawer = () => {
    onCloseEditDrawer();
    setUpdateProgressErrors(false);
    setProgressUpdated(false);
    setLogtaskExecutedComments([]);
    setLogtaskRevisorComments([]);
    onDrawerOpened();
    // logTaskDetails = [];
  };

  const updateProgress = async (percentage) => {
    const formData = new FormData();
    formData.append('logtask_id', logTaskDetails.id);
    formData.append('percentage', parseInt(percentage));
    try {
      const response = await axiosInstance.post('tasklist_api/update_logtask_progress', formData);
      setProgressUpdated(true);
      return response.data.data;
    } catch (error) {
      console.error('Error updating progress: ', error);
      setUpdateProgressErrors(true);
    }
  };

  const handleUpdateProgress = (data) => {
    setProgressUpdated(false);
    if (
      progresoModel.progreso === '' ||
      progresoModel.progreso < 0 ||
      progresoModel.progreso > 100
    ) {
      setUpdateProgressErrors(true);
    } else {
      setUpdateProgressErrors(false);
      updateProgress(progresoModel.progreso);
    }
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

  const typeComment = [
    {
      value: 1,
      label: t('Executioner')
    },
    {
      value: 2,
      label: t('Reviewer')
    }
  ];

  const addCommentFormData = [
    {
      id: 'comment',
      label: t('comment'),
      type: 'textarea',
      defaultValue: ''
    },
    {
      id: 'sharepoint_link',
      label: t('sharepoint_link'),
      type: 'text',
      defaultValue: ''
    },
    {
      id: 'type',
      label: t('add_comment_like'),
      type: 'dropdown',
      defaultValue: '',
      options: typeComment
    },{
      id: "progress",
      label: t("progress"),
      type: "progress",
      defaultValue: Math.min(100, Math.max(0, parseInt(logTaskDetails.progress ?? 0, 10))),
      required: false,
      disabled: parseInt(logTaskDetails.progress ?? 0, 10) === 100
    }
  ];

  const formatDate = (date) => {
    const fechaObj = new Date(date);

    return `${fechaObj.getDate()} ${fechaObj.toLocaleDateString('default', { month: 'short' })}, ${fechaObj.getFullYear()}`;
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={openEditDrawer}
        onClose={handleCloseEditDrawer}
        PaperProps={{
          sx: {
            maxWidth: '700px', // Maximum width on all screens
            width: {
              sm: '50vw', // On 1280px width, make it 35vw
              md: '40vw', // On 1366px width, make it 38vw
              lg: '700px' // On 1920px width and above, make it 40vw
            }
          }
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography color="white" variant="h5" sx={{ flexGrow: 1 }}>
              {t('edit_details_of_the_activity')}
            </Typography>
            <IconButton edge="end" onClick={handleCloseEditDrawer} aria-label="close">
              <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
          </Toolbar>
        </AppBar>

        <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
          <Box margin="30px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" flexDirection="column" gap={1} alignItems="start">
                <Tooltip title="Cycle Title">
                  <Box display="flex" gap={1} alignItems="center">
                    {/*
                    <TaskAlt color="white" />
                    <Typography variant="h6">
                      {logTaskDetails.title !== null ? logTaskDetails.title : 'no title'}
                    </Typography>
                    */}
                  </Box>
                </Tooltip>
                <Tooltip title="Start Date - Finish Date">
                  <Box display="flex" gap={1} alignItems="center">
                    <AccessTime />
                    <Typography variant="p">
                      {logTaskDetails.start_date} - {logTaskDetails.finish_date}
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>
              <Button
                variant="contained"
                color="warning"
                size="large"
                onClick={handleAgregarComentarioEjecutor}
              >
                + {t('add_comment')}
              </Button>
            </Box>
            <Box marginTop="40px">
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="inherit"
                variant="fullWidth"
              >
                <Tab label={t('comments_executor')} value="comentarios" />
                <Tab label={t('followup_reviewer')} value="seguimientos" />
              </Tabs>
            </Box>
            <CustomTabPanel value={tabValue} index="comentarios">
              <Box sx={{ marginBottom: '30px' }}>
                {/* <Button
                  variant="contained"
                  color="warning"
                  size="large"
                  onClick={handleAgregarComentarioEjecutor}
                >
                  + {t('add_comment')}
                </Button> */}
              </Box>
              {isLoading === 'loaded' ? (
                logtaskExecutedComments.length > 0 ? (
                  logtaskExecutedComments.map((comment, index) => {
                    console.log('Adjuntos del comentario:', comment.attachment); // <-- test
                    return (
                      <Box key={index} sx={{ marginBottom: '30px' }}>
                        <Box
                          display="flex"
                          margin="20px 20px"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box display="flex" gap={1}>
                            <Box>
                              <Avatar sx={{ width: '3rem', height: '3rem' }}>
                                {comment.userName.slice(0, 2).toUpperCase()}
                              </Avatar>
                            </Box>
                            <Box>
                              <Box>
                                <Typography variant="h6">{comment.userName}</Typography>
                              </Box>
                              <Box>
                                <Typography variant="h6">{formatDate(comment.created)}</Typography>
                              </Box>
                            </Box>
                          </Box>
                          <Tooltip title={t('options')}>
                            <IconButton
                              onClick={(event) => handleMenuEditCommentOpen(event, comment)}
                            >
                              <MoreVert />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box>{comment.comment}</Box>
                        {/*comment.attachment.length > 0 &&
                          comment.attachment.map((attachment, index) => (
                            <AttachmentViewer key={index} attachment={attachment} />
                          ))
                        */}
                        {comment.attachment && comment.attachment.length > 0 &&
                          comment.attachment.map((attachment, index) => (
                            <AttachmentViewer key={index} attachment={attachment} />
                          ))
                        }
                        <Box display="flex" justifyContent="space-between" margin="10px 0">
                          <Button variant="outlined" size="large">
                            {t('highlight')}
                          </Button>
                          <Button
                            variant="outlined"
                            size="large"
                            //onClick={handleOpenAttachmentModal}
                            onClick={() => handleOpenAttachmentModal(comment)}
                          >
                            {t('up_attachment')}
                          </Button>
                        </Box>
                        <hr></hr>
                      </Box>
                    );
                  })
                ) : isLoading === 'loading' ? (
                  <div>{t('loading')}</div>
                ) : (
                  <div>{t('no_comments_found')}</div>
                )
              ) : (
                <div>{t('loading')}</div>
              )}
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index="seguimientos">
              <Box sx={{ marginBottom: '30px' }}>
                {/* <Button
                  variant="contained"
                  color="warning"
                  size="large"
                  onClick={handleAgregarComentario}
                >
                  + {t('add_comment')}
                </Button> */}
              </Box>
              {isLoading === 'loaded' ? (
                logtaskRevisorComments.length > 0 ? (
                  logtaskRevisorComments.map((comment, index) => {
                    return (
                      <Box key={index} sx={{ marginBottom: '30px' }}>
                        <Box
                          display="flex"
                          margin="20px 20px"
                          justifyContent="start"
                          gap={2}
                          alignItems="center"
                        >
                          <Box>
                            <Avatar sx={{ width: '3rem', height: '3rem' }}>
                              {comment.userName.slice(0, 2).toUpperCase()}
                            </Avatar>
                          </Box>
                          <Box>
                            <Box>
                              <Typography variant="h6">{comment.userName}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="h6">{formatDate(comment.created)}</Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box>{comment.comment}</Box>
                        {comment.attachment.length > 0 &&
                          comment.attachment.map((attachment, index) => (
                            <AttachmentViewer key={index} attachment={attachment} />
                          ))
                        }
                        <Box display="flex" justifyContent="space-between" margin="10px 0">
                          <Button variant="outlined" size="large">
                            {t('highlight')}
                          </Button>
                          <Button
                            variant="outlined"
                            size="large"
                            //onClick={handleOpenAttachmentModal}
                            onClick={() => handleOpenAttachmentModal(comment)}
                          >
                            {t('up_attachment')}
                          </Button>
                        </Box>
                        <hr></hr>
                      </Box>
                    );
                  })
                ) : isLoading === 'loading' ? (
                  <div>{t('loading')}</div>
                ) : (
                  <div>{t('no_comments_found')}</div>
                )
              ) : (
                <div>{t('loading')}</div>
              )}
            </CustomTabPanel>
            <Menu open={menuEditOpen} anchorEl={anchorEl} onClose={handleMenuEditCommentClose}>
              <MenuItem onClick={handleOpenEditCommentModal}>{t('edit_comment')}</MenuItem>
              <MenuItem onClick={handleOpenDeleteCommentDialog}>{t('delete_comment')}</MenuItem>
            </Menu>
          </Box>
        </div>
      </Drawer>
      <Modal open={openEditCommentModal} onClose={handleCloseEditCommentModal}>
        <Box sx={modalStyle}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">{t('edit_comment')}</Typography>
            <IconButton onClick={handleCloseEditCommentModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box>
            <FormBuilder
              inputFields={addCommentFormData}
              showActionButton={false}
              controlled={true}
              initialValues={addCommentForm}
              onChange={(id, value) => {
                setAddCommentForm((prevState) => ({ ...prevState, [id]: value }));
              }}
            />
          </Box>
          <Button
            variant="contained"
            size="large"
            sx={{ marginTop: '30px' }}
            onClick={() => updateComment(selectedComment)}
          >
            {t('edit_comment')}
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ marginTop: '30px', marginLeft: '20px' }}
            onClick={() => setOpenEditCommentModal(false)}
          >
            {t('Cancel')}
          </Button>
        </Box>
      </Modal>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h5" sx={{ marginBottom: '40px' }}>
            {t('add_comment_as_reviewer')}
          </Typography>
          {errorCommentForm ? <Alert severity="error">{t('comment_field_mandatory')}</Alert> : ''}
          <FormBuilder
            inputFields={addCommentFormData}
            showActionButton={false}
            controlled={true}
            initialValues={addCommentForm}
            onChange={(id, value) => {
              setAddCommentForm((prevState) => ({ ...prevState, [id]: value }));
            }}
          />
          <Button
            variant="contained"
            size="large"
            sx={{ marginTop: '30px' }}
            onClick={handleAddReviewerComment}
          >
            {t('add_comment')}
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ marginTop: '30px', marginLeft: '20px' }}
            onClick={() => setOpenModal(false)}
          >
            {t('Cancel')}
          </Button>
        </Box>
      </Modal>
      <Modal open={openModalEjecutor} onClose={handleCloseModalEjecutor}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ marginBottom: '40px' }}>
            {t('add_comment')}
          </Typography>
          {errorCommentForm ? <Alert severity="error">{t('comment_field_mandatory')}</Alert> : ''}
          {/*
          <FormBuilder
            inputFields={addCommentFormData}
            showActionButton={false}
            controlled={true}
            initialValues={addCommentForm}
            onChange={(id, value) => {
              setAddCommentForm((prevState) => ({ ...prevState, [id]: value }));
            }}
          />
          */}
          <FormBuilder
            inputFields={addCommentFormData}
            showActionButton={false}
            controlled={true}
            initialValues={{
              ...addCommentForm,
              progress: Math.min(100, Math.max(0, parseInt(logTaskDetails.progress ?? 0, 10)))
            }}
            onChange={(id, value) => {
              setAddCommentForm((prevState) => ({ ...prevState, [id]: value }));
            }}
          />

          <Button
            variant="contained"
            size="large"
            sx={{ marginTop: '30px' }}
            onClick={() => handleCommentConfirmation(true)}
          >
            {t('add_comment')}
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ marginTop: '30px', marginLeft: '20px' }}
            onClick={() => setOpenModalEjecutor(false)}
          >
            {t('Cancel')}
          </Button>
        </Box>
      </Modal>
      <Dialog
        open={openDeleteCommentDialog}
        onClose={handleCloseDeleteCommentDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            <HighlightOffIcon color="error" sx={{ fontSize: 80 }} margin="10px 0" align="center" />
          </Box>
          <Typography variant="h4" align="center">
            {t('delete_comment_dialog_message')}
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
              onClick={handleCloseDeleteCommentDialog}
              color="primary"
            >
              {t('Cancel')}
            </Button>
            <Button
              size="large"
              color="error"
              variant="contained"
              onClick={() => handleDeleteComment(selectedComment.comment_id)}
            >
              {t('delete')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      <Modal open={openModalConfirmation} onClose={handleCloseModalConfirmation}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ marginBottom: '40px' }}>
            {t('are_you_sure_to_add_this_comment')}
          </Typography>
          {/*
          <Typography>
            <strong>{t('title')}:</strong> {logTaskDetails.title}
          </Typography>
          */}
          <Typography>
            <strong>{t('comment')}:</strong> {addCommentForm.comment}
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ marginTop: '30px' }}
            onClick={handleAddEjecutorComment}
          >
            {t('yes')}
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ marginTop: '30px', marginLeft: '20px' }}
            onClick={() => {
              setOpenModalConfirmation(false);
              if (isExecutor) {
                setOpenModalEjecutor(true);
              } else {
                setOpenModal(true);
              }
            }}
          >
            {t('no')}
          </Button>
        </Box>
      </Modal>
      <Modal open={openModalCommentConfirmation} onClose={handleCloseModalCommentConfirmation}>
        <Box sx={modalStyle}>
          <Typography variant="h5" sx={{ marginBottom: '40px' }}>
            {commentConfirmation}
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ marginTop: '30px' }}
            onClick={() => setOpenModalCommentConfirmation(false)}
          >
            Ok
          </Button>
        </Box>
      </Modal>
      <Modal open={openAttachmentModal} onClose={handleCloseAttachmentModal}>
        <Box sx={modalStyle}>
          <Typography variant="h5" sx={{ marginBottom: '6px' }}>
            {t('up_attachment')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '10px' }}>
            {t('type_of_files')}: jpeg, jpg, png, pdf, doc, docx, xls, xlsx
          </Typography>
          {attachmentComment && (
            <Typography>
              {t('file_to_upload')}: {attachmentComment.name}
            </Typography>
          )}
          {previewUrl && (
            <Box sx={{ textAlign: 'center', marginTop: '16px' }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  borderRadius: '4px'
                }}
              />
            </Box>
          )}
          <Box gap={2} display="flex" justifyContent="justify-between" alignItems="center">
            {attachmentComment ? (
              <Button
                variant="contained"
                size="large"
                sx={{ marginTop: '30px' }}
                //onClick={handleUploadAttachment}
                onClick={() => handleUploadAttachment(selectedComment)}
              >
                {t('submit_attachment')}
              </Button>
            ) : (
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                size="large"
                sx={{ marginTop: '30px' }}
              >
                {t('select_image')}
                <VisuallyHiddenInput
                  type="file"
                  accept="image/png, image/jpg, image/jpeg, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={(event) => handleSelectImage(event)}
                />
              </Button>
            )}
            <Button
              variant="outlined"
              size="large"
              sx={{ marginTop: '30px' }}
              onClick={handleCloseAttachmentModal}
            >
              {t('close')}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default EditEventDetailsDrawer;
