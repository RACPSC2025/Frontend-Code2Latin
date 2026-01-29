import {
  Apps,
  CalendarMonth,
  Engineering,
  Groups,
  Hub,
  Insights,
  ModelTraining,
  Settings,
  Update
} from '@mui/icons-material';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalenderComponent from '../../components/CalenderComponent';
import SpeedDialComponent from '../../components/SpeedDialComponent';
import { useLanguage } from '../../providers/languageProvider';
import { getCurrentDate } from '../../utils/dateTimeFunctions';
import InspectionDrawer from './InspectionDrawer';

const baseInceptionFields = {
  inspection: ['inspection_type', 'form'],
  simulacrum: ['target_audience', 'delivered_materials', 'disclosure_method'],
  brigade: ['brigade_type', 'participating_members', 'equipment_used', 'results'],
  training: ['topic', 'instructor', 'number_of_attendees', 'distributed_materials'],
  drills: ['scenario', 'actual_duration', 'participants', 'form'],
  routines: ['periodicity', 'form'],
  work_orders: ['priority', 'deadline', 'progress']
};

// Function to generate different formats
const generateInceptionFields = (format = 'form') => {
  return Object.fromEntries(
    Object.entries(baseInceptionFields).map(([key, fields]) => [
      key,
      fields.map((field) =>
        format === 'form'
          ? {
              id: field,
              label: field,
              type: field.includes('_type') ? 'dropdown' : 'text',
              options: []
            }
          : { field, headerName: field }
      )
    ])
  );
};

export default function Component() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('Inspection');
  const [contractor, setContractor] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedView, setSelectedView] = useState('calendar'); // ['calendar', 'list', 'table', 'insights', 'settings'
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());

  const contractorArray = ['Contractor', 'Company 1', 'Company 2', 'Company 3'];

  const tabArray = [
    { label: 'inspection', icon: <Apps /> },
    { label: 'simulacrum', icon: <Apps /> },
    { label: 'brigade', icon: <Apps /> },
    { label: 'training', icon: <Apps /> },
    { label: 'drills', icon: <Apps /> },
    { label: 'routines', icon: <Apps /> },
    { label: 'work_orders', icon: <Apps /> }
  ];

  const speedDialActions = [
    { icon: <Insights />, name: 'inspection' },
    { icon: <Hub />, name: 'simulacrum' },
    { icon: <Groups />, name: 'brigade' },
    { icon: <ModelTraining />, name: 'training' },
    { icon: <Settings />, name: 'drills' },
    { icon: <Update />, name: 'routines' },
    { icon: <Engineering />, name: 'work_orders' }
  ];

  const selectedTabLabel = tabArray[tabValue]?.label;
  const selectedFields = generateInceptionFields('table')[selectedTabLabel] || [];

  const columnDefs = [
    { field: 'name', headerName: 'name' },
    { field: 'description', headerName: 'description' },
    ...selectedFields,
    { field: 'creation_date', headerName: 'creation_date' },
    { field: 'status', headerName: 'status' },
    { field: 'estimated_duration', headerName: 'estimated_duration' },
    { field: 'required_resources', headerName: 'required_resources' },
    { field: 'created_by', headerName: 'created_by' }
  ];

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [tabValue, contractor]);

  const viewTabArray = ['calendar'];

  const iconMapping = (viewTab, selectedView) => {
    const iconProps = {
      color: selectedView === viewTab ? 'warning' : 'action',
      fontSize: 'medium'
    };

    const icons = {
      calendar: <CalendarMonth {...iconProps} />
    };

    return icons[viewTab] || null;
  };

  return (
    <Box className="px-5 py-2">
      {/* Filter & Sub Tabs */}
      <Box className="xl:flex items-center justify-between gap-6 w-full py-2 mb-2">
        <Box className="flex items-center justify-center gap-6">
          <FormControl size="small" sx={{ minWidth: 200, mb: -1 }}>
            <InputLabel id="contractor-select-label">{t('contractor')}</InputLabel>
            <Select
              labelId="contractor-select-label"
              value={contractor}
              onChange={(e) => setContractor(e.target.value)}
            >
              {contractorArray.map((label, index) => (
                <MenuItem value={label} key={index}>
                  <Box display="flex" alignItems="center">
                    {label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            {tabArray.map(({ label, icon }, index) => (
              <Tab
                key={index}
                label={t(label)}
                icon={icon}
                iconPosition="start"
                sx={{ textTransform: 'capitalize' }}
              />
            ))}
          </Tabs>
        </Box>

        <Box className="flex gap-6 mt-2 xl:mt-0">
          {viewTabArray?.map((viewTab, index) => (
            <Box
              key={index}
              className={`flex flex-col items-center justify-center cursor-pointer`}
              onClick={() => {
                if (viewTab === 'dashboard') {
                  window.open(
                    'https://dev.sofacto.info/ocensa_amb/dashboard-center/html/',
                    '_blank'
                  );
                } else {
                  setSelectedView(viewTab);
                }
              }}
            >
              {iconMapping(viewTab, selectedView)}
              <Typography variant="h8">{t(viewTab)}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Grid Section */}
      <Box>
        {/* <TableComponent rowData={[]} columnDefs={columnDefs} isLoading={isLoading} /> */}
        <CalenderComponent
          events={[]}
          language={language}
          handleDateClick={(arg) => {
            setSelectedDate(dayjs(arg.dateStr));
          }}
          handleEventClick={() => {}}
          initialDate={selectedDate.format('YYYY-MM-DD')}
        />
      </Box>

      {/* Speed Dial */}
      <SpeedDialComponent
        openSpeedDial={openSpeedDial}
        handleCloseSpeedDial={() => setOpenSpeedDial(false)}
        handleOpenSpeedDial={() => setOpenSpeedDial(true)}
        speedDialActions={speedDialActions}
        handleClick={() => setOpenDrawer(true)}
        handleActionClick={({ name }) => setDrawerTitle(name)}
      />

      {/* Drawer */}
      <InspectionDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        drawerTitle={drawerTitle}
        inceptionFields={generateInceptionFields('form')}
      />
    </Box>
  );
}

Component.displayName = 'Inspections';
