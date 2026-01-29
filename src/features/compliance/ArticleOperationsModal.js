import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BaseTab from '../../components/BaseTab';
import legalService from '../../services/legalService';
import CreateTaskForm from './CreateTaskForm';

export default function ArticleOperationsModal({
  open = false,
  onClose = () => {},
  legalId,
  articleId,
  levelStr
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [operationData, setOperationData] = useState(null);
  const [status, setStatus] = useState('');
  const [oldStatus, setOldStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && legalId && articleId) {
      fetchOperationData();
    }
  }, [open, legalId, articleId, levelStr]);

  const fetchOperationData = async () => {
    try {
      const response = await legalService.getArticleDetailOperations(legalId, articleId, levelStr);
      console.log('📡 article_detail_operations response:', response);
      if (response.status === 1) {
        setOperationData(response.data);
        const currentStatus = response.data.record?.status || '0';
        setStatus(currentStatus);
        setOldStatus(currentStatus);
      }
    } catch (error) {
      console.error('Error fetching operation data:', error);
    }
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSave = async () => {
    if (status === oldStatus) {
      return;
    }

    setLoading(true);
    try {
      const response = await legalService.setArticleSpecialStatus(legalId, articleId, levelStr, status);
      if (response.status === 1) {
        toast.success(t('Status updated successfully'));
        setOldStatus(status);
        setTimeout(() => onClose(true), 1500);
      } else {
        toast.error(t('Error updating status'));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(t('Error updating status'));
    } finally {
      setLoading(false);
    }
  };

  const statusNames = {
    '0': 'not_apply',
    '1': 'closed',
    '2': 'continuo',
    '3': 'abierto',
    '4': 'expired'
  };

  const StatusTab = () => {
    const taskCount = operationData?.task_count || 0;

    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            {taskCount === 0 ? (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>{t('type')}</InputLabel>
                  <Select value={status} onChange={handleStatusChange} label={t('type')}>
                    <MenuItem value="0">{t('not_apply')}</MenuItem>
                    <MenuItem value="1">{t('closed')}</MenuItem>
                    <MenuItem value="2">{t('continuo')}</MenuItem>
                    <MenuItem value="3">{t('abierto')}</MenuItem>
                    <MenuItem value="4">{t('expired')}</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={status === oldStatus || loading}
                >
                  {t('save_color')}
                </Button>
              </Box>
            ) : (
              <Typography variant="body2" color="info.main">{t('msg_task_connected')}</Typography>
            )}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('History')}
            </Typography>
            {operationData?.history && operationData.history.length > 0 ? (
              <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                {operationData.history.map((item, index) => {
                  const statusName = statusNames[item.status] || 'not_apply';
                  const changeTime = new Date(item.change_time).toLocaleString();
                  const actor = item.type === '0' ? t('The system') : item.user_name;
                  return (
                    <Typography key={index} variant="body2" sx={{ py: 0.5 }}>
                      {actor} {t('has updated the status to')}: {t(statusName)} {t('on')} {changeTime}
                    </Typography>
                  );
                })}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">{t('No history available')}</Typography>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  const AttachmentsTab = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
      if (open && legalId && articleId) {
        loadFiles();
      }
    }, [open, legalId, articleId]);

    const loadFiles = async () => {
      try {
        const response = await legalService.getAttachments('14', articleId, levelStr);
        if (response.status === 1) {
          setFiles(response.data);
        }
      } catch (error) {
        console.error('Error loading files:', error);
      }
    };

    const handleFileSelect = async (event) => {
      const selectedFiles = Array.from(event.target.files);
      
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('files', file);
        formData.append('type', '14');
        formData.append('upload_id', articleId);
        formData.append('level_str', levelStr);

        setUploading(true);
        try {
          const response = await legalService.uploadAttachment(formData);
          if (response.status === 1) {
            await loadFiles();
            toast.success(t('File uploaded successfully'));
          } else {
            toast.error(t('Error uploading file'));
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          toast.error(t('Error uploading file'));
        } finally {
          setUploading(false);
        }
      }
      event.target.value = '';
    };

    const handleDelete = async () => {
      try {
        const response = await legalService.deleteAttachment(deleteConfirm);
        if (response.status === 1) {
          await loadFiles();
          toast.success(t('File deleted successfully'));
        } else {
          toast.error(t('Error deleting file'));
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        toast.error(t('Error deleting file'));
      } finally {
        setDeleteConfirm(null);
      }
    };

    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-upload"
            accept=".jpg,.pdf,.gif,.jpeg,.png,.txt,.doc,.docx,.xls,.xlsx,.tiff,.ppt,.pptx"
          />
          <label htmlFor="file-upload">
            <Button variant="contained" component="span" disabled={uploading}>
              {uploading ? t('Uploading...') : t('add_files')}
            </Button>
          </label>
          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
            {t('Allowed file types')}: jpg, pdf, gif, jpeg, png, txt, doc, docx, xls, xlsx, tiff, ppt, pptx
          </Typography>
        </Box>
        
        {files.length > 0 ? (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('attachments')} ({files.length})
            </Typography>
            {files.map((file) => {
              const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
              const fileExt = file.name.split('.').pop().toLowerCase();
              const isImage = imageExtensions.includes(fileExt);
              const thumbUrl = isImage ? file.url.replace(/\.([^.]+)$/, '_thumb.$1') : null;
              
              return (
                <Box key={file.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, border: '1px solid #ddd', borderRadius: 1, mb: 1 }}>
                  {isImage && thumbUrl && (
                    <img src={thumbUrl} alt={file.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#1976d2' }}>
                      {file.name}
                    </a>
                  </Box>
                  <Button size="small" color="error" onClick={() => setDeleteConfirm(file.id)}>
                    {t('remove')}
                  </Button>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('No attachments')}
          </Typography>
        )}

        <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
          <DialogTitle>{t('delete_comment')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t('delete_comment_dialog_message')}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirm(null)}>{t('Cancel')}</Button>
            <Button onClick={handleDelete} color="error">{t('delete')}</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  const CreateTaskTab = () => {
    return (
      <CreateTaskForm
        articleId={articleId}
        legalId={legalId}
        levelStr={levelStr}
        onSuccess={() => {
          toast.success(t('Task created successfully'));
          setTimeout(() => onClose(true), 1500);
        }}
      />
    );
  };

  const TasksTab = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (open && articleId && levelStr) {
        loadTasks();
      }
    }, [open, articleId, levelStr]);

    const loadTasks = async () => {
      setLoading(true);
      try {
        const response = await legalService.getTasksLinkedToArticle(articleId, levelStr);
        if (response.status === 1) {
          setTasks(response.data);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    const getStatusColor = (status) => {
      const colors = {
        '1': '#21ef88',
        '2': '#16b9ac',
        '3': '#d6cb6f',
        '4': '#f0627d'
      };
      return colors[status] || '#645f5f';
    };

    const getStatusLabel = (status) => {
      const labels = {
        '1': t('closed'),
        '2': t('task_permanent'),
        '3': t('open'),
        '4': t('overdue')
      };
      return labels[status] || t('not_apply');
    };

    if (loading) {
      return <Box sx={{ p: 2, textAlign: 'center' }}><Typography>{t('loading')}</Typography></Box>;
    }

    if (tasks.length === 0) {
      return <Box sx={{ p: 2 }}><Typography>{t('msg_no_tasks')}</Typography></Box>;
    }

    return (
      <Box sx={{ p: 2 }}>
        {tasks.map((task) => (
          <Box key={task.id} sx={{ display: 'flex', gap: 2, mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
              <Box sx={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: getStatusColor(task.task_status), mb: 1 }} />
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{task.progress || 0}%</Typography>
              <Typography variant="caption">{getStatusLabel(task.task_status)}</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">{task.task_start_date}</Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>{task.task_title}</Typography>
              <Typography variant="body2" dangerouslySetInnerHTML={{ __html: task.task_description }} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  const tabList = [
    { label: t('status'), component: <StatusTab /> },
    { label: t('attachments'), component: <AttachmentsTab /> },
    { label: t('tasks'), component: <TasksTab /> },
    { label: t('create_task'), component: <CreateTaskTab /> }
  ];

  return (
    <>
      <Dialog open={open} onClose={() => onClose(false)} maxWidth="lg" fullWidth>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {t('Article Operations')}
            </Typography>
            <IconButton edge="end" onClick={() => onClose(false)} aria-label="close">
              <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <BaseTab
            items={tabList}
            activeTab={activeTab}
            tabContainerProps={{
              sx: { mb: 2 },
              onChange: (_, newValue) => setActiveTab(newValue)
            }}
          />
          {tabList[activeTab]?.component}
        </DialogContent>
      </Dialog>
      
      {createPortal(<ToastContainer />, document.body)}
    </>
  );
}
