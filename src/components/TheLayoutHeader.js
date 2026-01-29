import { ExpandMore, NotificationsNone } from '@mui/icons-material';
import { Badge, Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { headerHeight } from '../config/constants';
import { useLanguage } from '../providers/languageProvider';
import { GlobalConfig } from '../routes/RoutesFile';
import { dashboardMessage } from '../stores/messages/dashboardMessageSlice';
import BaseTab from './BaseTab';
import TheLayoutHeaderActionDropdown from './TheLayoutHeaderActionDropdown';

function LayoutHeader() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { modulePermissions } = useContext(GlobalConfig);
  const { language, changeLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('notifications');
  const [anchorEl, setAnchorEl] = useState(null);

  const languageLabel = language === 'en' ? 'EN' : 'ES';

  const user = useSelector((state) => state.globalData.userDetails ?? {});
  const messages = useSelector((state) => state?.dashboardMessage?.data ?? {});

  const tabItems = modulePermissions?.filter(
    (tabs) => tabs?.visibility !== false && tabs?.moduleName !== 'notifications'
  );

  const permitTabs = modulePermissions?.filter((tabs) => tabs?.visibility !== false);
  const notificationTab = permitTabs.find((module) => {
    return module?.moduleName === 'notifications';
  });

  const handleFetchDashboardMessages = () => {
    const formData = {};
    dispatch(dashboardMessage(formData));
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (lang) => {
    setAnchorEl(null);
    if (lang) {
      changeLanguage(lang);
    }
  };

  useEffect(() => {
    const { pathname } = location;
    const pathnameArr = pathname.split('/');
    setActiveTab(pathnameArr.pop().trim());
    handleFetchDashboardMessages();
  }, [location]);

  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        width: '100%',
        height: headerHeight,
        pl: 2,
        backgroundColor: '#fff',
        borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ position: 'absolute', left: 0, bottom: 0, width: '50vw' }}>
        {/* <InputDateRangePicker disableFuture={true} className="mc-layout-header__filters" /> */}
        <BaseTab
          items={tabItems ?? []}
          activeTab={activeTab}
          tabContainerProps={{
            variant: 'fullWidth',
            onChange: (_, value) => {
              navigate(`view/${value}`);
              setActiveTab(value);
            }
          }}
          tabItemProps={{ iconPosition: 'start' }}
          valueKey="key"
        />
      </Box>

      <Box sx={{ ml: 'auto', mr: '1rem' }}>
        <Button variant="outlined" size="small" onClick={handleOpen}>
          {languageLabel}
          <ExpandMore />
        </Button>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleClose()}>
          <MenuItem onClick={() => handleClose('en')}>{t('english')}</MenuItem>
          <MenuItem onClick={() => handleClose('es')}>{t('spanish')}</MenuItem>
        </Menu>
      </Box>

      {notificationTab && (
        <IconButton
          aria-label="Notifications"
          sx={{
            mr: '1rem',
            border: activeTab == 'notifications' ? '1px solid #19aabb' : 'none'
          }}
          onClick={() => {
            navigate(`view/notifications`);
            setActiveTab('notifications');
          }}
          color={activeTab == 'notifications' ? 'primary' : ''}
        >
          <Badge
            badgeContent={messages?.count}
            max={999}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: 'rgb(220 38 38 / var(--tw-bg-opacity, 1))',
                color: 'white'
              }
            }}
          >
            <NotificationsNone />
          </Badge>
        </IconButton>
      )}

      <TheLayoutHeaderActionDropdown userDetails={user || {}} />
    </Box>
  );
}

export default LayoutHeader;
