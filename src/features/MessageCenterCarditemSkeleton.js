import { Box, Skeleton } from '@mui/material';

function MessageCenterCarditemSkeleton() {
  return (
    <Box
      sx={{
        position: 'relative',
        borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
        p: 1,
        pl: 4.5
      }}
    >
      {/* Status bar */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '5px',
          backgroundColor: 'rgba(224, 224, 224, 0.5)'
        }}
      />

      <Box sx={{ position: 'absolute', left: '10px', top: '10px' }}>
        <Skeleton variant="circular" width={24} height={24} />
      </Box>

      {/* container for reviewer and date */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ flex: '1 0 50%', minWidth: 0 }}>
          <Skeleton variant="text" width="80%" />
        </Box>
        <Skeleton variant="text" width="40%" />
      </Box>

      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="100%" />
    </Box>
  );
}

export default MessageCenterCarditemSkeleton;
