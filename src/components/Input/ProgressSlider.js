import { Box, Typography, Slider } from "@mui/material";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

export default function ProgressSlider({ value, taskId, task_status, onCommit }) {
  const { t } = useTranslation();
  const [localValue, setLocalValue] = useState(parseInt(value) || 0);
  const progress = (val) => parseInt(val) || 0;

  return (
    <Box sx={{ width: '25%', mr: 1 }}>
      <Box>
        {/*
        <BorderLinearProgress variant="determinate" value={Number(task.progress)} />
        */}

        <Slider
          value={progress(localValue)}
          min={0}
          max={100}
          step={1}
          sx={{
            //color: (theme) => theme.palette.primary.main, // usa azul del tema
            //color: "#1976d2", // azul estándar de MUI
          }}
          //onChangeCommitted={(event, newValue) => onCommit(taskId, newValue)}
          
          onChange={(e, newValue) => setLocalValue(newValue)} // se mueve en vivo
          onChangeCommitted={(e, newValue) => onCommit(taskId, newValue)} // avisa al padre
        />

        <Box display="flex" alignItems="center" justifyContent="space-between">
          {/* 
          <Typography variant="body2" color="textSecondary">
            {parseInt(task.progress)}% {t('of')} 100%
          </Typography>
          */}
          {/* Dont use for now 
          <Typography variant="body2" color="textSecondary">
            {formattedDate}
          </Typography>
          */}

          <Typography variant="body2" color="textSecondary">
            {progress(parseInt(localValue))}% {t("of")} 100%
          </Typography>

          <p className='text-gray-400 font-normal pl-2'>
            {task_status}
          </p>
        </Box>

      </Box>
    </Box>
  );
}