import ClearIcon from '@mui/icons-material/Clear';
import ImageIcon from '@mui/icons-material/Image';
import { Box, IconButton, Tooltip } from '@mui/material';
import { getHumanReadableFileSize } from '../../utils/others';

const FilePreviewSingle = ({ file, removeFile }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        p: 1,
        border: 1,
        borderColor: 'grey.300'
      }}
    >
      <ImageIcon color="primary" />
      <Box component="span" sx={{ fontWeight: 'bold', mx: 1 }}>
        {file.name}
      </Box>
      <Box component="span">({getHumanReadableFileSize(file.size)})</Box>
      <Tooltip title="Remove" placement="top">
        <IconButton size="small" color="default" sx={{ ml: 'auto' }} onClick={removeFile}>
          <ClearIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default FilePreviewSingle;
