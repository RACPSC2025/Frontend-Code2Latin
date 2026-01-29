import { Close } from '@mui/icons-material';
import { AppBar, Box, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseTab from '../../components/BaseTab';
import FormBuilder from '../../components/FormBuilder';

export default function FindingsDrawer({
  drawerOpen = false,
  closeDrawer = () => {},
  drawerTitle = ''
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const addNewRecordField = [
    {
      id: 'source_of_the_finding',
      label: t('source_of_the_finding'),
      type: 'dropdown',
      required: true,
      defaultValue: '',
      options: [
        { value: 'default', label: t('default') },
        { value: 'verification_list', label: t('checklist') }
      ]
    },
    {
      id: 'type_of_finding',
      label: t('type_of_finding'),
      type: 'dropdown',
      required: true,
      defaultValue: '',
      options: []
    },
    {
      id: 'reporting_person',
      label: `${t('reporting_person')}`,
      type: 'dropdown',
      defaultValue: '',
      options: []
    },
    {
      id: 'requirement_name',
      label: `${t('requirement_name')}`,
      type: 'dropdown',
      defaultValue: '',
      options: []
    },
    {
      id: 'country',
      label: `${t('country')}`,
      type: 'dropdown',
      defaultValue: '',
      options: []
    },
    {
      id: 'company',
      label: `${t('company')}`,
      type: 'dropdown',
      defaultValue: '',
      options: []
    },
    {
      id: 'department',
      label: `${t('department')} / ${t('province')}`,
      type: 'dropdown',
      defaultValue: '',
      options: []
    },
    {
      id: 'city',
      label: `${t('city')} / ${t('municipality')}`,
      type: 'dropdown',
      defaultValue: '',
      options: []
    },
    {
      id: 'area',
      label: `${t('area')} / ${t('dependency')}`,
      type: 'dropdown',
      defaultValue: '',
      options: []
    },
    {
      id: 'management',
      label: `${t('management')}`,
      type: 'dropdown',
      required: true,
      defaultValue: '',
      options: []
    },
    {
      id: 'contractors',
      label: `${t('contractors')}`,
      type: 'dropdown',
      defaultValue: '',
      options: []
    },
    {
      id: 'contract',
      label: `${t('contract')}`,
      type: 'dropdown',
      defaultValue: '',
      options: []
    }
  ];

  const personRegisterField = [
    {
      id: 'what',
      label: `${t('what')}`,
      type: 'textarea',
      defaultValue: ''
    },
    {
      id: 'when',
      label: `${t('when')}`,
      type: 'datetime',
      defaultValue: ''
    },
    {
      id: 'how_much',
      label: `${t('how_much')}`,
      type: 'text',
      defaultValue: ''
    },
    {
      id: 'which',
      label: `${t('which')}`,
      type: 'textarea',
      defaultValue: ''
    },
    {
      id: 'where',
      label: `${t('where')}`,
      type: 'text',
      defaultValue: ''
    },
    {
      id: 'finding_treatment_responsible',
      label: `${t('finding_treatment_responsible')}`,
      type: 'dropdown',
      defaultValue: '',
      options: []
    },
    {
      id: 'finding_to_be_closed_by',
      label: `${t('finding_to_be_closed_by')}`,
      type: 'dropdown',
      defaultValue: '',
      options: []
    },
    {
      id: 'people_to_notify_about_this_finding',
      label: `${t('people_to_notify_about_this_finding')}`,
      type: 'dropdown',
      defaultValue: '',
      options: []
    },
    {
      id: 'brief_description_of_finding',
      label: `${t('brief_description_of_finding')}`,
      type: 'textarea',
      defaultValue: ''
    },
    {
      id: 'proposed_closure_date',
      label: `${t('proposed_closure_date')}`,
      type: 'datetime',
      defaultValue: ''
    }
  ];

  const addNewRecordValues = {
    source_of_the_finding: '',
    type_of_finding: '',
    reporting_person: '',
    requirement_name: '',
    country: '',
    company: '',
    department: '',
    city: '',
    area: '',
    management: '',
    summary: '',
    contractors: '',
    contract: ''
  };

  const personRegisterValues = {
    what: '',
    when: '',
    how_much: '',
    which: '',
    where: '',
    finding_treatment_responsible: '',
    finding_to_be_closed_by: '',
    people_to_notify_about_this_finding: '',
    brief_description_of_finding: '',
    proposed_closure_date: ''
  };

  const tabList = [
    {
      label: t('add_new_record'),
      field: addNewRecordField,
      initialValues: addNewRecordValues
    },
    {
      label: t('person_registering'),
      field: personRegisterField,
      initialValues: personRegisterValues
    }
  ];

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={closeDrawer}
      PaperProps={{
        sx: {
          maxWidth: '70vw', // Maximum width on all screens
          width: {
            sm: '70vw', // On 1280px width, make it 35vw
            md: '60vw', // On 1366px width, make it 38vw
            lg: '50vw' // On 1920px width and above, make it 40vw
          }
        }
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography color="white" variant="h5" sx={{ flexGrow: 1 }}>
            {drawerTitle}
          </Typography>
          <IconButton edge="end" onClick={closeDrawer} aria-label="close">
            <Close sx={{ color: 'white' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
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
      <Box sx={{ p: 2 }}>
        <Suspense fallback={<p>{t('loading')}</p>}>
          <FormBuilder
            showActionButton={true}
            inputFields={tabList[activeTab]?.field}
            initialValues={tabList[activeTab]?.initialValues}
            controlled={true}
            onChange={(id, value) => {}}
          />
        </Suspense>
      </Box>
    </Drawer>
  );
}
