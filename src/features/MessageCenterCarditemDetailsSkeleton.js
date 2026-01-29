import React from 'react';
import { Box, Skeleton } from '@mui/material';

function MessageCenterCardDetailsSkeleton() {
  return (
    <Box
      sx={{
        minHeight: '100%',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '10px',
        p: 2
      }}
    >
      <Skeleton variant="text" height={40} />
      <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
        <Skeleton variant="circular" width={24} height={24} />
        <Box sx={{ ml: 1 }}>
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="text" width="40%" />
        </Box>
        <Skeleton variant="text" width="30%" sx={{ marginLeft: 'auto' }} />
      </Box>
      <Box sx={{ display: 'flex', border: '1px solid #ccc', p: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" />
          <Skeleton variant="text" sx={{ my: 1 }} />
          <Skeleton variant="text" sx={{ my: 1 }} />
          <Skeleton variant="text" sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={36} width={100} />
        </Box>
      </Box>
    </Box>
  );
}

export default MessageCenterCardDetailsSkeleton;
