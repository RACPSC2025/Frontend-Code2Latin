import { Box, CircularProgress, Typography } from '@mui/material';

export default function TheFullPageLoader({
  loaderSize = 100,
  background = 'white',
  loaderText = 'Please Wait...'
}) {
  const loaderStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: background
  };

  return (
    <Box sx={loaderStyle}>
      <CircularProgress size={loaderSize} />
      <Typography sx={{ mt: 2 }} variant="h5" component="div" color="text.secondary">
        {loaderText}
      </Typography>
    </Box>
  );
}
