import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  AvatarGroup,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Button,
  LinearProgress,
  Card,
  CardContent,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  Comment as CommentIcon,
  AttachFile as AttachFileIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import FileUploadDialog from '../../components/FileUploadDialog';

const TaskDetailsSidebar = ({ selectedTask, statuses }) => {
  const { t } = useTranslation();
  const [taskDetails, setTaskDetails] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    if (selectedTask) {
      console.log("📋 Actualizando detalles del sidebar:", selectedTask);

      // ✅ MAPEAR DATOS REALES A ESTRUCTURA ESPERADA
      const mappedDetails = {
        id: selectedTask.id,
        title: selectedTask.logtask_title || selectedTask.task_title || `Ciclo ${selectedTask.id}`,
        type: selectedTask.task_type || 'Sin especificar',
        status: selectedTask.logtask_status || selectedTask.task_status,
        progress: parseFloat(selectedTask.percentage || selectedTask.progress || 0),
        startDate: selectedTask.start_date || selectedTask.task_start_date,
        endDate: selectedTask.end_date || selectedTask.task_end_date,
        realClosingDate: selectedTask.real_closing_date,
        createdBy: selectedTask.created_by,

        // ✅ PROCESAR RESPONSABLES - Asegurar que se manejen diferentes estructuras de datos
        responsibles: selectedTask.responsibles || selectedTask.responsible_users || selectedTask.executors || [],

        // ✅ PROCESAR REVISORES - Asegurar que se manejen diferentes estructuras de datos
        reviewers: selectedTask.reviewers || selectedTask.supervisors || selectedTask.reviewers_users || [],

        // ✅ PROCESAR SUPERVISOR Y EJECUTOR ESPECÍFICOS
        supervisor: selectedTask.supervisor || selectedTask.supervisor_name || null,
        executor: selectedTask.executor || selectedTask.executor_name || selectedTask.responsible_name || null,

        // ✅ PROCESAR TAGS
        tags: selectedTask.tags ?
          (Array.isArray(selectedTask.tags) ? selectedTask.tags : Object.values(selectedTask.tags)) : [],

        // ✅ PROCESAR COMENTARIOS
        comments: selectedTask.comments || selectedTask.chat_messages || [],
        commentCount: parseInt(selectedTask.comment_count || selectedTask.comments_logtask_count || selectedTask.chat_count || 0),

        // ✅ DOCUMENTOS
        documentsCount: parseInt(selectedTask.num_documents || selectedTask.attachments_logtask_count || 0),

        // ✅ INFORMACIÓN ADICIONAL
        opportunityDays: selectedTask.closing_opportunity_days || selectedTask.opportunity_days || 0,
        totalDays: selectedTask.total_days,
        cost: selectedTask.cost,

        // ✅ DETERMINAR SI ES TAREA O LOGTASK
        isLogtask: !!selectedTask.task_id,
        parentTaskId: selectedTask.task_id
      };

      // Si los responsibles o revisores son un objeto en lugar de array, convertirlos
      if (mappedDetails.responsibles && typeof mappedDetails.responsibles === 'object' && !Array.isArray(mappedDetails.responsibles)) {
        mappedDetails.responsibles = Object.entries(mappedDetails.responsibles).map(([id, name]) => ({ id, name }));
      }
      
      if (mappedDetails.reviewers && typeof mappedDetails.reviewers === 'object' && !Array.isArray(mappedDetails.reviewers)) {
        mappedDetails.reviewers = Object.entries(mappedDetails.reviewers).map(([id, name]) => ({ id, name }));
      }

      setTaskDetails(mappedDetails);
      
      // Inicializar mensajes de chat con los comentarios existentes
      const initialMessages = mappedDetails.comments.map(comment => ({
        id: comment.id || Date.now() + Math.random(),
        text: comment.text || comment.comment || comment.message || 'Comentario',
        sender: comment.sender || comment.author || 'Usuario',
        timestamp: comment.timestamp || comment.date || new Date().toISOString(),
        type: 'existing' // Para distinguir de los nuevos mensajes
      }));
      
      setChatMessages(initialMessages);
    } else {
      setTaskDetails(null);
      setChatMessages([]);
    }
  }, [selectedTask]);

  // ✅ FUNCIÓN PARA OBTENER COLOR DE ESTADO
  const getStatusColor = (status) => {
    const statusObj = statuses?.find(s => s.value === String(status));
    return statusObj ? statusObj.color_code : '#90a4ae';
  };

  // ✅ FUNCIÓN PARA OBTENER LABEL DE ESTADO
  const getStatusLabel = (status) => {
    const statusObj = statuses?.find(s => s.value === String(status));
    return statusObj ? t(statusObj.label) : 'Desconocido';
  };

  // ✅ FUNCIÓN PARA FORMATEAR FECHAS
  const formatDate = (dateString) => {
    if (!dateString || dateString === '0000-00-00 00:00:00') return 'No definida';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  // ✅ FUNCIÓN PARA OBTENER INICIALES
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // ✅ MANEJAR CLIC EN ATTACH FILE
  const handleAttachFileClick = () => {
    setUploadDialogOpen(true);
  };

  // ✅ MANEJAR SUBIDA DE ARCHIVOS
  const handleFileUpload = (results) => {
    console.log('📎 Archivos subidos para tarea/ciclo:', taskDetails.id, results);
    // Aquí puedes agregar lógica adicional como refrescar la lista de archivos
  };

  // ✅ MANEJAR ENVÍO DE COMENTARIO
  const handleSendComment = () => {
    if (commentText.trim()) {
      console.log('💬 Enviando comentario:', commentText);
      
      // Crear nuevo mensaje
      const newMessage = {
        id: Date.now() + Math.random(),
        text: commentText,
        sender: 'Supervisor', // o el nombre del usuario actual
        timestamp: new Date().toISOString(),
        type: 'new'
      };
      
      // Agregar el nuevo mensaje a la lista
      setChatMessages(prev => [...prev, newMessage]);
      
      // Limpiar el campo de texto
      setCommentText('');
      
      // Aquí iría la lógica para enviar el comentario a la base de datos
      // dispatch(sendComment({ taskId: taskDetails.id, comment: commentText }))
    }
  };

  // ✅ MANEJAR ENTER EN COMENTARIO
  const handleCommentKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  if (!taskDetails) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography sx={{ color: '#90a4ae', fontSize: '0.9rem' }}>
          Seleccione una tarea o ciclo para ver los detalles
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {/* DISEÑO ORIGINAL - SIN CAMBIOS */}
        <Box sx={{ p: 3, borderBottom: '1px solid #edf2f4' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 800, 
                color: '#263238', 
                fontSize: '1.1rem',
                lineHeight: 1.3,
                mb: 1
              }}>
                {taskDetails.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip
                  label={getStatusLabel(taskDetails.status)}
                  size="small"
                  sx={{
                    bgcolor: `${getStatusColor(taskDetails.status)}20`,
                    color: getStatusColor(taskDetails.status),
                    border: `1px solid ${getStatusColor(taskDetails.status)}40`,
                    fontWeight: 700,
                    fontSize: '0.7rem'
                  }}
                />
                
                <Typography sx={{ 
                  fontSize: '0.75rem', 
                  color: '#90a4ae',
                  textTransform: 'uppercase',
                  fontWeight: 700
                }}>
                  {taskDetails.isLogtask ? 'CICLO' : 'TAREA'} #{taskDetails.id}
                </Typography>
              </Box>

              {/* TAGS - DISEÑO ORIGINAL */}
              {taskDetails.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {taskDetails.tags.map(tag => (
                    <Chip
                      key={tag.id}
                      label={tag.tag_name}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        bgcolor: `#${tag.tag_color}20`,
                        color: `#${tag.tag_color}`,
                        border: `1px solid #${tag.tag_color}40`,
                        fontWeight: 600
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            <IconButton size="small" sx={{ color: '#90a4ae' }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* PROGRESO - DISEÑO ORIGINAL */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#263238' }}>
                Progreso
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#263238' }}>
                {taskDetails.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={taskDetails.progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#f0f2f5',
                '& .MuiLinearProgress-bar': {
                  bgcolor: taskDetails.progress === 100 ? '#00f57a' : 
                          taskDetails.progress >= 75 ? '#4caf50' :
                          taskDetails.progress >= 50 ? '#ff9800' :
                          taskDetails.progress >= 25 ? '#fbc02d' : '#fb3d61',
                  borderRadius: 4
                }
              }}
            />
          </Box>

          {/* ✅ SUPERVISOR Y EJECUTOR */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#263238' }}>
                Supervisor:
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#90a4ae' }}>
                {taskDetails.supervisor || 'No disponible'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#263238' }}>
                Ejecutor:
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#90a4ae' }}>
                {taskDetails.executor || 'No disponible'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* CONTENIDO SCROLLABLE - DISEÑO ORIGINAL */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
          {/* ✅ SECCIÓN DE CHAT - Estilo WhatsApp */}
          <Box sx={{ mb: 0.5 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#263238', mb: 0.25 }}>
              Chat
            </Typography>
            
            <Box sx={{ 
              maxHeight: '100px', 
              overflowY: 'auto', 
              bgcolor: '#f0f2f5', 
              p: 0.5, 
              borderRadius: '6px',
              border: '1px solid #e0e0e0'
            }}>
              {chatMessages.length > 0 ? (
                chatMessages.map((msg) => (
                  <Box 
                    key={msg.id} 
                    sx={{ 
                      mb: 0.25, 
                      display: 'flex', 
                      justifyContent: msg.sender === 'Supervisor' ? 'flex-end' : 'flex-start' 
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '85%',
                        p: '4px 8px',
                        ...(msg.sender === 'Supervisor'
                          ? {
                              bgcolor: '#D9FDD3',
                              borderRadius: '14px 4px 14px 14px',
                              ml: 'auto'
                            }
                          : {
                              bgcolor: '#ffffff',
                              borderRadius: '4px 14px 14px 14px',
                              mr: 'auto'
                            }),
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        animation: 'fadeIn 0.2s ease',
                        '@keyframes fadeIn': {
                          '0%': { opacity: 0, transform: 'translateY(3px)' },
                          '100%': { opacity: 1, transform: 'translateY(0)' }
                        }
                      }}
                    >
                      <Typography sx={{ fontSize: '0.7rem', color: '#111b21', wordBreak: 'break-word' }}>
                        {msg.text}
                      </Typography>
                      <Typography sx={{ 
                        fontSize: '0.5rem', 
                        color: '#667781', 
                        textAlign: 'right', 
                        mt: 0.25,
                        fontWeight: 500
                      }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography sx={{ fontSize: '0.65rem', color: '#667781', textAlign: 'center', py: 0.5 }}>
                  Sin mensajes
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* ✅ ÁREA DE COMENTARIOS MEJORADA */}
        <Box sx={{ p: 1, borderTop: '1px solid #edf2f4', bgcolor: '#fafbfc' }}>
          {/* ✅ INPUT DE MENSAJE CON ESTILO WHATSAPP */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5, 
            bgcolor: 'white',
            borderRadius: '20px',
            pl: 1,
            pr: 0.5,
            py: 0.5
          }}>
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={3}
              placeholder="Chat..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={handleCommentKeyPress}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.75rem',
                  bgcolor: '#f0f2f5',
                  borderRadius: '18px',
                  pl: 0.8,
                  '& fieldset': {
                    borderColor: 'transparent',
                    borderWidth: '0px'
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                    borderWidth: '0px'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                    borderWidth: '0px'
                  }
                }
              }}
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Adjuntar archivos">
                      <IconButton
                        size="small"
                        onClick={handleAttachFileClick}
                        sx={{ 
                          color: '#1a90ff',
                          borderRadius: 1,
                          '&:hover': { 
                            bgcolor: '#e3f2fd',
                            color: '#1976d2'
                          }
                        }}
                      >
                        <AttachFileIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
            />
            
            <Button
              variant="contained"
              size="small"
              onClick={handleSendComment}
              disabled={!commentText.trim()}
              sx={{
                minWidth: '32px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                bgcolor: '#00a884',
                '&:hover': { 
                  bgcolor: '#00997a',  // Efecto de hover más sutil
                  opacity: 0.9
                },
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: '0 2px 4px rgba(0, 168, 132, 0.2)',
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <SendIcon sx={{ fontSize: '1rem', ml: 0.2 }} />
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ✅ DIALOG DE SUBIDA DE ARCHIVOS */}
      <FileUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleFileUpload}
        title={`Adjuntar archivos - ${taskDetails.title}`}
        taskId={taskDetails.isLogtask ? taskDetails.parentTaskId : taskDetails.id}
        logtaskId={taskDetails.isLogtask ? taskDetails.id : null}
        acceptedTypes=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        maxFileSize={10 * 1024 * 1024} // 10MB
        maxFiles={5}
      />
    </>
  );
};

export default TaskDetailsSidebar;