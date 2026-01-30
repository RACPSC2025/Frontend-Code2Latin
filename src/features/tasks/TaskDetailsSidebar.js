import React from 'react';
import { 
  Box, Typography, Avatar, Paper, Chip, Button, 
  LinearProgress, IconButton, TextField, InputAdornment 
} from '@mui/material';
import { 
  CheckCircle, 
  KeyboardArrowRight, 
  KeyboardArrowDown,
  AttachFile,
  Send
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

const StyledProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 5,
  backgroundColor: '#f0f0f0',
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: '#00f57a',
  },
}));

const TaskDetailsSidebar = ({ selectedTask, statuses, onCollapse }) => {
  const { t } = useTranslation();

  if (!selectedTask) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">Selecciona un ciclo para detalles</Typography>
      </Box>
    );
  }

  const getStatusInfo = (statusValue) => {
    const status = statuses?.find(s => String(s.value) === String(statusValue));
    return status || { label: 'unknown', color_code: '#gray' };
  };

  const statusInfo = getStatusInfo(selectedTask.task_status || selectedTask.logtask_status);
  const progress = selectedTask.progress || selectedTask.percentage || 0;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
      {/* Header del Ciclo */}
      <Box sx={{ p: 1.5, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#263238', fontSize: '1rem' }}>
            {selectedTask.task_title || selectedTask.title || 'Evaluación Final: Brigada'}
          </Typography>
          <Typography variant="overline" sx={{ fontWeight: 700, color: '#bdbdbd' }}>
            {statusInfo.label.toUpperCase()}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onCollapse}>
          <KeyboardArrowRight />
        </IconButton>
      </Box>

      <Box sx={{ p: 1.5, flex: 1, overflowY: 'auto' }}>
        {/* Progreso */}
        <Box mb={1.5}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="overline" sx={{ fontWeight: 800, color: '#455a64' }}>PROGRESO DEL CICLO</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>{progress}%</Typography>
          </Box>
          <StyledProgressBar variant="determinate" value={progress} />
          
          <Button 
            variant="contained" 
            fullWidth 
            startIcon={<CheckCircle />}
            sx={{ 
              mt: 1.5, 
              bgcolor: '#00f57a', 
              py: 1, 
              borderRadius: 2, 
              fontWeight: 800,
              '&:hover': { bgcolor: '#00d66a' }
            }}
          >
            APROBAR CICLO
          </Button>
        </Box>

        {/* Revisores */}
        <Box mb={1.5}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#90a4ae' }}>👤 REVISORES</Typography>
            </Box>
            <KeyboardArrowDown sx={{ color: '#cfd8dc' }} />
          </Box>
          
          <Paper elevation={0} sx={{ p: 1, display: 'flex', alignItems: 'center', bgcolor: '#f8fbfc', borderRadius: 1.5, mb: 1 }}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: '#e3f2fd', color: '#1a90ff', fontSize: '0.75rem', fontWeight: 700, mr: 1.5 }}>AM</Avatar>
            <Box flex={1}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>A. Martinez</Typography>
              <Typography variant="caption" sx={{ color: '#90a4ae', fontWeight: 600, fontSize: '0.7rem' }}>JEFE SEGURIDAD</Typography>
            </Box>
            <CheckCircle sx={{ color: '#00f57a', fontSize: 20 }} />
          </Paper>
        </Box>

        {/* Ejecutores */}
        <Box mb={1.5}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#90a4ae' }}>👥 EJECUTORES</Typography>
            </Box>
            <KeyboardArrowDown sx={{ color: '#cfd8dc' }} />
          </Box>
          
          <Paper elevation={0} sx={{ p: 1, display: 'flex', alignItems: 'center', bgcolor: '#f8fbfc', borderRadius: 1.5 }}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: '#f1f8e9', color: '#689f38', fontSize: '0.75rem', fontWeight: 700, mr: 1.5 }}>JR</Avatar>
            <Box flex={1}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>J. Rodriguez</Typography>
              <Typography variant="caption" sx={{ color: '#90a4ae', fontWeight: 600, fontSize: '0.7rem' }}>BRIGADISTA</Typography>
            </Box>
            <Chip label="PENDIENTE" size="small" sx={{ bgcolor: '#fff9c4', color: '#fbc02d', fontWeight: 800, fontSize: '0.65rem', height: 20 }} />
          </Paper>
        </Box>

        {/* Actividad Reciente */}
        <Box mb={1.5}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#90a4ae', mb: 1 }}>💬 ACTIVIDAD RECIENTE</Typography>
          
          <Box display="flex" gap={1} mb={1.5}>
            <Avatar sx={{ width: 26, height: 26, bgcolor: '#e3f2fd', color: '#1a90ff', fontSize: '0.65rem' }}>AM</Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.75rem' }}>A. Martinez</Typography>
              <Box sx={{ bgcolor: '#f5f7f9', p: 1, borderRadius: '0 12px 12px 12px', mt: 0.5 }}>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#455a64' }}>
                  He revisado los certificados. Se requiere adjuntar la vigencia de la licencia.
                </Typography>
                <Paper elevation={0} sx={{ mt: 0.5, p: 0.75, display: 'flex', alignItems: 'center', gap: 0.75, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <AttachFile sx={{ fontSize: 16, color: '#1a90ff' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#1a90ff' }}>obs_tecnicas.pdf</Typography>
                </Paper>
              </Box>
              <Typography variant="caption" sx={{ color: '#cfd8dc', fontSize: '0.7rem', mt: 0.5, display: 'block' }}>14:20 PM</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Input de Chat */}
      <Box sx={{ p: 1.5, borderTop: '1px solid #f0f0f0' }}>
        <Box display="flex" gap={1}>
          <TextField 
            fullWidth 
            size="small" 
            placeholder="Escribir mensaje..."
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small"><AttachFile sx={{ fontSize: 20 }} /></IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 2, bgcolor: '#f5f7f9' }
            }}
          />
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#018786', minWidth: 100, borderRadius: 2, fontWeight: 700 }}
          >
            ENVIAR
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskDetailsSidebar;
