import { useState } from 'react';
import { Box, Menu, MenuItem, Typography, Tooltip } from '@mui/material';
import { deepOrange } from '@mui/material/colors';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import storage from '../utils/storage';

const TheLayoutHeaderActionDropdown = ({ userDetails }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    storage.clearToken();
    storage.removeSystemToken();
    // window.location.href = 'https://compliance.dev.sofacto.info/amatia/auth/';
    window.location.href = `${process.env.REACT_APP_API_URL}`;
  }
  
  const truncateText = (text, maxLength = 8) => {
    //console.log("userDetails", userDetails);
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };
  
  return (
    <>
      <Box
        sx={{
          maxWidth: '175px',
          height: '100%',
          px: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          outline: 'none',
          border: 'none',
          borderBottom: `solid 2px ${deepOrange[700]}`,
          backgroundColor: 'transparent'
        }}
        component="button"
        onClick={handleClick}
      >
        <AccountCircleIcon />
        <Box
          sx={{
            mx: 0.5,
            flex: '1 0',
            minWidth: 0
          }}
          textAlign="left"
        >
          <Typography variant="subtitle2" className="mc-text-overflow">
            {userDetails.fullname}
          </Typography>
  
          <Tooltip title="Superadmin">
            <Typography variant="body2">
              {truncateText('Superadmin', 8)}
            </Typography>
          </Tooltip>
        </Box>
      </Box>
  
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem>{t('BackToDashboard')}</MenuItem>
        <MenuItem onClick={handleSignOut}>{t('SignOut')}</MenuItem>
      </Menu>
    </>
  );
}
export default TheLayoutHeaderActionDropdown;
