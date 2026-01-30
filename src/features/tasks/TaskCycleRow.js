import React from 'react';
import { Box, Typography, Paper, IconButton, LinearProgress } from '@mui/material';
import { 
  DeleteOutline, 
  ChatBubbleOutline, 
  AttachFile 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledProgressBar = styled(LinearProgress)(({ theme, progresscolor }) => ({
  height: 6,
  borderRadius: 5,
  backgroundColor: '#f1f1f1',
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: progresscolor || '#1a90ff',
  },
}));

const OpportunityChip = styled(Box)(({ color }) => ({
  display: 'inline-flex',
  padding: '2px 10px',
  borderRadius: '6px',
  fontSize: '0.75rem',
  fontWeight: 800,
  backgroundColor: color + '12', 
  color: color,
  minWidth: '85px',
  justifyContent: 'center',
  border: `1px solid ${color}10`
}));

const TaskCycleRow = ({ task, statuses, onSelect, isSelected, index }) => {
  
  const getStatusInfo = (statusValue) => {
    // Colores extraídos exactamente de la imagen de referencia
    const colorMap = {
      'completed': '#00f57a',
      'expired': '#fb3d61',
      'vencido': '#fb3d61',
      'in_progress': '#1a90ff',
      'open': '#fbc02d',
      'planning': '#fbc02d'
    };
    
    // Intentar encontrar el label en los estados
    const status = statuses.find(s => String(s.value) === String(statusValue));
    const label = status?.label?.toLowerCase() || 'open';
    const color = colorMap[label] || colorMap[task.task_status?.toLowerCase()] || '#1a90ff';

    return { label, color };
  };

  const statusInfo = getStatusInfo(task.task_status);
  
  const formatDate = (dateString, isMain = false) => {
    if (!dateString || dateString === '--') return '--';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    
    return `${day} ${month} ${year}`;
  };

  const getOpportunity = (days) => {
    const numDays = parseInt(days);
    if (numDays > 0) return { label: `+${numDays} Día${numDays > 1 ? 's' : ''}`, color: '#fb3d61' };
    if (numDays === 0) return { label: 'A tiempo', color: '#00f57a' };
    return { label: 'En plazo', color: '#455a64' };
  };

  const opportunity = getOpportunity(task.opportunity_days);

  return (
    <Paper
      elevation={0}
      sx={{
        borderBottom: '1px solid #edf2f4',
        borderRadius: 0,
        padding: '8px 16px', // Más compacto
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        bgcolor: isSelected ? '#f5f9ff' : (index % 2 === 0 ? 'white' : '#f9fbfd'),
        '&:hover': {
          backgroundColor: '#f1f4f8',
        },
      }}
      onClick={() => onSelect && onSelect(task)}
    >
      {/* Indicador de estado lateral */}
      <Box 
        sx={{ 
          position: 'absolute', 
          left: 0, 
          top: 0, 
          bottom: 0, 
          width: 4, 
          bgcolor: statusInfo.color,
        }} 
      />

      <Box display="flex" alignItems="center" width="100%">
        {/* INICIO */}
        <Box flex="0 0 110px">
          <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#263238' }}>
            {formatDate(task.start_date)}
          </Typography>
        </Box>

        {/* CIERRE PROG */}
        <Box flex="0 0 110px">
          <Typography sx={{ color: '#78909c', fontSize: '0.85rem', fontWeight: 600 }}>
            {formatDate(task.end_date)}
          </Typography>
        </Box>

        {/* CIERRE REAL */}
        <Box flex="0 0 110px">
          <Typography sx={{ color: '#78909c', fontSize: '0.85rem', fontWeight: 600 }}>
            {task.real_close_date || '--'}
          </Typography>
        </Box>

        {/* OPORTUNIDAD */}
        <Box flex="0 0 130px">
          <OpportunityChip color={opportunity.color}>
            {opportunity.label}
          </OpportunityChip>
        </Box>

        {/* ACCIONES */}
        <Box flex="1 1 auto" display="flex" justifyContent="center" gap={0.5}>
          <IconButton size="small" sx={{ color: '#90a4ae' }}><DeleteOutline sx={{ fontSize: 18 }} /></IconButton>
          <IconButton size="small" sx={{ color: '#90a4ae' }}><ChatBubbleOutline sx={{ fontSize: 18 }} /></IconButton>
          <IconButton size="small" sx={{ color: '#90a4ae' }}><AttachFile sx={{ fontSize: 18, transform: 'rotate(45deg)' }} /></IconButton>
        </Box>

        {/* PROGRESO */}
        <Box flex="0 0 200px" display="flex" alignItems="center" gap={2}>
          <Typography sx={{ fontWeight: 800, minWidth: 40, textAlign: 'right', fontSize: '0.85rem', color: '#263238' }}>
            {task.progress || 0}%
          </Typography>
          <Box flex={1}>
            <StyledProgressBar
              variant="determinate"
              value={task.progress || 0}
              progresscolor={statusInfo.color}
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default TaskCycleRow;
