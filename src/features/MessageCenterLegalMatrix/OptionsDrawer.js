import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseTab from '../../components/BaseTab';
import AnalysisRegulation from '../analysisRegulation/AnalysisRegulation';
import Articles from '../articles/Articles';
import Compliance from '../compliance/Compliance';
import Details from '../details/Details';
// import Compliance from './Compliance';

export default function OptionsDrawer({
  openOptionsDrawer = false,
  onCloseOptionsDrawer = () => {},
  activeTab = 0,
  setActiveTab = () => {},
  optinDrawerData = []
}) {
  // const [activeTab, setActiveTab] = useState(0);
  const [loadingAI, setLoadingAI] = useState('not clicked');
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();
  const [complianceData, setCompliancedata] = useState([]);

  const handleLexicalInput = (data) => {};

  const handleAIClick = () => {
    setLoadingAI('clicked');
    setTimeout(() => setLoadingAI('loaded'), 2000);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const tabList = [
    {
      label: t('create_legal_requirement'),
      component: (
        <Details
          handleMenuOpen={handleMenuOpen}
          optinDrawerData={optinDrawerData}
          setCompliancedata={setCompliancedata}
          complianceData={complianceData}
        />
      )
    },
    {
      label: t('analysis_of_regulation'),
      component: (
        <AnalysisRegulation
          handleMenuOpen={handleMenuOpen}
          handleAIClick={handleAIClick}
          handleLexicalInput={handleLexicalInput}
          loadingAI={loadingAI}
          optinDrawerData={optinDrawerData}
          setCompliancedata={setCompliancedata}
          complianceData={complianceData}
        />
      )
    },
    {
      label: t('articles'),
      component: (
        <Articles
          optinDrawerData={optinDrawerData}
          setCompliancedata={setCompliancedata}
          complianceData={complianceData}
        />
      )
    }, 
    { 
      label: t('compliance'),
      component: (
        <Compliance
          optinDrawerData={optinDrawerData}
          setCompliancedata={setCompliancedata}
          complianceData={complianceData}
        />
      )
    }
    
  ];

  return (
    <>
      <Drawer
        anchor="right"
        open={openOptionsDrawer}
        onClose={() => {
          onCloseOptionsDrawer();
          setLoadingAI('not clicked');
        }}
        PaperProps={{
          sx: {
            maxWidth: '90%',
            width: { sm: '50vw', md: '40vw', lg: '90%' }
          }
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography color="white" variant="h5" sx={{ flexGrow: 1 }}>
              {t(optinDrawerData?.type)}
            </Typography>
            <IconButton
              edge="end"
              onClick={() => {
                onCloseOptionsDrawer();
                setLoadingAI('not clicked');
              }}
              aria-label="close"
            >
              <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <BaseTab
          items={tabList}
          activeTab={activeTab}
          tabContainerProps={{
            sx: { mb: 2 },
            onChange: (_, newValue) => setActiveTab(newValue)
          }}
        />
        <Box
          display="flex"
          flexDirection="row"
          gap={6}
          sx={{ minHeight: '90vh', overflowY: 'auto', p: 2 }}
        >
          {tabList[activeTab]?.component}
        </Box>
      </Drawer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
        <MenuItem onClick={handleMenuClose}>{t('see_notes')}</MenuItem>
        <MenuItem onClick={handleMenuClose}>{t('Create')}</MenuItem>
      </Menu>
    </>
  );
}
