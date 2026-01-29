import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Box, Button, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import FormBuilder from '../../components/FormBuilder';
import LexicalInput from '../../components/Input/lexicalWYSWYG/LexicalInput';
import TagsSelector from '../../components/Input/TagsSelector';
import { fetchPhases } from '../../stores/tasks/fetchPhasesSlice';
import { fetchSubPhases } from '../../stores/tasks/fetchSubPhasesSlice';
import { fetchTaskTags } from '../../stores/tasks/fetchTaskTagsSlice';
import { isValidArray } from '../../utils/others';

function EditActivityDetailsDrawer({
  openActivityDetailsDrawer,
  onCloseActivityDetailsDrawer,
  taskDetails
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [postStatus, setPostStatus] = useState('unposted');
  const [modifyActivityData, setModifyActivityData] = useState({
    task_id: taskDetails.id,
    title: taskDetails.task_title,
    description: '',
    fase: '',
    sub_fase: '',
    tolerancia: '',
    tags: []
  });

  const tagList = useSelector((state) => state?.fetchTaskTags?.data ?? []);
  const phase = useSelector((state) => state?.fetchPhase?.data?.data ?? []);
  const subPhase = useSelector((state) => state?.fetchSubPhases?.data?.data ?? []);

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

  const postActivity = async (activity) => {
    try {
      let formData = new FormData();
      formData.append('task_id', parseInt(activity.task_id));
      formData.append('title', activity.title);
      formData.append('description', activity.description);
      formData.append('fase', parseInt(activity.fase));
      formData.append('sub_fase', parseInt(activity.sub_fase));
      formData.append('tolerancia', activity.tolerancia);
      formData.append('tags', activity.tags);
      // dispatch(updateTaskDetails(formData)).then((data) => {});
      // const response = await axiosInstance.post(
      //   '/tasklist_api/update_task_basic_details',
      //   formData
      // );
      setPostStatus('success');
    } catch (error) {
      console.error('Error creating task ', error);
      setPostStatus('error');
    }
  };

  const activityDetailsFormData = [
    {
      id: 'title',
      label: t('title_of_the_activity'),
      type: 'text',
      defaultValue: '0'
    },
    {
      id: 'fase',
      label: t('phase'),
      type: 'dropdown',
      defaultValue: '',
      options: phase
    },
    {
      id: 'sub_fase',
      label: t('subphase'),
      type: 'dropdown',
      defaultValue: '',
      options: subPhase
    },
    {
      id: 'tolerancia',
      label: t('tolerance_days'),
      type: 'dropdown',
      defaultValue: '',
      options: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' }
      ]
    }
  ];

  const handleTagsSelection = (tags) => {
    const tagValues = tags.map((tag) => tag.value);
    setModifyActivityData((prevState) => ({ ...prevState, tags: tagValues }));
  };

  const handleLexicalInput = (data) => {
    setModifyActivityData((prevState) => ({ ...prevState, description: data }));
  };

  const handleCloseActivityDetailsDrawer = () => {
    setModifyActivityData({});
    onCloseActivityDetailsDrawer();
  };

  useEffect(() => {
    console.log('taskDetails', taskDetails);
    
    setModifyActivityData({
      task_id: taskDetails.id,
      title: taskDetails.task_title
    });
  }, [taskDetails]);

  useEffect(() => {
    // fetchTags();
    handleFetchTags();
    // fetchPhase();
    handleFetchPhase();
  }, [taskDetails]);

  useEffect(() => {
    // fetchSubPhases(modifyActivityData.fase);
    handleFetchSubPhases(modifyActivityData.fase);
  }, [modifyActivityData.fase]);

  useEffect(() => {}, [modifyActivityData]);

  return (
    <Drawer
      anchor="right"
      open={openActivityDetailsDrawer}
      onClose={handleCloseActivityDetailsDrawer}
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
            {t('edit_details_of_the_activity')}
          </Typography>
          <IconButton edge="end" onClick={onCloseActivityDetailsDrawer} aria-label="close">
            <CloseIcon sx={{ color: 'white' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        <Box padding="16px">
          <FormBuilder
            showActionButton={false}
            inputFields={activityDetailsFormData.slice(0, 1)}
            controlled={true}
            initialValues={modifyActivityData}
            onChange={(id, value) => {
              setModifyActivityData((prevState) => ({ ...prevState, [id]: value }));
            }}
          />
          <LexicalInput placeholder="Descripción de la Actividad" JSONData={handleLexicalInput} />
          <FormBuilder
            showActionButton={false}
            inputFields={activityDetailsFormData.slice(1, 3)}
            controlled={true}
            initialValues={modifyActivityData}
            onChange={(id, value) => {
              setModifyActivityData((prevState) => ({ ...prevState, [id]: value }));
            }}
          />
          {isValidArray(tagList) > 0 && (
            <TagsSelector listOfTags={tagList} onTagsChange={handleTagsSelection} />
          )}
          <FormBuilder
            showActionButton={false}
            inputFields={activityDetailsFormData.slice(3)}
            controlled={true}
            initialValues={modifyActivityData}
            onChange={(id, value) => {
              setModifyActivityData((prevState) => ({ ...prevState, [id]: value }));
            }}
          />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            margin="10px 0"
          >
            <Button variant="contained" onClick={() => postActivity(modifyActivityData)}>
              {t('edit_activity')}
            </Button>
            {postStatus === 'success' && (
              <Typography margin="10px 0" color="#32a852">
                {t('activity_edited_satisfactorily')}
              </Typography>
            )}
            {postStatus === 'error' && (
              <Typography margin="10px 0" color="#a83232">
                {t('error_editing_activity')}
              </Typography>
            )}
          </Box>
        </Box>
      </div>
    </Drawer>
  );
}

export default EditActivityDetailsDrawer;
