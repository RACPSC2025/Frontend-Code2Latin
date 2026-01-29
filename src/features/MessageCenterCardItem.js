import FlagIcon from '@mui/icons-material/Flag';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import { Box, Checkbox, Divider, IconButton, Typography } from '@mui/material';
import { red } from '@mui/material/colors';

import { backgroundColor, STATUS_TO_COLOR_MAPPING } from '../config/constants';

function MessageCenterCardItem({
  reviewer,
  date,
  message,
  desc,
  onClick,
  onCheckChanged,
  onToggleImportant,
  status,
  isSelected = false,
  isActive = false,
  isUnread = false,
  isImportant = false, // New prop to determine message importance
  targetDate = null
}) {
  return (
    <Box
      sx={{
        cursor: 'pointer',
        position: 'relative',
        bgcolor: isActive ? 'blue2.main' : backgroundColor,
        pt: 0.5,
        pl: 3.5,
        transition: 'all 0.3s ease',
        '&:hover': {
          bgcolor: isActive ? 'blue2.main' : 'rgba(200, 200, 200, 0.2)',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          zIndex: 1,
          '& .flag-icon': {
            visibility: 'visible'
          }
        }
      }}
      onClick={onClick}
    >
      {/* Status bar */}
      {status && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '5px',
            bgcolor: STATUS_TO_COLOR_MAPPING[status]
          }}
        />
      )}

      <Box
        sx={{
          position: 'absolute',
          left: 10,
          top: 10,
          height: '1.5rem',
          width: '1.5rem'
        }}
      >
        {/* Checkbox on the left side */}
        <Checkbox
          sx={{
            p: 0
          }}
          checked={isSelected}
          onChange={(event) => {
            onCheckChanged(event.target.checked);
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
        />

        {/*  */}
      </Box>

      {/* container for reviewer and date */}
      <Box sx={{ width: '100%', pr: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flex: '1 0 50%', minWidth: 0 }}>
            <Typography className="mc-text-overflow" variant="caption" color="text.primary">
              {reviewer}
            </Typography>
          </Box>

          {/* Display targetDate with orange font color */}
          {targetDate && (
            <Typography variant="caption" fontWeight="bold" sx={{ color: 'orange' }}>
              {targetDate}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography
            variant="body1"
            color="text.primary"
            fontWeight={isUnread ? 'bold' : 'normal'}
          >
            {message}
          </Typography>
          <IconButton
            className="flag-icon"
            size="small"
            sx={{
              p: 0,
              visibility: 'hidden',
              '&:hover': {
                visibility: 'visible'
              }
            }}
            onClick={(event) => {
              event.stopPropagation();
              onToggleImportant();
            }}
          >
            {isImportant ? (
              <FlagIcon sx={{ color: red[800] }} />
            ) : (
              <FlagOutlinedIcon color="action" />
            )}
          </IconButton>
        </Box>
        <Typography className="mc-text-overflow" variant="body1" color="text.primary">
          {desc}
        </Typography>
      </Box>

      <Divider sx={{ mt: 1 }} />
    </Box>
  );
}

export default MessageCenterCardItem;
