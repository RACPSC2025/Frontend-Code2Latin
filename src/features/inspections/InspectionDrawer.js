import { Close } from '@mui/icons-material';
import { AppBar, Box, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseTab from '../../components/BaseTab';
import InceptionWhereTable from './InceptionWhereTable';
import InspectionForm from './InspectionForm';

export default function InspectionDrawer({
  openDrawer = false,
  setOpenDrawer = () => {},
  drawerTitle = '',
  inceptionFields = {}
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const tabList = [
    {
      label: t('form'),
      component: (
        <InspectionForm
          drawerTitle={drawerTitle}
          inceptionFields={inceptionFields}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          tabListLength={2}
        />
      )
    },
    {
      label: t('table'),
      component: <InceptionWhereTable setActiveTab={setActiveTab} />
    }
  ];


  return (
    <Drawer
      anchor="right"
      open={openDrawer}
      onClose={() => setOpenDrawer(false)}
      PaperProps={{
        sx: { maxWidth: '80%', width: { sm: '50vw', md: '60%', lg: '80%' } }
      }}
    >
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography color="white" variant="h5" sx={{ flexGrow: 1 }}>
            {t(drawerTitle)}
          </Typography>
          <IconButton edge="end" onClick={() => setOpenDrawer(false)} aria-label="close">
            <Close sx={{ color: 'white' }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Tabs */}
      <BaseTab
        items={tabList}
        activeTab={activeTab}
        tabContainerProps={{
          sx: { mb: 2 },
          onChange: (_, newValue) => setActiveTab(newValue)
        }}
      />

      {/* Content */}
      <Box sx={{ overflowY: 'auto', p: 2 }}>{tabList[activeTab]?.component}</Box>
    </Drawer>
  );
}
