import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

export const TaskDoubleRingChart = ({ 
  percentage, 
  stats,
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
  const innerRadius = radius - (strokeWidth / 2) - gap - (innerStrokeWidth / 2);
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
  const total = stats ? (stats.completed + stats.inProgress + stats.expired + stats.open) : 0;
  const hasData = total > 0;

  // Colors mapping (matching project colors)
  const colors = {
    completed: '#00f57a',
    inProgress: '#1a90ff',
    expired: '#fb3d61',
    open: '#fbc02d', // Using planning/yellow for open to have 4 colors
    background: '#edf2f4'
  };

  const completedLen = hasData ? (stats.completed / total) * circumference : 0;
  const inProgressLen = hasData ? (stats.inProgress / total) * circumference : 0;
  const expiredLen = hasData ? (stats.expired / total) * circumference : 0;
  const openLen = hasData ? (stats.open / total) * circumference : 0;
  
  const completedOffset = 0;
  const inProgressOffset = -completedLen;
  const expiredOffset = -(completedLen + inProgressLen);
  const openOffset = -(completedLen + inProgressLen + expiredLen);

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
          stroke={colors.background}
          fill="transparent"
          r={innerRadius}
          cx={center}
          cy={center}
          strokeWidth={innerStrokeWidth}
        />
        <circle
          stroke={percentage === 100 ? colors.completed : '#263238'}
          fill="transparent"
          r={innerRadius}
          cx={center}
          cy={center}
          strokeWidth={innerStrokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${Math.max(0, innerProgressLen)} ${innerCircumference}`}
          style={transitionStyle}
        />

        {/* --- OUTER RING (Status Segments) --- */}
        <circle
          stroke={colors.background}
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
          strokeWidth={strokeWidth}
        />
        
        {hasData && (
          <>
            {/* Completed */}
            {stats.completed > 0 && (
              <circle
                stroke={colors.completed}
                fill="transparent"
                r={radius}
                cx={center}
                cy={center}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${Math.max(0, completedLen - (total > 1 ? 2 : 0))} ${circumference}`}
                strokeDashoffset={completedOffset}
                style={transitionStyle}
              />
            )}
            
            {/* In Progress */}
            {stats.inProgress > 0 && (
              <circle
                stroke={colors.inProgress}
                fill="transparent"
                r={radius}
                cx={center}
                cy={center}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${Math.max(0, inProgressLen - (total > 1 ? 2 : 0))} ${circumference}`}
                strokeDashoffset={inProgressOffset}
                style={transitionStyle}
              />
            )}
            
            {/* Expired */}
            {stats.expired > 0 && (
              <circle
                stroke={colors.expired}
                fill="transparent"
                r={radius}
                cx={center}
                cy={center}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${Math.max(0, expiredLen - (total > 1 ? 2 : 0))} ${circumference}`}
                strokeDashoffset={expiredOffset}
                style={transitionStyle}
              />
            )}

            {/* Open */}
            {stats.open > 0 && (
              <circle
                stroke={colors.open}
                fill="transparent"
                r={radius}
                cx={center}
                cy={center}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${Math.max(0, openLen - (total > 1 ? 2 : 0))} ${circumference}`}
                strokeDashoffset={openOffset}
                style={transitionStyle}
              />
            )}
          </>
        )}
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
