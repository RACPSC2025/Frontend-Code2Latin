import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

export const TaskDoubleRingChart = ({ 
  percentage, 
  stats,
  chartData,
  size = 80, 
  strokeWidth = 8,
  innerStrokeWidth = 6,
  gap = 2
}) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  
  // Outer Ring Dimensions (Status Segments)
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Inner Ring Dimensions (Total Progress)
  // Calculate inner radius so it sits inside the outer ring with a gap
  const innerRadius = radius - (strokeWidth / 2) - gap - (strokeWidth / 2);
  const innerCircumference = innerRadius * 2 * Math.PI;

  // Animation for the center number
  useEffect(() => {
    let startTime;
    const duration = 2000;
    const startValue = displayPercentage;
    const endValue = percentage || 0;

    if (startValue === endValue) return;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);
      const current = startValue + (endValue - startValue) * easeOutQuart(progress);
      
      setDisplayPercentage(Math.round(current));
      if (progress < 1) window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  }, [percentage]);

  // --- Outer Ring Segments Calculation ---
  // Adaptador para soportar tanto `stats` (legacy) como `chartData` (dinámico)
  let segments = [];
  let total = 0;

  if (chartData && Array.isArray(chartData)) {
    // Modo Dinámico (Nuevo) - Ahora usamos el porcentaje directamente
    segments = chartData;
    total = segments.reduce((acc, curr) => acc + (curr.value || 0), 0);
  } else if (stats) {
    // Modo Legacy (Compatibilidad hacia atrás)
    const colors = {
      completed: '#00f57a',
      inProgress: '#1a90ff',
      expired: '#fb3d61',
      open: '#fbc02d',
      background: '#edf2f4'
    };
    total = (stats.completed + stats.inProgress + stats.expired + stats.open);
    segments = [
      { value: stats.completed, color: colors.completed, key: 'completed' },
      { value: stats.inProgress, color: colors.inProgress, key: 'inProgress' },
      { value: stats.expired, color: colors.expired, key: 'expired' },
      { value: stats.open, color: colors.open, key: 'open' }
    ];
  }

  const hasData = total > 0;

  // Calcular offsets dinámicamente
  let currentOffset = 0;
  const renderedSegments = segments.map((segment) => {
    // Usar el porcentaje si está disponible, de lo contrario calcularlo a partir del valor
    let segmentPercentage;
    if (segment.percentage !== undefined) {
      segmentPercentage = segment.percentage;
    } else if (total > 0) {
      // Calcular el porcentaje basado en el valor relativo al total
      segmentPercentage = ((segment.value || 0) / total) * 100;
    } else {
      segmentPercentage = 0;
    }
    
    const len = hasData ? (segmentPercentage / 100) * circumference : 0;
    const offset = -currentOffset;
    currentOffset += len;

    return {
      ...segment,
      strokeDasharray: `${Math.max(0, len - (segments.length > 1 ? 2 : 0))} ${circumference}`,
      strokeDashoffset: offset
    };
  });

  // --- Inner Ring Calculation ---
  const innerProgressLen = ((percentage || 0) / 100) * innerCircumference;

  const center = size / 2;
  const transitionStyle = { transition: 'stroke-dasharray 2s ease-out, stroke-dashoffset 2s ease-out' };

  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <svg
        style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* --- INNER RING (Total Progress) --- */}
        <circle
          stroke="#edf2f4"
          fill="transparent"
          r={innerRadius}
          cx={center}
          cy={center}
          strokeWidth={innerStrokeWidth}
        />
        {percentage > 0 && (
          <circle
            stroke={percentage === 100 ? '#00796b' : '#9c27b0'}  // Púrpura vibrante o verde azulado oscuro
            fill="transparent"
            r={innerRadius}
            cx={center}
            cy={center}
            strokeWidth={strokeWidth}  // Igualar al ancho del anillo exterior
            strokeLinecap="round"
            strokeDasharray={`${Math.max(0, innerProgressLen)} ${innerCircumference}`}
            style={transitionStyle}
          />
        )}

        {/* --- OUTER RING (Status Segments) --- */}
        <circle
          stroke="#edf2f4"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
          strokeWidth={strokeWidth}
        />
        
        {hasData && renderedSegments.map((segment, index) => {
            const shouldRender = segment.percentage !== undefined ? segment.percentage > 0 : segment.value > 0;
            return shouldRender && (
              <circle
                key={index}
                stroke={segment.color}
                fill="transparent"
                r={radius}
                cx={center}
                cy={center}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={segment.strokeDasharray}
                strokeDashoffset={segment.strokeDashoffset}
                style={transitionStyle}
              />
            );
        })}
      </svg>
      
      {/* Center Text */}
      <Box sx={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="caption" sx={{ fontWeight: 900, fontSize: size > 80 ? '1rem' : '0.75rem', color: '#263238' }}>
          {displayPercentage}%
        </Typography>
      </Box>
    </Box>
  );
};

export default TaskDoubleRingChart;
