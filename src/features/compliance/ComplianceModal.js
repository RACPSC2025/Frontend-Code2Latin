import { Close } from '@mui/icons-material';
import { AppBar, Box, Dialog, IconButton, Toolbar } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseTab from '../../components/BaseTab';
import { MessageCenterEventsCreateTask } from '../MessageCenterEventsCreateTask';
import ProgressStatus from '../MessageCenterLegalMatrix/ProgressStatus';
import TaskList from '../MessageCenterLegalMatrix/TaskList';

export default function ComplianceModal({
  isDrawerOpen = false,
  setIsDrawerOpen = () => {},
  activeTab = '',
  setActiveTab = () => {},
  rowData = [],
  rowId = 0,
  setRowId = () => {},
  columnId = 0,
  columnData = {}
}) {
  const { t } = useTranslation();
  const [status, setStatus] = useState(columnData?.value?.status);

  const tabList = [
    {
      label: t('Status'),
      component: (
        <ProgressStatus
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          status={status}
          setStatus={setStatus}
          rowData={rowData}
          rowId={rowId}
          setRowId={setRowId}
          columnId={columnId}
        />
      )
    },
    {
      label: t('task'),
      component: <TaskList isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
    },
    {
      label: t('createTask'),
      component: (
        <MessageCenterEventsCreateTask
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      )
    }
  ];

  return (
    <Dialog
      sx={{ minHeight: '80vh' }}
      fullWidth={true}
      maxWidth={'xl'}
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="close"
          >
            <Close sx={{ color: 'white' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 1 }}>
        <style>
          {` .mc-tab .MuiTabs-flexContainer {
            padding: 0;
            }`}
        </style>
        <BaseTab
          items={tabList}
          activeTab={activeTab}
          tabContainerProps={{
            sx: { mb: 2 },
            onChange: (_, newValue) => {
              setActiveTab(newValue);
            }
          }}
        />
        <Box sx={{ minHeight: '70vh', overflowY: 'auto', p: 2 }}>
          {tabList[activeTab]?.component}
        </Box>
      </Box>
    </Dialog>
  );
}
